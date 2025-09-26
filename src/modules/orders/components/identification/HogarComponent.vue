<template>
  <div  class="w-full border-2 bg-white dark:bg-slate-800 dark:text-white border-gray-100 shadow-lg rounded-lg p-6">

    <div class="pb-5 sm:flex sm:items-center sm:justify-between">
            <h1 class="text-lg font-semibold text-primary-700 dark:text-primary-100 mb-4"><i class="pi pi-home"></i> Servicio Hogar</h1>
        <div class="mt-3 sm:ml-4 sm:mt-0">
            <span class="text-md font-semibold tracking-tight text-primary-700 dark:text-primary-100">  {{ computed_format_saldoHogar }}</span>
        </div>
    </div> 
        <Message :closable="false"  v-if="list_accounts && list_accounts.length == 0 && !account_loading.getdata">Cliente no dispone de cuenta hogar</Message>
        <div v-if="account_loading.getdata"> 
            <Skeleton class="mb-2" borderRadius="2rem"></Skeleton>
            <Skeleton width="10rem" class="mb-2" borderRadius="2rem"></Skeleton>
            <Skeleton width="5rem" borderRadius="2rem" class="mb-2"></Skeleton>
        </div>
        <ul class="min-h-72 max-h-72 overflow-y-scroll border-2 border-gray-100 rounded-lg p-4"> 
            <template  v-if="list_accounts && list_accounts.length > 0">
                <li v-for="item in list_accounts" :key="item.Cuenta" >
                    <input type="radio" 
                        :disabled="item.tipoclienteRef?.includes('Empleado')"
                        v-model="form_lead.checkbox_hogar" 
                        :value="item.Cuenta" 
                        @change="a_reseteligibility();a_updateLeadAccountData(item.barrio_idHp,item.Cuenta,item.Cliente,item.Direccion)">
                    <label :class="{'ml-3 text-sm text-gray-500 text-bold': item.tipoclienteRef?.includes('Empleado'), 'ml-3 text-sm text-primary-700 dark:text-primary-100 text-bold': !item.tipoclienteRef?.includes('Empleado')}"
                             for="cuenta1"> {{ item.Cuenta }} - {{ item.tipoclienteRef }} 
                             <span v-if="item.tipoclienteRef?.includes('Empleado')">(empleado)</span>
                             <span style="text-transform: lowercase;" v-if="item.Estado!='Activo'">({{item.Estado}})</span>  - {{ item.barrio }}</label>
                </li>
            </template>  
            <li>
                <input type="radio" v-model="form_lead.checkbox_hogar" @change="a_reseteligibility();a_updateLeadAccountData(-1,'new','')" value="new">
                <label class="ml-3 text-sm text-primary-700 dark:text-primary-100 text-bold" for="cuenta1">Nueva Dirección</label>
                <BarrioComponent  v-if="form_lead.checkbox_hogar=='new'" class="mt-2"></BarrioComponent>
            </li>
            <li v-if="!g_list_account_activo || g_list_account_activo.length === 0 && !account_loading.getdata">
                <div class="mt-2 bg-gray-100 dark:bg-slate-800 dark:text-white rounded-lg p-4">
                    <h2 class="text-md font-semibold text-primary-700 dark:text-primary-100 mb-4">¿Tiene servicio de internet Tigo en su hogar? (Match Digital)</h2>
                    <div class="flex items-center">
                        <input type="radio" v-model="form_lead.ifhomeaccount" value="associated">
                        <label class="ml-3" for="cuentaHogarYes">Sí</label>
                    </div>
                    <div class="flex items-center mt-2">
                        <input type="radio" v-model="form_lead.ifhomeaccount" value="no">
                        <label class="ml-3" for="cuentaHogarNo">No</label>
                    </div>
                </div> 
            </li>
        </ul> 
        
         
    </div>
</template>


<script setup> 
import { ref, computed, watch } from 'vue';
import {LeadStore} from '@/stores/LeadStore'
import {CustomerStore} from '@/stores/CustomerStore'  

import { storeToRefs } from 'pinia'; 
import BarrioComponent from './BarrioComponent.vue'   
import { PlusIcon } from '@heroicons/vue/20/solid'
import { useToast } from "primevue/usetoast";
const toast = useToast();

const {form_lead} = storeToRefs(LeadStore());
const {a_updateLeadAccountData, a_reseteligibility} = LeadStore(); 
const {list_accounts,account_loading,data_reference,allSaldoVencidoHogar,g_list_account_activo} = storeToRefs(CustomerStore());  
const btn_getAccountList = ref(false);


 
const computed_format_saldoHogar = computed(() => {
    if (isNaN(allSaldoVencidoHogar.value)) {
        return 'B/. 0.00';
    } else {
        return new Intl.NumberFormat('es-PA', { style: 'currency', currency: 'PAB' }).format(allSaldoVencidoHogar.value);
    }
})

 
 
</script>