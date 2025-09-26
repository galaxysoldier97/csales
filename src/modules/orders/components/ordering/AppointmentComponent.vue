<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import Calendar from 'primevue/calendar';
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import ProgressBar from 'primevue/progressbar';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useAppointmentStore } from '@/stores/AppointmentStore';

const route = useRoute();
const toast = useToast();
const appointmentStore = useAppointmentStore();

const {
  entryDates,
  taskId,
  sourceSystem,
  ProcesId,
  LoadingTemplate,
  LoadingTemplateProccess,
  isError,
  saveError,
  errorMessage,
  hasRecords,
  canUnify,
  records,
} = storeToRefs(appointmentStore);

const entryDatesData = computed(() => entryDates.value ?? {});

const appointmentStatus = ref(null);
const date = ref(new Date());
const selectedDate = ref(null);
const selectedCategory = ref('Producción');
const startValues = ref([]);
const newMinDate = ref(null);
const newMaxDate = ref(null);
const availableNotDates = ref(null);
const availableTimes = ref(null);
const is8AMAvailable = ref(false);
const is12PMAvailable = ref(false);
const userDate = ref(null);
const selectedDateUser = ref(null);
const searchDate = ref(null);
const dueDatex = ref(null);
const valueDueDate = ref(true);
const errorPantalla = ref(false);
const orderNotAssigned = ref(false);
const isUnificacion = ref(false);
const savedSelectedRecord = ref(null);
const selectedRecord = ref(null);
const hasUnificacionEnd = ref(false);
const unificacionState = ref(true);
const noSlotsDisplayed = ref(false);

const categories = ref([
  { name: '08:00 AM a 12:00 PM', key: 'A' },
  { name: '1:00 PM a 4:00 PM', key: 'M' },
]);

const filteredCategories = computed(() =>
  categories.value.filter((category) => !isCategoryDisabled(category.name))
);

const onDateSelected = () => {
  if (date.value && date.value instanceof Date && !isNaN(date.value.getTime())) {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    selectedDate.value = date.value.toLocaleDateString('en-US', options);
  } else {
    console.error('Error1: La fecha no es un objeto Date válido.');
  }
};

const isCategoryDisabled = (categoryName) => {
  if (categoryName === '08:00 AM a 12:00 PM') {
    return !is8AMAvailable.value;
  }
  if (categoryName === '1:00 PM a 4:00 PM') {
    return !is12PMAvailable.value;
  }
  return false;
};

const agendar = async () => {
  appointmentStore.LoadingTemplateProccess = true;

  try {
    if (!selectedDate.value || !selectedCategory.value) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Falta agregar fecha u hora.', life: null });
      return;
    }

    let selectedStartTime;
    if (selectedCategory.value === '08:00 AM a 12:00 PM') {
      selectedStartTime = 8;
    } else if (selectedCategory.value === '1:00 PM a 4:00 PM') {
      selectedStartTime = 13;
    }

    let selectedDateObject = new Date(selectedDate.value);
    if (isNaN(selectedDateObject)) {
      selectedDateObject = new Date(selectedDate.value);
    }

    selectedDateObject.setHours(selectedStartTime);
    selectedDateObject.setHours(selectedDateObject.getHours() - 5);

    const selectedSlot = findSelectedSlot(selectedDateObject);

    if (!selectedSlot) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontró un slot disponible.', life: null });
      appointmentStore.LoadingTemplateProccess = false;
      return;
    }

    const currentEntry = entryDatesData.value;
    if (!currentEntry.MCExternalRefID) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontró la orden a agendar.', life: null });
      appointmentStore.LoadingTemplateProccess = false;
      return;
    }

    let citaAgendada = {
      MCExternalRefID: currentEntry.MCExternalRefID,
      StartDate: selectedSlot.start,
      Grade: selectedSlot.grade,
      FinishDate: selectedSlot.finish,
      SourceSystem: sourceSystem.value,
    };

    if (isUnificacion.value && savedSelectedRecord.value) {
      citaAgendada = {
        ...citaAgendada,
        TaskTypeNew: savedSelectedRecord.value.TaskTypeNew,
        MCExternalRefID_Old: savedSelectedRecord.value.CallID,
      };
    }

    const data = await appointmentStore.newAppointment(citaAgendada);

    if (data.records.AppointmentStatus !== 'Asignado' && data.records.AppointmentStatus !== 'Abierto') {
      data.records.AppointmentStatus = data.records[0]?.Status ?? data.records.AppointmentStatus;
    }

    if (data.records.AppointmentStatus === 'Abierto') {
      await new Promise((resolve) => setTimeout(resolve, data.records.timeout));
      await gettask();
    } else if (data.records.AppointmentStatus === 'Asignado') {
      await redictToTytan();
    }
  } catch (error) {
    appointmentStore.LoadingTemplateProccess = false;
    const response = error.response?.data;
    if (response?.message === 'Abierto') {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Tarea no asignada', life: null });
    } else {
      let detailMessage = 'Ocurrió un error al agendar.';
      if (response?.message) {
        detailMessage += ` ${response.message}`;
      }

      const errors = response?.errors;
      if (errors) {
        let messages = [];
        if (Array.isArray(errors)) {
          messages = errors.map((item) => item.message ?? item);
        } else if (typeof errors === 'object') {
          messages = Object.values(errors).map((value) => value.message ?? value);
        } else {
          messages = [errors];
        }
        if (messages.length) {
          detailMessage += ` - Detalle: ${messages.join(', ')}`;
        }
      }

      toast.add({ severity: 'error', summary: 'Error', detail: detailMessage, life: null });
    }
  }
};

