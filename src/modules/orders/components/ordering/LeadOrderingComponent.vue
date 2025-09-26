<template>
<div> 
    <div v-if="order.lead_ordering.filter( item => item.object_type=='account' && (item.object_id_number!=-1 && item.object_id_number!=null)).length>0"
        class="mt-4 p-4 bg-white dark:bg-slate-700 dark:text-white px-4 sm:px-6 lg:px-8 shadow-lg rounded-lg">
        <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
            <h1 class="text-base font-semibold leading-6 text-primary-700 dark:text-primary-100">Hogar</h1>
            <p class="mt-2 text-sm text-gray-700 dark:text-white">   </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none"> 
        </div>
        </div>
        <div class="mx-2 flow-root sm:mx-0">  
            <table class="min-w-full divide-y divide-gray-300" v-if="loading_component">
                <thead>
                <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-primary-100 sm:pl-0">Oferta</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-primary-100">Tipo de Venta</th> 
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-primary-100"></th> 
                </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                <tr v-for="item in order.lead_ordering.filter( item => item.object_type=='account' && object_id_number!=-1)" :key="item.id">
                    
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-primary-100 sm:pl-0 max-w-200 break-all">
                        {{ item.name }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-primary-700 dark:text-primary-100">
                   <label v-if="list_action_sales_type.find(x => x.id==item.action_sales_type)">  {{ list_action_sales_type.find(x => x.id==item.action_sales_type).name }}</label>
                    </td> 
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-primary-700 dark:text-primary-100">
                        <label v-if="item.object_id_number!=-1"> 
                            {{ item.object_id_number }}
                        </label>
                    </td>  
                </tr>
                </tbody>
            </table>  
        </div>  
    </div>
    <div v-if="order.lead_ordering.filter( item => item.object_type=='phone').length>0"
        class="mt-4 p-4 bg-white dark:bg-slate-700 dark:text-white px-4 sm:px-6 lg:px-8 shadow-lg rounded-lg">
        <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
            <h1 class="text-base font-semibold leading-6 text-primary-700 dark:text-primary-100">Movil</h1>
            <p class="mt-2 text-sm text-gray-700 dark:text-white">   </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none"> 
        </div>
        </div>
        <div class="mx-2 flow-root sm:mx-0">  
            <table class="min-w-full divide-y divide-gray-300" v-if="loading_component">
                <thead>
                <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-primary-100 sm:pl-0">Oferta</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-primary-100">Tipo de Venta</th> 
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-primary-100">Simcard</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-primary-100">Teléfono</th> 
                </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                <tr v-for="item in order.lead_ordering.filter( item => item.object_type=='phone')" :key="item.id">
                    
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-primary-100 sm:pl-0 max-w-200 break-all">{{ item.name }}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-primary-700 dark:text-primary-100">
                    {{ list_action_sales_type.find(x => x.id==item.action_sales_type).name }}
                    </td> 
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-primary-700 dark:text-primary-100">
                        <label> 
                            {{ item.simcard }}
                        </label>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-primary-700 dark:text-primary-100">
                        <label> 
                            {{ item.object_id_number }}
                        </label>
                    </td>  
                </tr>
                </tbody>
            </table>  
        </div>  
    </div>
</div>
</template>

<script setup>
import { ref, onMounted,computed } from 'vue';
import { storeToRefs } from 'pinia';  
import { LeadStore } from '@/stores/LeadStore'; 
import { OrderStore } from '@/stores/OrderStore'; 
import { SystemDataStore } from '@/stores/SystemDataStore'; 
  
const {a_getDataComponent} = SystemDataStore(); 
const { order, g_OrderIsActive} = storeToRefs(OrderStore());
 
const loading = ref(false);
const loading_store = ref(false);
  

  
const loading_component = ref(false)
const list_action_sales_type = ref(null)
 
const temp_list_action_sales_type=ref([])
 
onMounted(async () => {
    list_action_sales_type.value= await a_getDataComponent('Action_Sales_Type');  
    loading_component.value = true;
});
</script>
