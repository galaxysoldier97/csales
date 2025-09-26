<template>
    <div class="mt-4 p-4 bg-white dark:bg-slate-700 dark:text-white px-4 sm:px-6 lg:px-8 shadow-lg rounded-lg">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-primary-700 dark:text-primary-100">Confirmar Datos de la Dirección</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-white">   </p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none"> 
      </div>
    </div>
    <div class="mx-2 flow-root sm:mx-0"> 

        <div v-if="data_question && data_question.data.answer.input_required"
        class="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"> 
             <div v-for="item in data_question.data.answer.input_required" :key="item.id" class="col-span-6 sm:col-span-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-white" :for="item.id">{{item.text}}</label>
                <template v-if="item.id=='corregimiento_id'" > 
                    <label class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm">{{ item.value_text }}</label>
                </template> 
                <template v-else-if="item.id=='barrio_id'" > 
                    <label class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm">{{ item.value_text }}</label>
                </template> 
                <template v-else-if="item.id=='calle_id'" > 
                    <select v-model="item.value" :id="item.id" name="item.id" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-slate-700 dark:text-white"
                    @change="fn_change_get_casas(item.value)">
                        <option v-for="option in data_calles" :key="option.id" :value="option.id">{{ option.calle }}</option>
                    </select>
                </template> 
                <template v-else-if="item.id=='casa_id'" > 
                    <select v-model="item.value" :id="item.id" name="item.id" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-slate-700 dark:text-white">
                        <option v-for="option in data_casas" :key="option.id" :value="option.id">{{ option.nombre }}</option>
                    </select>
                </template> 
                <template v-else-if="item.id=='info_adicional'" > 
                    <textarea maxlength="75" v-model="item.value" :id="item.id" name="item.id" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-slate-700 dark:text-white"></textarea>
                </template> 
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
import { ref,onMounted } from 'vue';
import { storeToRefs } from 'pinia';  
import { LeadStore } from '@/stores/LeadStore';
import { HomepassedStore } from '@/stores/HomepassedStore';
import { OrderStore } from '@stores/OrderStore';
const {g_OrderIsActive} = storeToRefs(OrderStore());
  
const {lead_loading,data_question,data_lead} = storeToRefs(LeadStore());
const {a_storeAnswer} = LeadStore(); 
const {a_getCasaByIdCalle,a_getCalleByIdBarrio} = HomepassedStore();
 
const fn_answer = async () => {  
const form_data = data_question.value.data.answer.input_required.reduce((acc, item) => {
    acc[item.id] = item.value;
    return acc;
}, {});


    await a_storeAnswer(form_data);
}
 
const data_calles = ref([]);
const data_casas = ref([]);

const fn_change_get_casas = async (calle_id) => {
    data_casas.value= await a_getCasaByIdCalle(calle_id);

}
 onMounted(async () => {

    const barrio_id=data_question.value.data.answer.input_required.find(item => item.id === 'barrio_id').value;
    data_calles.value= await a_getCalleByIdBarrio(barrio_id);
});
</script> 

 
 