const gettask = async () => {
  try {
    const currentEntry = entryDatesData.value;
    if (!currentEntry.MCExternalRefID) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontró la orden a procesar.', life: null });
      return;
    }

    let citaAgendada = {
      MCExternalRefID: currentEntry.MCExternalRefID,
      SourceSystem: sourceSystem.value,
    };

    if (isUnificacion.value && savedSelectedRecord.value) {
      citaAgendada = {
        ...citaAgendada,
        MCExternalRefID_Old: savedSelectedRecord.value.CallID,
      };
    }

    const data = await appointmentStore.getTaskStatus(citaAgendada);

    if (data.AppointmentStatus === 'Abierto') {
      let errorCountGetTask = parseInt(localStorage.getItem('errorCountGetTask') || '0', 10);
      errorCountGetTask += 1;
      localStorage.setItem('errorCountGetTask', errorCountGetTask);

      if (errorCountGetTask < 3) {
        entryDates.value = {
          ...entryDates.value,
          District: data.District,
          TypeTask: data.TypeTask,
        };
        appointmentStore.LoadingTemplateProccess = false;
        orderNotAssigned.value = true;
      } else {
        errorPantalla.value = true;
        appointmentStore.LoadingTemplateProccess = false;
      }
    } else {
      localStorage.removeItem('errorCountGetTask');
      await redictToTytan();
    }
  } catch (error) {
    appointmentStore.LoadingTemplateProccess = false;
    const response = error.response?.data;
    if (response?.message === 'Abierto') {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Tarea no asignada', life: null });
    } else {
      let detailMessage = 'Ocurrió un error al agendar.';
      if (response?.message) {
        detailMessage += ` ${response.message}`;
      }

      const errors = response?.errors;
      if (errors) {
        let messages = [];
        if (Array.isArray(errors)) {
          messages = errors.map((item) => item.message ?? item);
        } else if (typeof errors === 'object') {
          messages = Object.values(errors).map((value) => value.message ?? value);
        } else {
          messages = [errors];
        }
        if (messages.length) {
          detailMessage += ` - Detalle: ${messages.join(', ')}`;
        }
      }

      toast.add({ severity: 'error', summary: 'Error', detail: detailMessage, life: null });
    }
  }
};

const findSelectedSlot = (selectedDateObject) => {
  if (!entryDates.value?.slot) return null;

  return entryDates.value.slot.find((slot) => {
    const slotDate = convertToGMTMinus5(new Date(slot.start));
    return slotDate.getTime() === selectedDateObject.getTime();
  });
};

const convertToGMTMinus5 = (dateString) => {
  const dateObj = new Date(dateString);
  const currentOffset = dateObj.getTimezoneOffset();
  const targetOffset = 300;

  if (currentOffset !== targetOffset) {
    const offsetDifference = currentOffset - targetOffset;
    dateObj.setMinutes(dateObj.getMinutes() + offsetDifference);
  }

  return dateObj;
};

const filterAvailableTimes = () => {
  if (!selectedDate.value) {
    return;
  }

  let selectedDateObject = new Date(selectedDate.value);
  if (isNaN(selectedDateObject)) {
    selectedDateObject = new Date(selectedDate.value);
  }

  const selectedDateOnly = selectedDateObject.toISOString().split('T')[0];
  const allTimes = Array.from({ length: 24 }, (_, i) => i);

  const timesInSelectedDate = startValues.value
    .filter((entry) => entry.toISOString().split('T')[0] === selectedDateOnly)
    .map((entry) => entry.getHours());

  availableTimes.value = allTimes.filter((time) => timesInSelectedDate.includes(time));

  is8AMAvailable.value = availableTimes.value.includes(8);
  is12PMAvailable.value = availableTimes.value.includes(13);
};

