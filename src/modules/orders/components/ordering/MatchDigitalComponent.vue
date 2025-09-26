<template> 
    <div class="mt-4 p-4 bg-white dark:bg-slate-700 dark:text-white px-4 sm:px-6 lg:px-8 shadow-lg rounded-lg"   >
     
 
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-primary-700 dark:text-primary-100"> MATCH DIGITAL</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-white">   </p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none" v-show="order_lead.status=='PENDING PROCESSING' || order_lead.status=='PENDING CONFIRMATION'">  
        <Button v-if="order_lead_items.find(item => item.record_name=='Titular Suscriptor Fijo')"
         label="Actualizar Datos" icon="pi pi-pencil" @click="fn_updateTytan(order_lead_items.find(item => item.record_name=='Titular Suscriptor Fijo').value, order_lead_items.find(item => item.record_name=='Titular Cuenta Fijo').value)" size="small"/>
        <Button  class="ml-1" label="Enviar" icon="pi pi-send" @click="fn_sendMatch()" size="small"/>
        <Button  class="ml-1" label="Refrescar" icon="pi pi-refresh" @click="fn_load()" size="small"/>
      </div>
    </div>
    <div class="mx-2 flow-root sm:mx-0"> 
        
<table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
  <thead>
    <tr>
      <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Cedula o Pasaporte del Titular</th>
      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Correo del Titular</th>
      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Teléfono del Titular</th>
      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Estado</th> 
    </tr>
  </thead>
  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
    <tr>
      <td 
      v-if="order_lead_items.find(item => item.record_name=='Titular Cedula o Pasaporte del Cliente')"
      class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
        {{  order_lead_items.find(item => item.record_name=='Titular Cedula o Pasaporte del Cliente').value }}
    </td>
      <td v-if="order_lead_items.find(item => item.record_name=='Titular Correo Electronico del Cliente')"
      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
        {{  order_lead_items.find(item => item.record_name=='Titular Correo Electronico del Cliente').value }}
    </td>
      <td v-if="order_lead_items.find(item => item.record_name=='Titular NumCelular')"
      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
        {{  order_lead_items.find(item => item.record_name=='Titular NumCelular').value }}
    </td>
      <td 
        v-if="order_lead"
      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">

        {{ computed_status(order_lead.status) }}
      </td> 
    </tr>
    <!-- More rows can be added here -->
  </tbody>
</table>

       
      </div> 
    </div>
</template>

<script setup>

import { ref, watch , computed, onMounted} from "vue"; 
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import {OrderStore} from '@/stores/OrderStore' 
import {LeadStore} from '@/stores/LeadStore' 
import {CustomerStore} from '@/stores/CustomerStore' 
import { useToast } from "primevue/usetoast"; 
const toast = useToast();


const {order_lead,order_lead_items,order_lead_ordering} = storeToRefs(OrderStore());
const {a_order_lead,a_order_lead_items,a_order_lead_ordering} = OrderStore();

const {a_updateMatchDigitalOwner,a_resendMatchDigitalOwner} = LeadStore();
const {a_getDataFromSuscriber} = CustomerStore()


const computed_status = (texto) => {
    if (texto === 'PENDING PROCESSING') {
        return 'Pendiente por Procesar';
    } else if (texto === 'PENDING CONFIRMATION') {
        return 'Pendiente por Confirmar el Titular';
    } else if (texto === 'NO COMPLETED') {
        return 'Error en la Validación';
    } else if (texto === 'CONFIRMED') {
        return 'Confirmado';
        //no confirmaron la orden en el plazo
    } else if (texto === 'NO CONFIRMED') {
        return 'No Confirmado en el Plazo';
    } 
      else {
        return texto;
    }
};

const fn_updateTytan = async (cliente,cuenta) => {

   const { ok, email,phone} = await a_getDataFromSuscriber(cliente,cuenta);
   if(ok)
   {
 
    await a_updateMatchDigitalOwner(email,phone);
    await a_order_lead_ordering();
    await a_order_lead();
    await a_order_lead_items();
    toast.add({ severity: 'success', summary: 'Actualizar Match Digital', detail: 'Match Digital actualizado correctamente', life: 2000 });
   }

   else {
    toast.add({ severity: 'error', summary: 'Actualizar Match Digital', detail: 'Error al actualizar Match Digital', life: 2000 });
   }

}


const fn_sendMatch = async () => {
   await a_resendMatchDigitalOwner();
   toast.add({ severity: 'success', summary: 'Reenviar Match Digital', detail: 'Match Digital reenviado correctamente', life: 2000 });

}


const fn_load = async () => {
    await a_order_lead_ordering();
    await a_order_lead();
    await a_order_lead_items();

    toast.add({ severity: 'success', summary: 'Refrescar Datos', detail: 'Datos actualizados correctamente', life: 2000 });
};

onMounted(() => {
  Promise.all([
    a_order_lead_ordering(),
    a_order_lead(),
    a_order_lead_items()
  ]).then(results => {
    // Handle the results if needed
    console.log('All promises resolved', results);
  }).catch(error => {
    // Handle any errors
    console.error('One or more promises rejected', error);
  });
});
</script>