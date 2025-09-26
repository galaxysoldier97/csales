<template>
    <div class="card bg-gray-100 dark:bg-slate-800 dark:text-white">
        <div class="">
            <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div class="col-span-6 ">
                    <div class="flex flex-col md:flex-row">
                    <span class="relative flex-grow md:flex-grow-0 md:w-full mr-2 mb-2 md:mb-0" style="max-width: 400px;">
                        <InputText v-model="form_identification" rounded placeholder="ingrese el número de cédula" class="pl-10 w-full" />
                        <i class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600" />
                    </span>
                    <Button @click="fn_search" label="Gestionar" rounded size="small" :disabled="form_identification==''" :loading="account_loading.getdata" />
                    <!-- al final boton refresh-->
                    <Button v-if="form_identification!='' && component_loading.started" class="md:ml-auto mt-2 md:mt-0" @click="fn_RefreshinAccount()" text raised label="Refrescar Datos" outlined rounded size="small" :loading="loading_refreshing" />
                    </div>
                    <DatosPersonales class="mt-2" v-if="component_loading.started"/>
                </div>
            </div>
        </div>

         
        <div class="card mt-4" v-if="component_loading.started">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <HogarComponent />
                <MovilComponent />
            </div>
        </div>
        
        <ContratosComponent v-if="component_loading.started "/>

        <Message v-if="countCableModen>1 || (list_INTcontracts && list_INTcontracts.length>1) || (list_TELcontracts && list_TELcontracts.length>1)" severity="warn" :closable="false"> 
            Esta cuenta debe ser gestionada por Tytan por tener multiples cajas,servicio de internet o telefonía. Por favor, seleccione otra cuenta o proporcione una nueva dirección.</Message>
 
        
        <div class="flex justify-center" v-if="component_loading.finished"> 
            <Button  :disabled="countCableModen>1 || (list_INTcontracts && list_INTcontracts.length>1) || (list_TELcontracts && list_TELcontracts.length>1)"
            size="small" rounded class="w-full md:w-2/5 mt-4" label="Buscar Ofertas" @click="fn_LeadBulkAnswer()" :loading="lead_loading.store" />
        </div>

        <Toast />
    </div>
 
</template>


<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import {HomepassedStore} from '@/stores/HomepassedStore'
import {LeadStore} from '@/stores/LeadStore'
import {CustomerStore} from '@/stores/CustomerStore' 
import { OrderStore } from "@/stores/OrderStore";

import { storeToRefs } from 'pinia';
import HogarComponent from './identification/HogarComponent.vue'
import MovilComponent from './identification/MovilComponent.vue'
import DatosPersonales from './identification/DatosPersonales.vue'
import SaldosComponent from './identification/SaldosComponent.vue'
import ContratosComponent from './identification/ContratosComponent.vue'
import { useToast } from "primevue/usetoast";
const toast = useToast();

const component_loading = ref({started: false, finished: false});
const {form_lead, lead_loading} = storeToRefs(LeadStore());
const {a_setIdentification,a_setDatosClienteLead,a_CreateLeadBulkAnswer,a_updateLeadAccountData, a_updateTelefonos,a_resetLead} = LeadStore();
const {list_accounts, list_phones,data_buc,countCableModen, list_TELcontracts, list_INTcontracts, account_loading} = storeToRefs(CustomerStore()); 
const {a_saldoVencidogMovilList, a_fetchPhoneMovilPlans, a_fetchBUC,a_fetchcontactosBUC,a_saldoVencidoHogarList,a_fetchTelefonos, a_resetCustomer, a_RefreshinAccount} = CustomerStore(); 

const form_identification= ref('')
const {a_resetOrder} =  OrderStore() ; 