const handleNoSlotDates = async () => {
  if (valueDueDate.value === true) {
    await searchDueDate();
  }

  appointmentStore.LoadingTemplate = false;
  appointmentStore.isError = false;

  const fechaActual = new Date();
  const diasASumar = dueDatex.value ?? 0;
  const nuevaFecha = new Date(fechaActual);
  nuevaFecha.setDate(fechaActual.getDate() + diasASumar);

  newMinDate.value = nuevaFecha;

  const opciones = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const fechaActualFormateada = fechaActual.toLocaleDateString('es-ES', opciones);
  const nuevaFechaFormateada = nuevaFecha.toLocaleDateString('es-ES', opciones);

  searchDate.value = true;

  if (!noSlotsDisplayed.value) {
    const mensajeError = `No hay Fechas Disponibles desde ${fechaActualFormateada} hasta ${nuevaFechaFormateada}`;
    toast.add({ severity: 'error', summary: 'Error', detail: mensajeError, life: 4000 });
    noSlotsDisplayed.value = true;
  }
};

watchEffect(() => {
  if (isError.value) {
    if (errorMessage.value) {
      toast.add({ severity: 'error', summary: 'Error', detail: errorMessage.value, life: null });
    } else if (saveError.value?.data?.errors) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: `Error: ${saveError.value.status} -> ${saveError.value.data.errors}`,
        life: null,
      });

      let errorCount = parseInt(localStorage.getItem('errorCount') || '0', 10);
      if (saveError.value.data.message === 'LOADING_SOAP') {
        errorCount += 1;
        localStorage.setItem('errorCount', errorCount);

        if (errorCount < 3) {
          window.location.reload();
        }
      } else {
        localStorage.removeItem('errorCount');
      }
    } else if (saveError.value) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: `Error: ${saveError.value.status} -> ${saveError.value.statusText}`,
        life: null,
      });
    }
  }

  if (entryDates.value?.slot?.length > 0) {
    appointmentStore.LoadingTemplate = false;
    noSlotsDisplayed.value = false;

    startValues.value = entryDates.value.slot.map((entry) => {
      const values = new Date(entry.start);
      return convertToGMTMinus5(values);
    });

    const timestamps = startValues.value.map((currentDate) => currentDate.getTime());
    const minDate = new Date(Math.min(...timestamps));
    const maxDate = new Date(Math.max(...timestamps));

    newMinDate.value = new Date(minDate);
    newMaxDate.value = new Date(maxDate);

    const allDates = [];
    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
      allDates.push(new Date(d));
    }

    availableNotDates.value = allDates.filter((currentDate) => {
      const timesInDate = startValues.value.filter(
        (startDate) => startDate.toLocaleDateString() === currentDate.toLocaleDateString()
      );
      return timesInDate.length === 0;
    });

    if (selectedDate.value) {
      filterAvailableTimes();
    }
  } else if (entryDates.value?.AppointmentStatus) {
    appointmentStore.LoadingTemplate = false;
    appointmentStatus.value = entryDates.value.AppointmentStatus;
    searchDate.value = false;
    noSlotsDisplayed.value = false;
  } else {
    startValues.value = [];

    if (entryDates.value?.slot && !isError.value && valueDueDate.value === true) {
      handleNoSlotDates();
    }
  }
});

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const reagendar = async () => {
  try {
    orderNotAssigned.value = false;
    if (appointmentStore.LoadingTemplateProccess) {
      appointmentStore.LoadingTemplateProccess = true;
    } else {
      appointmentStore.LoadingTemplate = true;
    }

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 6);
    const formattedDate = formatDate(currentDate);

    const currentEntry = entryDatesData.value;
    if (!currentEntry.MCExternalRefID) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontró la orden para reagendar.', life: null });
      appointmentStore.LoadingTemplate = false;
      appointmentStore.LoadingTemplateProccess = false;
      return;
    }

    let reAgendarCita = {
      MCExternalRefID: currentEntry.MCExternalRefID,
      District: currentEntry.District,
      TaskType: currentEntry.TypeTask,
      DueDate: formattedDate,
      SourceSystem: sourceSystem.value,
    };

    if (isUnificacion.value && selectedRecord.value) {
      reAgendarCita = {
        ...reAgendarCita,
        TaskType: selectedRecord.value.TaskTypeNew,
      };
    }

    const data = await appointmentStore.timeInterval(reAgendarCita);

    toast.add({ severity: 'info', summary: 'Exitoso', detail: 'datos del reagendar listo.', life: 4000 });

    selectedCategory.value = null;
    date.value = null;

    if (data?.records) {
      entryDates.value.slot = Array.isArray(data.records) ? data.records : [data.records];
    }

    entryDates.value.AppointmentStatus = null;
    appointmentStatus.value = null;
    appointmentStore.LoadingTemplate = false;
    appointmentStore.LoadingTemplateProccess = false;
  } catch (error) {
    const response = error.response?.data;
    let detailMessage = 'Ocurrió un error al agendar.';
    if (response?.message) {
      detailMessage += ` ${response.message}`;
    }

    const errors = response?.errors;
    if (errors) {
      let messages = [];
      if (Array.isArray(errors)) {
        messages = errors.map((item) => item.message ?? item);
      } else if (typeof errors === 'object') {
        messages = Object.values(errors).map((value) => value.message ?? value);
      } else {
        messages = [errors];
      }
      if (messages.length) {
        detailMessage += ` - Detalle: ${messages.join(', ')}`;
      }
    }

    toast.add({ severity: 'error', summary: 'Error', detail: detailMessage, life: null });
    appointmentStore.LoadingTemplate = false;
    appointmentStore.LoadingTemplateProccess = false;
    searchDate.value = true;
  }
};

