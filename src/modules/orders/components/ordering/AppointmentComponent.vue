<template>
  <div class="mt-4 p-4 bg-white dark:bg-slate-700 dark:text-white px-4 sm:px-6 lg:px-8 shadow-lg rounded-lg">
    <Toast />

    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-primary-700 dark:text-primary-100">
          Agendar Visita Técnica
        </h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-white">
          Verifica la disponibilidad y agenda una visita técnica.
        </p>
      </div>
    </div>

    <div class="mx-2 flow-root sm:mx-0 mt-6">
      <!-- Formulario para verificar disponibilidad -->
      <div class="space-y-4">
        <div>
          <label for="appointment-date" class="block text-sm font-medium leading-6">Fecha de la cita</label>
          <Calendar
            v-model="appointmentDate"
            inputId="appointment-date"
            dateFormat="yy-mm-dd"
            showIcon
            :minDate="today"
            :manualInput="false"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-slate-600"
          />
        </div>

        <button
          @click="checkGeneralAvailability"
          :disabled="loading"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          <span v-if="loading">Verificando...</span>
          <span v-else>Verificar Disponibilidad</span>
        </button>
      </div>

      <!-- Resultados de disponibilidad -->
      <div v-if="availability" class="mt-6">
        <h2 class="text-lg font-medium">Horarios Disponibles</h2>

        <ul v-if="Array.isArray(availability?.timeSlots)" class="mt-2 space-y-2">
          <li
            v-for="slot in availability.timeSlots"
            :key="slot.time"
            class="p-2 bg-gray-100 dark:bg-slate-600 rounded-md"
          >
            {{ slot.time }} - {{ slot.available ? 'Disponible' : 'No Disponible' }}
          </li>
        </ul>

        <pre v-else class="mt-2 text-xs overflow-auto bg-gray-100 dark:bg-slate-800 p-3 rounded-md">
{{ availability }}
        </pre>
      </div>

      <!-- Agendar Cita -->
      <div v-if="availability" class="mt-6">
        <button
          @click="scheduleAppointment"
          :disabled="loading"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          <span v-if="loading">Agendando...</span>
          <span v-else>Agendar Cita</span>
        </button>
      </div>

      <!-- Tareas existentes -->
      <div class="mt-8">
        <h2 class="text-lg font-medium">Tareas de Visita Existentes</h2>
        <button
          @click="fetchTasks"
          :disabled="loading"
          class="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <span v-if="loading">Buscando...</span>
          <span v-else>Buscar Tareas</span>
        </button>

        <ul v-if="tasks.length > 0" class="mt-4 space-y-2">
          <li v-for="task in tasks" :key="task.id" class="p-3 bg-gray-100 dark:bg-slate-600 rounded-md">
            <p><strong>ID Tarea:</strong> {{ task.id }}</p>
            <p><strong>Estado:</strong> {{ task.status }}</p>
            <p><strong>Fecha:</strong> {{ task.date }}</p>
          </li>
        </ul>
        <p v-else class="mt-4 text-sm text-gray-500">No se encontraron tareas para este cliente/cuenta.</p>
      </div>

      <!-- Mensajes de error -->
      <div v-if="error" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
        <p><strong>Error:</strong> {{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import Toast from 'primevue/toast';
import Calendar from 'primevue/calendar';

import { useAppointmentStore } from '@/stores/AppointmentStore';
import { OrderStore } from '@/stores/OrderStore';

const route = useRoute();

const appointmentStore = useAppointmentStore();
const { availability, tasks, error } = storeToRefs(appointmentStore);
const { order, g_OrderIsActive } = storeToRefs(OrderStore());

const loading = ref(false);

// Calendar como Date real
const today = new Date();
const appointmentDate = ref(new Date());

// helper para enviar yyyy-mm-dd al backend (para endpoints que sí usan fecha)
const formatDate = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const checkGeneralAvailability = async () => {
  loading.value = true;
  const data = { date: formatDate(appointmentDate.value) };
  await appointmentStore.timeInterval(data);
  loading.value = false;
};

const scheduleAppointment = async () => {
  loading.value = true;
  const data = {
    orderId: order.value?.id,
    date: formatDate(appointmentDate.value),
  };
  await appointmentStore.setAppointment(data);
  loading.value = false;
};

const fetchTasks = async () => {
  if (!order.value?.lead?.customer_id) return;
  loading.value = true;
  await appointmentStore.getTaskByCustomerId(order.value.lead.customer_id);
  loading.value = false;
};

onMounted(async () => {
  // 1) Tomar ProcessId y SourceSystem de la URL
  const processId = route.query.ProcessId || route.query.processId || route.query.processID;
  const sourceSystem = route.query.SourceSystem || route.query.sourceSystem;

  // 2) Llamar checkAvailability sin payload apenas monta
  if (processId && sourceSystem) {
    loading.value = true;
    await appointmentStore.checkAvailability(processId, sourceSystem);
    loading.value = false;
  }
});
</script>
