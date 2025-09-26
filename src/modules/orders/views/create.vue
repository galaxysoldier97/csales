
<template> 
<div class="xl:container mx-auto bg-gray-100 dark:bg-slate-800 dark:text-white ">
    <div class="mb-2"> 
      <div class="md:flex md:items-center md:justify-between">
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-bold leading-7 text-primary-700 dark:text-primary-100 sm:truncate sm:text-3xl sm:tracking-tight">
            Gestión de Ventas</h2>
        </div> 
      </div>
    </div>   
    <div class="bg-gray-100 dark:bg-slate-800 dark:text-white sm:min-h-screen" v-if="compontent_loaded">    
          <IdentificationComponent />
          <EligibilityComponent class="mt-2" v-if="list_eligibility && list_eligibility.length>0" /> 
          <Message class="mt-2" v-if="lead_stage=='SelectEligibility'  && list_eligibility.length==0 && !lead_loading.store" severity="error" :closable="false">
            La búsqueda actual no generó ofertas compatibles con los datos. Consulte con su supervisor para más información
          </Message>
    </div>

  </div>
    <!--tabs-->
    

  </template>
  
  
  <script setup>
  import { ref, watch , onMounted, onUnmounted} from "vue"; 
  import { storeToRefs } from "pinia";
  import { LeadStore } from "@/stores/LeadStore";
  import { OrderStore } from "@/stores/OrderStore";
  import { EyeIcon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
  import IdentificationComponent from "../components/IdentificationComponent.vue";
  import EligibilityComponent from "../components/EligibilityComponent.vue";
  import TableOfferSelected from '../components/eligibility/TableOfferSelected.vue'; 
  import OrderingComponent from "../components/OrderingComponent.vue";
  import EndComponent from '../components/ordering/EndComponent.vue';
  import {HomepassedStore} from '@/stores/HomepassedStore'
  import { SystemDataStore } from "@/stores/SystemDataStore";
 
  
  const {  a_getActionSalesType,a_getOrderStatus} = SystemDataStore(); 

    const compontent_loaded = ref(false);
    const {a_resetLead} = LeadStore();
    const {list_eligibility,lead_stage,lead_loading} = storeToRefs(LeadStore());
    const {a_fetchBarrios, a_fetchProvincias, a_fetchCorregimientos , a_fetchDistritos} = HomepassedStore();

    const {a_resetOrder} =  OrderStore() ;

onMounted( async ()=> {
  await a_resetOrder()
  await a_resetLead()

  await Promise.all([
    a_getOrderStatus(),
    a_getActionSalesType(),
    a_fetchProvincias(),
    a_fetchCorregimientos(),
    a_fetchDistritos(),
    a_fetchBarrios()
  ]);
  compontent_loaded.value = true;
 
} )

onUnmounted(() => {
  console.log('unmounted')
})
  </script>