const cancelar = async () => {
  try {
    appointmentStore.LoadingTemplate = true;

    const currentEntry = entryDatesData.value;
    if (!currentEntry.MCExternalRefID && !(isUnificacion.value && selectedRecord.value)) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontró la orden a cancelar.', life: null });
      appointmentStore.LoadingTemplate = false;
      return;
    }

    let citaCancelada = {
      MCExternalRefID: currentEntry.MCExternalRefID,
      Status: 'Cancelado',
      SourceSystem: sourceSystem.value,
    };

    if (isUnificacion.value && selectedRecord.value) {
      citaCancelada = {
        MCExternalRefID: selectedRecord.value.CallID,
        Status: 'Cancelado',
        SourceSystem: sourceSystem.value,
      };
    }

    await appointmentStore.updateStatus(citaCancelada);
    toast.add({ severity: 'info', summary: 'Exitoso', detail: 'Se ha cancelado correctamente.', life: 4000 });

    if (!isUnificacion.value) {
      await redictToTytan();
    }

    selectedCategory.value = null;
    date.value = null;
    appointmentStore.LoadingTemplate = false;
  } catch (error) {
    const response = error.response?.data;
    let detailMessage = 'Ocurrió un error al cancelado.';
    if (response?.message) {
      detailMessage += ` ${response.message}`;
    }

    toast.add({ severity: 'error', summary: 'Error', detail: detailMessage, life: null });
    appointmentStore.LoadingTemplate = false;
  }
};

const onDateSelectedNew = () => {
  if (userDate.value && userDate.value instanceof Date && !isNaN(userDate.value.getTime())) {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    selectedDateUser.value = userDate.value.toLocaleDateString('en-US', options);
  } else {
    console.error('Error1: La fecha no es un objeto Date válido.');
  }
};

const searchNewDate = async () => {
  try {
    appointmentStore.LoadingTemplate = true;

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 6);
    const formattedDate = formatDate(currentDate);

    let selectedDateObject = new Date(selectedDateUser.value);
    const formattedDateNew = formatDate(selectedDateObject);

    const currentEntry = entryDatesData.value;
    if (!currentEntry.MCExternalRefID) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontró la orden para consultar.', life: null });
      appointmentStore.LoadingTemplate = false;
      return;
    }

    const reAgendarCita = {
      MCExternalRefID: currentEntry.MCExternalRefID,
      District: currentEntry.District ?? 'District',
      TaskType: currentEntry.TypeTask ?? 'TaskType',
      DueDate: formattedDate,
      SourceSystem: sourceSystem.value,
      UserDate: formattedDateNew,
    };

    await appointmentStore.timeInterval(reAgendarCita);

    toast.add({ severity: 'info', summary: 'Exitoso', detail: 'datos del reagendar listo.', life: 4000 });

    selectedCategory.value = null;
    date.value = null;

    entryDates.value.AppointmentStatus = null;
    appointmentStatus.value = null;
    appointmentStore.LoadingTemplate = false;
    searchDate.value = false;
  } catch (error) {
    entryDates.value.slot = null;
    const response = error.response?.data;

    const partesFechaSeleccionada = selectedDateUser.value.split('/');
    const fechaActual = new Date(partesFechaSeleccionada[2], partesFechaSeleccionada[0] - 1, partesFechaSeleccionada[1]);
    await searchDueDate();
    const diasASumar = dueDatex.value;
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setDate(fechaActual.getDate() + diasASumar);

    newMinDate.value = nuevaFecha;

    const opciones = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const fechaActualFormateada = fechaActual.toLocaleDateString('es-ES', opciones);
    const nuevaFechaFormateada = nuevaFecha.toLocaleDateString('es-ES', opciones);

    searchDate.value = true;

    const mensajeError = `No hay Fechas Disponibles desde ${fechaActualFormateada} hasta ${nuevaFechaFormateada}`;
    toast.add({ severity: 'error', summary: 'Error', detail: mensajeError, life: 4000 });

    appointmentStore.LoadingTemplate = false;
    searchDate.value = true;
  }
};

