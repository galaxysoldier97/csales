<template>
    <div class="mt-4 p-4 bg-white dark:bg-slate-700 dark:text-white px-4 sm:px-6 lg:px-8 shadow-lg rounded-lg"> 
      <div class="px-4 sm:px-0">
        <h3 class="text-base font-semibold leading-7 text-primary-700 dark:text-white">Información del Cliente</h3> 
      </div>
      <div class="mt-6">
        <dl class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8">
          <div class="border-t border-gray-100 px-4 py-6 col-span-1 md:col-span-2 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-primary-700 dark:text-white">Nombre</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-200 sm:mt-2">{{ data_lead.identification.identification.identification_firstname }}</dd>
          </div>
          <div class="border-t border-gray-100 px-4 py-6 col-span-1 md:col-span-2 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-primary-700 dark:text-white">Apellido</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-200 sm:mt-2">{{ data_lead.identification.identification.identification_lastname }}</dd>
          </div>
          <div class="border-t border-gray-100 px-4 py-6 col-span-1 md:col-span-2 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-primary-700 dark:text-white">Correo Electrónico</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-200 sm:mt-2">{{ data_lead.identification.identification.identification_email }}</dd>
          </div>
          <div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-primary-700 dark:text-white">Teléfono 1</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-200 sm:mt-2"> {{ data_lead.identification.identification.identification_personalphone }}</dd>
          </div> 
          
          <div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-primary-700 dark:text-white">Teléfono 2</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-200 sm:mt-2"> {{ data_lead.identification.identification.identification_personalphone2 }}</dd>
          </div>
          <div class="border-t border-gray-100 px-4 py-6 col-span-1 md:col-span-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-primary-700 dark:text-white">Dirección</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-200 sm:mt-2">{{ data_lead.identification.identification.identification_address }}</dd>
          </div>   
          <div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
            <dt class="text-sm font-medium leading-6 text-primary-700 dark:text-white">Estado</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-200 sm:mt-2"> {{ getStatusOrder(order.orderstatus_id) }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </template>
  
  <script setup> 
  import { ref, computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { LeadStore } from '@/stores/LeadStore';
  import { OrderStore } from '@/stores/OrderStore';
  import { getStatusOrder } from '@/helpers/OrderHelper'

  const { data_lead } = storeToRefs(LeadStore());

  const {order} = storeToRefs(OrderStore());
  </script>