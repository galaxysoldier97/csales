<template>
  <div class="w-full border-2 bg-white dark:bg-slate-800 dark:text-white border-gray-100 shadow-lg rounded-lg p-6"> 
    
    <div class="pb-5 sm:flex sm:items-center sm:justify-between">
            <h1 class="text-lg font-semibold text-primary-700 dark:text-primary-100 mb-4"><i class="pi pi-mobile"></i> Servicio Movil</h1>
        <div class="mt-3 sm:ml-4 sm:mt-0">
            <span class="text-md font-semibold tracking-tight text-primary-700 dark:text-primary-100">  {{ computed_format_saldoMovil }}</span>
        </div>
    </div> 
  
    <Message :closable="false"  v-if="!list_phones_activos || list_phones_activos.length === 0 && !account_loading.getdata">Cliente no dispone de líneas móviles</Message>
    <div v-if="account_loading.getdata"> 
        <Skeleton class="mb-2" borderRadius="2rem"></Skeleton>
        <Skeleton width="10rem" class="mb-2" borderRadius="2rem"></Skeleton>
        <Skeleton width="5rem" borderRadius="2rem" class="mb-2"></Skeleton>
    </div>
    <ul class="min-h-72 max-h-72 overflow-y-scroll border-2 border-gray-100 rounded-lg p-4"> 
        <li>
            <input class="text-sm" type="checkbox" v-model="form_lead.systemRegisteredPhones" :value="{celular:'new', Tipo:'none',personalizado:'N'}">
            <label class="ml-3 text-sm text-primary-700 dark:text-white text-bold"> Nuevas Líneas</label>
        </li>
        <template  v-if="!account_loading.getdata && list_phones_activos && list_phones_activos.length > 0">
        <li v-for="item in list_phones_activos" :key="item.celular">
                    <input class="text-sm" type="checkbox" v-model="form_lead.systemRegisteredPhones" :value="item">
                    <label  class="ml-3 text-sm text-primary-700 dark:text-white text-bold">Línea {{ item.celular }} - {{ item.Tipo }} -
                        <span v-if="item.personalizado == 'Y'">personalizado</span>
                        <span v-if="item.personalizado == 'N'">no personalizado</span>
                    </label>
        </li>
        </template>
        <li>
            <input class="text-sm" type="checkbox" v-model="flag_portabilityOrUpgradePhones" value="true">
            <label class="ml-3 text-sm text-primary-700 dark:text-white text-bold">Agregar Portabilidad o número personal no registrado</label>
            <div class="mt-2" v-if="flag_portabilityOrUpgradePhones">
                <div class="flex justify-center items-center mx-6">   
                    <InputText v-model="c_new_phone" placeholder="Ingrese número" size="small"  />
                    <!-- wide screen-->
                    <Button class="ml-2 hidden lg:block" @click="fn_addNewPhoneNumber" icon="pi pi-plus"  label="agregar" rounded size="small" :loading="flag_addNewPhoneNumber" />
                    <!-- mobile screen-->
                    <Button class="ml-2 block lg:hidden" @click="fn_addNewPhoneNumber" icon="pi pi-plus" rounded size="small" :loading="flag_addNewPhoneNumber" />
                
                </div>
                <ul class="mt-4 list-disc">
                    <li v-for="(item, index) in form_lead.portabilityOrUpgradePhones" :key="index" class="flex items-center space-x-2">
                        <label class="flex-grow px-2 mt-1 py-1 bg-gray-100 dark:bg-slate-800 dark:text-white rounded-lg text-gray-800 text-sm text-primary-700 dark:text-white">
                            {{ item.celular }} - {{ item.codOperadoraActual }} <span class="text-xs" v-if="item.personalizado">(No personalizado)</span>
                        </label>
                        <button @click="fn_removePhone()" class="px-2 py-1 text-xs bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                           <TrashIcon class="h-4 w-4" />
                        </button>
                    </li>
                </ul>
            </div> 
        </li> 

    </ul>  
    
     

</div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import {LeadStore} from '@/stores/LeadStore'
import {CustomerStore} from '@/stores/CustomerStore'
import { SCLStore } from '@/stores/SCLStore'; 

import { TrashIcon } from '@heroicons/vue/20/solid'
import { storeToRefs } from 'pinia';
import { useToast } from "primevue/usetoast";
const toast = useToast();
 

const flag_portabilityOrUpgradePhones=ref(false)
 
const {form_lead} = storeToRefs(LeadStore());
const {list_phones_activos,account_loading,allSaldoVencidoMovil} = storeToRefs(CustomerStore()); 
const {a_CheckPhoneBUC} = CustomerStore(); 
const {a_CheckPhoneSCL, a_fetchConsultsubscriber} = SCLStore();
const {scl_loading} = storeToRefs(SCLStore()); 
 
const c_new_phone = ref('');
const flag_addNewPhoneNumber = ref(false);

const computed_format_saldoMovil = computed(() => {
    if (isNaN(allSaldoVencidoMovil.value)) {
        return 'B/. 0.00';
    } else {
        return new Intl.NumberFormat('es-PA', { style: 'currency', currency: 'PAB' }).format(allSaldoVencidoMovil.value);
    }
})


const fn_addNewPhoneNumber = async () => {
    flag_addNewPhoneNumber.value = true;
    const phoneNumber = c_new_phone.value.trim();

    
    const operadoraMapping = {
            '160': 'Cable & Wireless Movil',
            '196': 'Grupo de Comunicaciones Digitales',
            '197': 'Digicel',
            '198': 'Claro Panama'
        };
 
    
    try {
        // Ejecutar todas las validaciones en paralelo
        const [phoneCheckSCL, phoneCheckBUC, subscriptionCheck] = await Promise.all([
            a_CheckPhoneSCL(phoneNumber),
            a_CheckPhoneBUC(phoneNumber),
            a_fetchConsultsubscriber(null, null, phoneNumber)
        ]);

        if (!phoneCheckSCL.ok) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Inconvenientes al validar el número. Intente nuevamente', life: 5000 });
            return;
        }

        
        const codOperadoraActual = operadoraMapping[phoneCheckSCL.dataphone.codOperadoraActual] || phoneCheckSCL.dataphone.codOperadoraActual;

        if (phoneCheckBUC.okbuc && phoneCheckBUC.bucphone.personalizado == 'Y') {
            toast.add({ severity: 'error', summary: 'Error', detail: 'El número ya se encuentra registrado a la cédula ' + phoneCheckBUC.bucphone.identificacion, life: 15000 });
            return;
        }
        //si es Grupo de Comunicaciones y no tiene suscription, no se puede agregar
        if (!subscriptionCheck.ok && codOperadoraActual == '196') {
            toast.add({ severity: 'error', summary: 'Error', detail: 'El número no se encuentra activo en el sistema Movil ' + phoneCheckBUC.bucphone.identificacion, life: 15000 });
            return;
        }
 

        const newPhone = {
            celular: phoneNumber,
            codOperadoraActual,
            ...(phoneCheckBUC.okbuc ? phoneCheckBUC.bucphone : {})
        };

        form_lead.value.portabilityOrUpgradePhones.push(newPhone);
        c_new_phone.value = '';
        
    } catch (error) {
        console.log(error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al procesar la solicitud', life: 5000 });
    } finally {
        flag_addNewPhoneNumber.value = false;
    }
}

const fn_removePhone = (index) =>  {
    form_lead.value.portabilityOrUpgradePhones.splice(index, 1);
} 
 
</script>