<template>
    <div class="mt-4 p-4 bg-white dark:bg-slate-700 dark:text-white px-4 sm:px-6 lg:px-8 shadow-lg rounded-lg">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-primary-700 dark:text-primary-100">Confirmar Datos Personales</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-white">   </p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none"> 
      </div>
    </div>
    <div class="mx-2 flow-root sm:mx-0"> 

        <div v-if="data_question && data_question.data.answer.input_required"
        class="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"> 
            <input v-for="item in data_question.data.answer.input_required" :key="item.id" type="text"
            v-model="item.value" class="col-span-6 sm:col-span-3"  :placeholder="item.text" />
 
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
import { ref,computed } from 'vue';
import { storeToRefs } from 'pinia';  
import { LeadStore } from '@/stores/LeadStore';
import { OrderStore } from '@stores/OrderStore';
const {g_OrderIsActive} = storeToRefs(OrderStore());
  
const {lead_loading,data_question} = storeToRefs(LeadStore());
const {a_storeAnswer} = LeadStore(); 
 
const fn_answer = async () => {  
const form_data = data_question.value.data.answer.input_required.reduce((acc, item) => {
    acc[item.id] = item.value;
    return acc;
}, {});


    await a_storeAnswer(form_data);
}
 
</script> 

 
 