const gotoNewDate = async () => {
  selectedDate.value = null;
  newMinDate.value = new Date();
  searchDate.value = true;
};

const dispatch = async () => {
  try {
    appointmentStore.LoadingTemplate = true;
    const currentEntry = entryDatesData.value;
    if (!currentEntry.MCExternalRefID) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontró la orden para actualizar.', life: null });
      appointmentStore.LoadingTemplate = false;
      return;
    }

    const citaCancelada = {
      MCExternalRefID: currentEntry.MCExternalRefID,
      Status: 'Suspendida',
      SourceSystem: sourceSystem.value,
      Dispatch: 'Y',
    };

    await appointmentStore.dispatchStatus(citaCancelada);
    appointmentStore.isError = null;
    toast.add({ severity: 'info', summary: 'Exitoso', detail: 'Se ha actualizado correctamente.', life: 4000 });

    selectedCategory.value = null;
    date.value = null;
    appointmentStatus.value = false;
    entryDates.value.AppointmentStatus = null;
    appointmentStore.LoadingTemplate = false;
    window.location.reload();
  } catch (error) {
    const response = error.response?.data;
    let detailMessage = 'Ocurrió un error al actualizar.';
    if (response?.message) {
      detailMessage += ` ${response.message}`;
    }

    toast.add({ severity: 'error', summary: 'Error', detail: detailMessage, life: null });
    appointmentStore.LoadingTemplate = false;
  }
};

const unifyAppointments = async () => {
  unificacionState.value = false;
  isUnificacion.value = true;
  await reagendar();

  selectedRecord.value = null;
  hasUnificacionEnd.value = true;
};

const toggleSelect = (record) => {
  savedSelectedRecord.value = record;
  selectedRecord.value = selectedRecord.value === record ? null : record;
};

const isSelected = (record) => selectedRecord.value === record;

const scheduleAppointment = async () => {
  canUnify.value = false;
  hasRecords.value = false;
  isUnificacion.value = false;
  await reagendar();
};

