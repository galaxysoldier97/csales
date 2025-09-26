<template> 
    <div class="mt-4 p-4 bg-white dark:bg-slate-700 dark:text-white px-4 sm:px-6 lg:px-8 shadow-lg rounded-lg" v-if="order.lead_ordering.find( item => item.object_type =='account')"  >
        <Toast />
 
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-primary-700 dark:text-primary-100"> Resultado Hogar</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-white">   </p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none"> 
        <Button v-if="g_OrderIsActive" label="Refrescar" icon="pi pi-refresh" @click="fngetintegracionHogar" size="small"/>
      </div>
    </div>
    <div class="mx-2 flow-root sm:mx-0"> 
        <DataTable class="mt-2" :value="data_integracionHogar.filter( item => item.linea==null)" :paginator="true" :rows="5"  
         tableStyle="min-width: 50rem">
            <Column field="name" header="Producto"></Column>
            <Column field="service" header="Servicio"></Column>
            <Column field="citem_id" header="Citem"></Column>
            <Column field="des_reqworkflow" header="Workflow"></Column>
            <Column header="Estado">
                <template #body="slotProps"> 
                    <span>{{ slotProps.data.status === 'D' ? 'Completo' : slotProps.data.status === 'E' ? 'Error' : slotProps.data.status === 'P' ? 'Pendiente' : '__' }}</span>
                </template>
            </Column>
        </DataTable>
 
      </div> 
    </div>
</template>

<script setup>

import { ref, watch , onMounted, computed} from "vue";
import { storeToRefs } from "pinia";
import {OrderStore} from '@/stores/OrderStore'; 
import { useToast } from "primevue/usetoast"; 
const toast = useToast();

const data_integracionHogar = ref([]);
const data_pdf = ref([]);
const {a_getintegracionHogar } = OrderStore();
const {order,g_OrderIsActive} = storeToRefs(OrderStore());   

const fngetintegracionHogar = async () => {
    data_integracionHogar.value= await a_getintegracionHogar()
    
    toast.add({ severity: 'success', summary: 'Refrescar Datos', detail: 'Datos actualizados correctamente', life: 2000 });
  };

onMounted( async ()=> {
    data_integracionHogar.value= await a_getintegracionHogar() 
  });
 
</script>
 