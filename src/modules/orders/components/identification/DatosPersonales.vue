<template> 

<div class="bg-white dark:bg-slate-800 dark:text-white border-gray-100 shadow-lg rounded-lg p-2  border-b border-gray-200 bg-white dark:bg-slate-800 dark:text-white px-4 py-5 sm:px-6">
  <div class="pb-5 sm:flex sm:items-center sm:justify-between">
    <h1 class="text-lg font-semibold text-primary-700 dark:text-primary-100 mb-4"><i class="pi pi-user"></i> Datos del cliente</h1>
    <div class="mt-3 flex sm:ml-4 sm:mt-0">
      <ModalFacturas class="mt-1 "/> 
    </div>
  </div>

    
    <div class=" grid grid-cols-1 gap-x-2 gap-y-1 md:grid-cols-12"  > 
        <div class="md:col-span-2">
          <label for="first-name" class="block text-sm font-medium leading-6 text-primary-700 dark:text-white">Nombre</label>
          <div class="mt-0">
            <input type="text" v-model="form_lead.identification_firstname" id="first-name" class="block w-full rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-100 sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-white" /> 
          </div>
        </div>

        <div class="md:col-span-2">
          <label for="last-name" class="block text-sm font-medium leading-6 text-primary-700 dark:text-white">Apellido</label>
          <div class="mt-0">
            <input type="text" v-model="form_lead.identification_lastname" id="last-name" class="block w-full rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-100 sm:text-sm sm:leading-6  dark:bg-slate-800 dark:text-white" />
          </div>
        </div>
        <div class="md:col-span-4">
          <label for="first-name" class="block text-sm font-medium leading-6 text-primary-700 dark:text-white">Correo</label>
          <div class="mt-0">
            <input type="email" 
            v-model="form_lead.identification_email" 
            id="email" 
            :class="{'border-red-500': !isValidEmail, 'border-0': isValidEmail}" 
            class="block w-full rounded-full py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-100 sm:text-sm sm:leading-6  dark:bg-slate-800 dark:text-white" />
          <p v-if="!isValidEmail && form_lead.identification_email" class="text-red-500 text-xs mt-2">
            introduce un correo electrónico válido.
          </p>
          </div>
        </div>

        <div class="md:col-span-2">
          <label for="last-name" class="block text-sm font-medium leading-6 text-primary-700 dark:text-white">Teléfono 1</label>
            <div class="mt-0"> 
              <input type="number" v-model="form_lead.identification_personalphone"  
            :class="{'border-red-500': !isValidPhone, 'border-0': isValidPhone}" 
            class="block w-full rounded-full py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-100 sm:text-sm sm:leading-6  dark:bg-slate-800 dark:text-white" />
            <p v-if="!isValidPhone && form_lead.identification_personalphone" class="text-red-500 text-xs mt-2">
              introduce un número de teléfono válido.
            </p>
            </div>
        </div>

        
        <div class="md:col-span-2">
          <label for="last-name" class="block text-sm font-medium leading-6 text-primary-700 dark:text-white">Teléfono 2</label>
            <div class="mt-0">
              <input type="number" v-model="form_lead.identification_personalphone2"  
            :class="{'border-red-500': !isValidPhone2, 'border-0': isValidPhone2}" 
            class="block w-full rounded-full py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-100 sm:text-sm sm:leading-6  dark:bg-slate-800 dark:text-white" />
            <p v-if="!isValidPhone2 && form_lead.identification_personalphone2" class="text-red-500 text-xs mt-2">
              introduce un número de teléfono válido.
            </p>
            </div>
        </div>
    </div> 
  </div> 
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import {CustomerStore} from '@/stores/CustomerStore'
import {LeadStore} from '@/stores/LeadStore'
import ModalFacturas from './ModalFacturas.vue'

const {data_buc,account_loading} = storeToRefs(CustomerStore());
const {form_lead} = storeToRefs(LeadStore());
const isValidEmail = ref(true);
const isValidPhone = ref(true);
const isValidPhone2 = ref(true);

watch(() => form_lead.value.identification_email, (newEmail) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  isValidEmail.value = pattern.test(newEmail);
});


watch(() => form_lead.value.identification_personalphone, (newPhone) => {
  const pattern = /^((6[0-9]{7})|(2[0-9]{6})|(3[0-9]{6})|(4[0-9]{6})|(5[0-9]{6})|(7[0-9]{6})|(8[0-9]{6})|(9[0-9]{6}))$/;
  isValidPhone.value = pattern.test(newPhone);
});


watch(() => form_lead.value.identification_personalphone2, (newPhone) => {
  const pattern = /^((6[0-9]{7})|(2[0-9]{6})|(3[0-9]{6})|(4[0-9]{6})|(5[0-9]{6})|(7[0-9]{6})|(8[0-9]{6})|(9[0-9]{6}))$/;
  isValidPhone2.value = pattern.test(newPhone);
});

 
</script>