const fn_search = async () => { 
    
    component_loading.value.finished = false;
    component_loading.value.started = false;
    await Promise.all([
        a_resetOrder(),
        a_resetLead(),
        a_resetCustomer(), 
    ]);

    await a_setIdentification(form_identification.value);
    component_loading.value.started = true;

    await Promise.all([
        a_fetchBUC(form_identification.value),
        a_fetchcontactosBUC(form_identification.value)
    ]); 

    await a_setDatosClienteLead();

    if(list_accounts.value.length > 0) 
    {
        if(list_accounts.value.filter(account => !account.tipoclienteRef?.includes('Empleado')).length > 0)
        {
            const firstaccount = list_accounts.value.filter(account => !account.tipoclienteRef?.includes('Empleado'))[0];
            a_updateLeadAccountData(firstaccount.barrio_idHp,firstaccount.Cuenta,firstaccount.Cliente,firstaccount.Direccion);
            const {data,ok} = await a_fetchTelefonos(firstaccount.Cliente);
            if(ok)
            {
                a_updateTelefonos(data);
            } 
        }
        else
        {
            const firstaccount = list_accounts.value[0];
            const {data,ok} = await a_fetchTelefonos(firstaccount.Cliente);
            if(ok)
            {
                a_updateTelefonos(data);
            }

        } 
    } 
    if (list_phones.value.length > 0) 
    {
        a_fetchPhoneMovilPlans();
        //a_saldoVencidogMovilList();

            
        if(list_accounts.value.length > 0) 
        { 
            a_saldoVencidoHogarList();
        } 
    }  
    component_loading.value.finished = true;
} 
 

const fn_LeadBulkAnswer = async () => {

    if(!form_lead.value.barrio_id)
    {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Seleccione un barrio', life: 5000 });
        return;
    }

 

    if(form_lead.value.identification_personalphone == '' ||form_lead.value.identification_personalphone2 == '' || form_lead.value.identification_email == '' || form_lead.value.identification_firstname == '' || form_lead.value.identification_lastname == ''
        || form_lead.value.identification_personalphone == null ||form_lead.value.identification_personalphone2 == null || form_lead.value.identification_email == null || form_lead.value.identification_firstname == null || form_lead.value.identification_lastname == null
        
    )
    {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Complete los campos de datos personales', life: 5000 });
        return;
    }
    
    //si no es telefono del 60000000 a 69999999 o del 2000000 a 9999999
    if(form_lead.value.identification_personalphone != '' && !/^((6[0-9]{7})|(2[0-9]{6})|(3[0-9]{6})|(4[0-9]{6})|(5[0-9]{6})|(7[0-9]{6})|(8[0-9]{6})|(9[0-9]{6}))$/.test(form_lead.value.identification_personalphone))
    {
        toast.add({ severity: 'error', summary: 'Error', detail: 'El número de teléfono no es válido', life: 5000 });
        return;
    }

    //si no es telefono del 60000000 a 69999999 o del 2000000 a 9999999
    if(form_lead.value.identification_personalphone2 != '' && !/^((6[0-9]{7})|(2[0-9]{6})|(3[0-9]{6})|(4[0-9]{6})|(5[0-9]{6})|(7[0-9]{6})|(8[0-9]{6})|(9[0-9]{6}))$/.test(form_lead.value.identification_personalphone2))
    {
        toast.add({ severity: 'error', summary: 'Error', detail: 'El número de teléfono no es válido', life: 5000 });
        return;
    }

    //si no es un correo valido
    if(form_lead.value.identification_email != '' && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(form_lead.value.identification_email))
    {
        toast.add({ severity: 'error', summary: 'Error', detail: 'El correo electrónico no es válido', life: 5000 });
        return;
    }

    const {ok, errors} = await a_CreateLeadBulkAnswer();
    if (!ok) {
        let errorString = '';
        for (const key in errors) {
            errorString += `${errors[key][0]}\n`;
        }
        toast.add({ severity: 'error', summary: 'Error', detail: errorString, life: 5000 });
    } 
}




const loading_refreshing = ref(false);
    const fn_RefreshinAccount = async () => {
        loading_refreshing.value = true;
        const {ok} = await a_RefreshinAccount(form_identification.value);
        if (ok) {
            await fn_search();
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado correctamente', life: 5000 });
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar los datos del cliente', life: 5000 });
        }
        loading_refreshing.value = false;
    };

</script>