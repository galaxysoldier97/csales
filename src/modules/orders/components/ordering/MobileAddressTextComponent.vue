<template>
    <div class="mt-4 p-4 bg-white dark:bg-slate-700 dark:text-white px-4 sm:px-6 lg:px-8 shadow-lg rounded-lg">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-primary-700 dark:text-primary-100">Dirección Móvil</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-white">   </p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none"> 
      </div>
    </div>
    <div class="mx-2 flow-root sm:mx-0"> 

        <Message :closable="false" severity="warn" >No pudimos encontrar su dirección. Favor escribir su dirección completa.</Message>  
        <div class="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-6">
            <label for="first-name" class="block text-sm font-medium leading-6 text-primary-700 dark:text-primary-100">Dirección Movil Completa</label>
            <div class="mt-2">
              <input type="text" v-model="direccion"
               class="block w-full rounded-md border-0 py-1.5 text-primary-700 dark:text-primary-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-100 sm:text-sm sm:leading-6" />
            </div>
          </div>
 
 
        </div>
      </div>
      
    <div class="sm:flex sm:items-center mt-10" >
      <div class="sm:flex-auto">
         
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <Button v-if="g_OrderIsActive" label="Enviar" icon="pi pi-save" :loading="lead_loading.store" size="small" @click="fn_answer()"  />
      </div>
    </div>

    </div>
</template>


<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';  
import { LeadStore } from '@/stores/LeadStore';
import { OrderStore } from '@stores/OrderStore';
const {g_OrderIsActive} = storeToRefs(OrderStore());
  
const {lead_loading} = storeToRefs(LeadStore());
const {a_storeAnswer} = LeadStore();
const direccion = ref('');

const fn_answer = async () => {  
    await a_storeAnswer(direccion.value);
}
</script> 