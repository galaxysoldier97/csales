<template> 
    <div class="mt-4 p-4 bg-white dark:bg-slate-700 dark:text-white px-4 sm:px-6 lg:px-8 shadow-lg rounded-lg" v-if="order.lead_ordering.find( item =>item.action_sales_type >0 && item.object_type =='phone')"  >
        <Toast />
 
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-primary-700 dark:text-primary-100"> Resultado Móvil</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-white">   </p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none"> 
        <Button v-if="g_OrderIsActive" label="Refrescar" icon="pi pi-refresh" @click="fngetintegracionMovil" size="small"/>
      </div>
    </div>
    <div class="mx-2 flow-root sm:mx-0"> 
        <DataTable class="mt-2" :value="data_integracionMovil.filter( item => item.linea!=null)"   tableStyle="min-width: 50rem">
            <Column field="simcard" header="SimCard"></Column>
            <Column field="linea" header="Línea"></Column>
            <Column field="planmov" header="Plan Móvil"></Column>
            <Column field="num_abonado" header="Número Abonado"></Column>   
            <Column field="num_venta" header="Número Venta"></Column>
            <Column field="billingprocess_id" header="ID Proceso"></Column>
            <Column field="sol_portacion" header="Sol. Portabilidad"></Column>
            <Column field="est_aceptacionventa" header="Aceptada"></Column>
            <Column field="est_cierreventa" header="Cierre Venta"></Column>
            <Column field="des_resultmessage" header="Resultado"></Column>
        </DataTable>

        <div v-if="order.lead_ordering.find( item => item.action_sales_type==data_action_sales_type.find(x => x.name=='Portabilidad').id)">
            <div class="flex items-center justify-center mt-4 gap-4">
                <Button v-if="g_OrderIsActive" label="Formulario de Portabilidad" size="small" icon="pi pi-save" @click="fnDescargarPDF()" />
                <Button v-if="g_OrderIsActive" label="Re-envío de Portabilidad"  size="small" icon="pi pi-save" @click="fnReenviarPortabilidad()" />
                
            </div>
            <UploadPortabilidadComponent v-if="flag_FormPortabilidad" />
        </div>
      </div> 
    </div>
</template>

<script setup>

import { ref, watch , onMounted} from "vue";
import { storeToRefs } from "pinia";
import {OrderStore} from '@/stores/OrderStore';
import { SystemDataStore } from "@/stores/SystemDataStore";
import { useToast } from "primevue/usetoast";
import UploadPortabilidadComponent from './UploadPortabilidadComponent.vue';
const toast = useToast();

const data_integracionMovil = ref([]);
const data_pdf = ref([]);
const {a_getintegracionMovil , a_actDescargarPdf, a_tokencsale} = OrderStore();
const {order,g_OrderIsActive} = storeToRefs(OrderStore());
const {data_action_sales_type, data_order_status} = storeToRefs(SystemDataStore()); 
const flag_FormPortabilidad = ref(false);

const fnReenviarPortabilidad = async () => {
    const {ok} = await a_tokencsale();
    if(ok)
    {
        flag_FormPortabilidad.value = true;
    }
    else
    {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener el token. Favor de intentar nuevamente', life: 5000 });
    }
}
const fnDescargarPDF = async () => {
    const pdfArrayBuffer = await a_actDescargarPdf(order.value.order_id); 
    console.log(pdfArrayBuffer);
    if(!pdfArrayBuffer ){
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo descargar el PDF', life: 5000 });
    }
    else if(pdfArrayBuffer.successful=="false")
    {
        toast.add({ severity: 'error', summary: 'Error', detail:  pdfArrayBuffer.response, life: 5000 });
    }
    else
    {
        const file = new Blob([pdfArrayBuffer.data], { type: 'application/pdf' });

        // Crear una URL para el Blob
            const fileURL = URL.createObjectURL(file);

            // Crear un elemento <a> para descargar el archivo
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download',  `FormularioPortabilidad-${order.value.order_id}.pdf`);
            document.body.appendChild(link); // Necesario para que funcione en Firefox
            link.click();

            // Limpiar y remover el elemento <a> después de la descarga
            document.body.removeChild(link);
            URL.revokeObjectURL(fileURL); // Liberar la URL del objeto
    }
} 


const fngetintegracionMovil = async () => {
    data_integracionMovil.value= await a_getintegracionMovil()
    
    toast.add({ severity: 'success', summary: 'Refrescar Datos', detail: 'Datos actualizados correctamente', life: 2000 });
  };

onMounted( async ()=> {
    data_integracionMovil.value= await a_getintegracionMovil() 
  });
 
</script>
 