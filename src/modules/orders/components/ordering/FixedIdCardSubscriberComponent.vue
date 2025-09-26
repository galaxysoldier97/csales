
<template>
    <div class="mt-4 p-4 bg-white dark:bg-slate-700 dark:text-white px-4 sm:px-6 lg:px-8 shadow-lg rounded-lg">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-primary-700 dark:text-primary-100">Ingrese la cédula de la Cuenta Hogar que pueda recibirá el Beneficio Hogar</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-white">   </p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none"> 
      </div>
    </div>
    <div class="mx-2 flow-root sm:mx-0"> 
  
        <div class="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-6">
            <label for="first-name" class="block text-sm font-medium leading-6 text-primary-700 dark:text-primary-100">Cédula :</label>
            <div class="mt-2 flex items-center space-x-4">
              <input
                type="text"
                v-model="idcardHome"
                class="block w-1/3 rounded-md border-0 py-1.5 text-primary-700 dark:text-primary-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-100 sm:text-sm sm:leading-6 dark:bg-slate-700 dark:placeholder-primary-100 dark:ring-white dark:focus:ring-primary-100 dark:text-white"
                placeholder="Cédula"
                maxlength="15"
              />
              <Button
                v-if="g_OrderIsActive"
                @click="fn_RefreshinAccount()"
                text
                raised
                label="Refrescar Datos"
                outlined
                rounded
                size="small"
                :loading="loading_refreshing"
              />
            </div>
          </div>
        </div> 
        
        <Message :closable="false" severity="error" v-if="flag_error" >La cédula ingresada no parece tener servicios de hogar activo. Favor de verificar.</Message>
 
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
import {CustomerStore} from '@/stores/CustomerStore' 
import { useToast } from "primevue/usetoast";

const toast = useToast();
const {g_OrderIsActive} = storeToRefs(OrderStore());
  
const {lead_loading} = storeToRefs(LeadStore());
const {a_storeAnswer} = LeadStore();


const {  a_RefreshinAccount} = CustomerStore(); 


const idcardHome = ref('');
const flag_error=ref(false);

const fn_answer = async () => { 
  flag_error.value=false; 
   const {ok} = await a_storeAnswer(idcardHome.value);
   if(!ok){
    flag_error.value=true;
   }
}



const loading_refreshing = ref(false);
    const fn_RefreshinAccount = async () => {
        loading_refreshing.value = true;
        const {ok} = await a_RefreshinAccount(idcardHome.value);
        if (ok) {
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado correctamente', life: 5000 });
            await fn_answer(); 
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar los datos del cliente', life: 5000 });
        }
        loading_refreshing.value = false;
    };
</script> 