async function searchDueDate() {
  try {
    valueDueDate.value = false;
    dueDatex.value = await appointmentStore.searchDueDate();
  } catch (error) {
    console.error('Error en Due Date', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error en DueDate.', life: null });
  }
}

const redictToTytan = async () => {
  try {
    appointmentStore.LoadingTemplateProccess = false;

    toast.add({ severity: 'info', summary: 'Exitoso', detail: 'Agenda Enviada Correctamente', life: 4000 });

    const processId = ProcesId.value;
    const source = sourceSystem.value;

    const urlDev1 = import.meta.env.VITE_TytanBS_DEV1;
    const urlProj1 = import.meta.env.VITE_TytanBS_DBPROJ1;
    const urlProj2 = import.meta.env.VITE_TytanBS_DBPROJ2;
    const urlProd = import.meta.env.VITE_TytanBS_PREPROD;
    const urlProdoc = import.meta.env.VITE_TytanBS;

    const fullUrlDev1 = `${urlDev1}${processId}`;
    const fullUrlProj1 = `${urlProj1}${processId}`;
    const fullUrlProj2 = `${urlProj2}${processId}`;
    const fullUrlProd = `${urlProd}${processId}`;
    const fullUrlProdoc = `${urlProdoc}${processId}`;

    switch (source) {
      case 'TytanBS_DEV1':
        window.open(fullUrlDev1, '_self');
        break;
      case 'TytanBS_DBPROJ1':
        window.open(fullUrlProj1, '_self');
        break;
      case 'TytanBS_DBPROJ2':
        window.open(fullUrlProj2, '_self');
        break;
      case 'TytanBS_PREPROD':
        window.open(fullUrlProd, '_self');
        break;
      case 'TytanBS':
        window.open(fullUrlProdoc, '_self');
        break;
      default:
        break;
    }
  } catch (error) {
    console.error('Error al Ir a Tytan:', error);
  }
};

const redictToTytanErrors = async () => {
  try {
    appointmentStore.LoadingTemplateProccess = false;

    toast.add({ severity: 'error', summary: 'Error', detail: 'Orden no Asignada', life: 4000 });

    const processId = ProcesId.value;
    const source = sourceSystem.value;

    const urlDev1 = import.meta.env.VITE_TytanBS_DEV1;
    const urlProj1 = import.meta.env.VITE_TytanBS_DBPROJ1;
    const urlProj2 = import.meta.env.VITE_TytanBS_DBPROJ2;
    const urlProd = import.meta.env.VITE_TytanBS_PREPROD;
    const urlProdoc = import.meta.env.VITE_TytanBS;

    const fullUrlDev1 = `${urlDev1}${processId}`;
    const fullUrlProj1 = `${urlProj1}${processId}`;
    const fullUrlProj2 = `${urlProj2}${processId}`;
    const fullUrlProd = `${urlProd}${processId}`;
    const fullUrlProdoc = `${urlProdoc}${processId}`;

    switch (source) {
      case 'TytanBS_DEV1':
        window.open(fullUrlDev1, '_self');
        break;
      case 'TytanBS_DBPROJ1':
        window.open(fullUrlProj1, '_self');
        break;
      case 'TytanBS_DBPROJ2':
        window.open(fullUrlProj2, '_self');
        break;
      case 'TytanBS_PREPROD':
        window.open(fullUrlProd, '_self');
        break;
      case 'TytanBS':
        window.open(fullUrlProdoc, '_self');
        break;
      default:
        break;
    }
  } catch (error) {
    console.error('Error al Ir a Tytan:', error);
  }
};

const detectPageEntry = () => {
  const entries = performance.getEntriesByType('navigation');
  const isReload = entries.length > 0 && entries[0].type === 'reload';
  const isNewTab = localStorage.getItem('pageOpened');

  let errorCountGetTask = parseInt(localStorage.getItem('errorCountGetTask') || '0', 10);

  if (isReload) {
    if (errorCountGetTask > 2) {
      errorPantalla.value = true;
      appointmentStore.LoadingTemplateProccess = false;
    }
  } else if (isNewTab) {
    if (errorCountGetTask > 2) {
      errorPantalla.value = true;
      appointmentStore.LoadingTemplateProccess = false;
    }
  } else {
    localStorage.setItem('errorCountGetTask', '0');
  }

  localStorage.setItem('pageOpened', 'true');

  window.addEventListener('beforeunload', () => {
    localStorage.removeItem('pageOpened');
  });
};

const gotomaster = async (url) => {
  const currentUrl = window.location.href;
  const [baseUrl] = currentUrl.split('?');
  const newUrl = `${baseUrl}${url}`;

  window.open(newUrl, '_self');
  window.location.reload();
};

onMounted(async () => {
  detectPageEntry();
  appointmentStore.setRouteContext({
    processId: route.query.ProcessId,
    sourceSystem: route.query.SourceSystem,
    taskId: route.query.taskId,
  });
  try {
    await appointmentStore.fetchEvents();
  } catch (error) {
    // Los errores ya se manejan en la acción; se mantiene el catch para evitar advertencias
  }
});
</script>

<template>
  <div>
    <div v-if="LoadingTemplate" class="spinner-container">
      <ProgressSpinner />
    </div>

    <div v-if="LoadingTemplateProccess" class="progress-overlay">
      <div class="progress-content">
        <p>Por favor, espere mientras procesamos su solicitud...</p>
        <ProgressBar mode="indeterminate" style="height: 6px; width: 100%;" />
      </div>
    </div>

    <div v-if="orderNotAssigned" class="dialog-overlay">
      <div class="dialog-content">
        <p>Orden no asignada</p>
        <p>Por favor, oprima "Aceptar" para seleccionar una nueva fecha</p>
        <button @click="reagendar" class="accept-button">Aceptar</button>
      </div>
    </div>

    <div v-if="errorPantalla" class="dialog-overlay">
      <div class="dialog-content">
        <p>Orden pendiente de asignación</p>
        <p>Seleccione "Aceptar" y escale a Centro de Comando para validar la visita no agendada</p>
        <button @click="redictToTytanErrors" class="accept-button">Aceptar</button>
      </div>
    </div>

    <div class="records-container" v-if="hasRecords && !hasUnificacionEnd">
      <div
        class="record-card"
        v-for="record in records"
        :key="record.CallID"
        :class="{ selected: isSelected(record) }"
        @click="toggleSelect(record)"
      >
        <div class="wordf">
          <h5>
            Fecha Asignada <br />
            <h2 class="resp">{{ record.ScheduleDate }}</h2>
          </h5>
        </div>
        <div class="csales">
          <h5>
            ID - SalesForces WO <br />
            <h2 class="resp">{{ record.CallID }}</h2>
          </h5>
        </div>
        <div class="typetask">
          <h5>
            Tipo de tarea <br />
            <h2 class="resp">{{ record.TaskType }}</h2>
          </h5>
        </div>

        <div class="wordf">
          <h5>
            Estado <br />
            <h2 class="resp">{{ record.AppointmentStatus }}</h2>
          </h5>
        </div>
      </div>
    </div>

    <div class="grid buttons-container" v-if="canUnify && hasRecords && !LoadingTemplate">
      <button class="custom-button green-button" @click="scheduleAppointment" v-if="unificacionState">
        Agendar Cita
      </button>
      <button class="custom-button" @click="unifyAppointments" v-if="canUnify && selectedRecord">
        Unificar Cita
      </button>
    </div>

    <div
      class="grid"
      v-if="
        !LoadingTemplate &&
        !isError &&
        !searchDate &&
        !LoadingTemplateProccess &&
        !errorPantalla &&
        !orderNotAssigned &&
        (!hasRecords || hasUnificacionEnd)
      "
    >
      <div class="col1" v-if="!appointmentStatus">
        <div class="calendar-container" style="width: 700px;">
          <div class="text-3xl">Seleccione un día del calendario para agendar</div>
          <Calendar
            v-model="date"
            :today="null"
            inline
            :disabledDates="availableNotDates"
            :minDate="newMinDate"
            :maxDate="newMaxDate"
            @click="onDateSelected"
          >
            <template #date="slotProps">
              <span>
                {{ slotProps.date ? slotProps.date.day : 'Invalid Date' }}
              </span>
            </template>
          </Calendar>
        </div>
        <Button
          label="Buscar Disponibilidad"
          @click="gotoNewDate"
          class="mt-4 p-button-success"
          style="margin-right: 20px;"
        />
      </div>
      <div class="col2" v-if="selectedDate && !appointmentStatus">
        <div class="hora-select">
          <div class="fecha">
            <h5>
              Fecha seleccionada <br />
              <h2 class="resp">{{ selectedDate }}</h2>
            </h5>
          </div>

          <div class="wordf" v-if="!canUnify">
            <h5>
              Tipo de tarea <br />
              <h2 class="resp">{{ entryDatesData.typeTask || entryDatesData.TypeTask }}</h2>
            </h5>
          </div>
          <div class="wordf" v-if="canUnify">
            <h5>
              Tipo de tarea <br />
              <h2 class="resp">{{ savedSelectedRecord?.TaskTypeNew }}</h2>
            </h5>
          </div>

          <div class="csales">
            <h5>
              ID - SalesForces WO <br />
              <h2 class="resp">{{ entryDatesData.MCExternalRefID }}</h2>
            </h5>
          </div>
          <div>
            <label>
              <h5>Seleccionar hora:</h5>
            </label>
            <div v-for="category in filteredCategories" :key="category.key" class="flex align-items-center">
              <RadioButton
                v-model="selectedCategory"
                :inputId="category.key"
                name="dynamic"
                :value="category.name"
                :disabled="isCategoryDisabled(category.name)"
              />
              <label :for="category.key" class="ml-2">{{ category.name }}</label>
            </div>
          </div>
          <div class="agendar">
            <Toast />
            <Button
              label="Agendar"
              severity="info"
              raised
              style="background-color: #002575; border-color: #002575;"
              @click="agendar"
            />
          </div>
        </div>
      </div>
      <div class="col21" v-if="appointmentStatus">
        <div class="hora-select">
          <div class="fecha" v-if="appointmentStatus === 'Asignado'">
            <h5>
              Fecha Asignada <br />
              <h2 class="resp">{{ entryDatesData.ScheduleDate }}</h2>
            </h5>
          </div>
          <div class="csales">
            <h5>
              ID - SalesForces WO <br />
              <h2 class="resp">{{ entryDatesData.MCExternalRefID }}</h2>
            </h5>
          </div>
          <div class="typetask">
            <h5>
              Tipo de tarea <br />
              <h2 class="resp">{{ entryDatesData.TypeTask }}</h2>
            </h5>
          </div>
          <div class="wordf">
            <h5>
              Estado <br />
              <h2 class="resp">{{ entryDatesData.AppointmentStatus }}</h2>
            </h5>
          </div>
          <div class="wordfs" v-if="appointmentStatus === 'Unificado'">
            <h5>
              Master_ID - SalesForces WO <br />
              <h2 class="resp">{{ entryDatesData.Master_ID }}</h2>
            </h5>
          </div>
          <div class="grid buttons-container" v-if="appointmentStatus === 'Unificado'" style="margin-top: 1rem;">
            <Button
              severity="info"
              raised
              style="background-color: #002575; border-color: #002575; margin-right: 10px;"
              @click="gotomaster(entryDatesData.URL)"
            >
              Ir a Orden Master
            </Button>
          </div>

          <div class="re-agendar" v-if="appointmentStatus === 'Asignado'">
            <Toast />
            <Button
              label="Re-Agendar"
              severity="info"
              raised
              style="background-color: #002575; border-color: #002575; margin-right: 10px;"
              @click="reagendar"
            />
            <Button
              label="Cancelar Cita"
              severity="info"
              raised
              style="background-color: red; border-color: red; color: white;"
              @click="cancelar"
            />
          </div>
          <div class="dispacth" v-if="appointmentStatus === 'Dispatched'">
            <Toast />
            <Button
              label="Re-Agendar"
              severity="info"
              raised
              style="background-color: #002575; border-color: #002575; margin-right: 10px;"
              @click="dispatch"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="grid" style="display: flex; gap: 20px;">
      <div class="col1" v-if="searchDate && !hasRecords" style="flex: 1;">
        <div :class="{ 'calendar-container': true, 'no-colors': searchDate }" style="width: 700px;">
          <div class="text-3xl">
            Seleccione un dia para verificar la disponibilidad.
          </div>

          <div style="margin-top: 1rem;">
            <Calendar v-model="userDate" :today="null" inline :minDate="newMinDate" @click="onDateSelectedNew">
              <template #date="slotProps">
                <span>
                  {{ slotProps.date ? slotProps.date.day : 'Invalid Date' }}
                </span>
              </template>
            </Calendar>
          </div>
        </div>
      </div>

      <div class="col2" v-if="selectedDateUser && !hasRecords" style="flex: 1; margin-top: 50px;">
        <div class="hora-select">
          <div class="fecha">
            <h5>
              Fecha seleccionada <br />
              <h2 class="resp">{{ selectedDateUser }}</h2>
            </h5>
          </div>
          <div class="wordf">
            <h5>
              Tipo de tarea <br />
              <h2 class="resp">{{ entryDatesData.typeTask || entryDatesData.TypeTask }}</h2>
            </h5>
          </div>
          <div class="csales">
            <h5>
              ID - SalesForces WO <br />
              <h2 class="resp">{{ entryDatesData.MCExternalRefID }}</h2>
            </h5>
          </div>
        </div>
        <Button
          label="Consultar Disponibilidad"
          @click="searchNewDate"
          style="background-color: #002575; border-color: #002575;"
          class="mt-4"
          v-if="selectedDateUser"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
[data-pc-section='tableheaderrow'] {
  background-color: #ffffff;
  color: #333;
  font-weight: bold;
}

.no-colors .p-datepicker td span {
  background-color: transparent !important;
  color: rgb(0, 0, 0) !important;
}

.no-colors .p-datepicker td.p-datepicker-current-day span {
  background-color: #f0f0f0 !important;
  color: rgb(0, 0, 0) !important;
}

.no-colors .p-datepicker td:hover span {
  background-color: #e0e0e0 !important;
  color: rgb(0, 0, 0) !important;
}

.p-disabled {
  cursor: default !important;
  pointer-events: none;
  user-select: none;
  color: #b6b6b6;
}

.p-datepicker {
  background-color: #ffffff;
  color: #002671;
  font-weight: bold;
}

.text-3xl {
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.grid {
  display: flex;
  flex-wrap: wrap;
}

.col1,
.col2 {
  flex: 1;
  min-width: min-content;
  max-width: max-content;
  margin: 1%;
  box-sizing: border-box;
}

.col21 {
  flex: 1;
  min-width: min-content;
  max-width: max-content;
  margin: 1%;
  margin-top: 4rem;
}

.calendar-container {
  width: 100%;
}

.hora-select {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 4%;
}

.p-calendar {
  width: 100%;
}

.agendar,
.re-agendar {
  margin-top: 1rem;
}

.flex {
  margin-top: 2%;
}

.resp {
  font-size: 2.3rem;
  color: #002575;
  margin-top: 0.1rem;
  overflow-wrap: break-word;
}

.fecha {
  margin-top: 3.5rem;
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
}

.progress-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.progress-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 300px;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.accept-button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.accept-button:hover {
  background-color: #0056b3;
}

.records-container {
  display: flex;
  gap: 5rem;
  margin-bottom: 20px;
}

.record-card {
  border: 1px solid #002575;
  padding: 20px;
  min-width: 200px;
  transition: border 0.3s ease;
  word-wrap: break-word;
  border-radius: 10px;
}

.record-card.selected {
  border: 3px solid #002575;
}

.custom-buttons-container {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-start;
}

.custom-button {
  background-color: #002575;
  color: white;
  border: none;
  padding: 10px 25px;
  margin-right: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 10px;
}

.custom-button:hover {
  background-color: #000066;
}

.custom-button.green-button {
  background-color: #28a745;
  border-color: #28a745;
  transition: background-color 0.3s ease;
}

.custom-button.green-button:hover {
  background-color: #28a7468c;
}
</style>
