<template>
<div v-if="!account_loading.getdata && data_buc && data_buc.length > 0">
    <ModalFacturas class="mt-1 "/> 

     <div class="mt-2 p-4 rounded-lg bg-white dark:bg-slate-800 dark:text-whiteflex items-stretch"> 
        <div class="flex-grow">
            <p class="text-sm font-medium leading-6 text-gray-700">Saldo Total Hogar</p>
            <p class="flex items-baseline gap-x-2" v-if="list_accounts">
                <i v-if="account_loading.saldos" class="pi pi-spin pi-spinner"></i>
                <span class="text-md font-semibold tracking-tight text-primary-700 dark:text-primary-100" v-else>  {{ computed_format_saldoHogar }}</span>
            </p>
        </div> 
        
        <div class="flex-grow">
            <p class="text-sm font-medium leading-6 text-gray-700">Saldo Total Móvil</p>
            <p class="flex items-baseline gap-x-2" v-if="list_phones">
                <i v-if="account_loading.saldosMovil" class="pi pi-spin pi-spinner"></i>
                <span class="text-md font-semibold tracking-tight text-primary-700 dark:text-primary-100" v-else> {{ computed_format_saldoMovil }}</span>
            </p>
        </div>  
    </div>
      
</div>
</template>

<script setup>

import { ref, onMounted, computed } from 'vue'
import {CustomerStore} from '@/stores/CustomerStore'
import { storeToRefs } from 'pinia';
import ModalFacturas from './ModalFacturas.vue'

 
const {allSaldoVencidoHogar,allSaldoVencidoMovil,list_accounts,list_phones, data_buc, account_loading} = storeToRefs(CustomerStore()); 
 

const computed_format_saldoHogar = computed(() => {
    if (isNaN(allSaldoVencidoHogar.value)) {
        return 'B/. 0.00';
    } else {
        return new Intl.NumberFormat('es-PA', { style: 'currency', currency: 'PAB' }).format(allSaldoVencidoHogar.value);
    }
})

const computed_format_saldoMovil = computed(() => {
    if (isNaN(allSaldoVencidoMovil.value)) {
        return 'B/. 0.00';
    } else {
        return new Intl.NumberFormat('es-PA', { style: 'currency', currency: 'PAB' }).format(allSaldoVencidoMovil.value);
    }
})

</script>