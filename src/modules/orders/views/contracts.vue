
<template> 
    <div> 
    <div class="mb-2"> 
      <div class="mt-2 md:flex md:items-center md:justify-between">
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-primary-100 sm:truncate sm:text-3xl sm:tracking-tight">Consultas de Cierre</h2>
        </div>
        <div class="mt-4 flex flex-shrink-0 md:ml-4 md:mt-0">
         </div>
      </div>
    </div>   
    <div class="card">{{  }}
        <DataTable v-model:filters="filters" :value="list_contracts" paginator showGridlines :rows="10" dataKey="id"
                filterDisplay="menu" :loading="loading.carga_general" :globalFilterFields="['order_id','clientenombre','cliente','cuenta','identificacion','email'  ]">
            <template #header>
                <div class="flex justify-between">
                    <Button type="button" icon="pi pi-filter-slash" label="Limpiar" size="small" outlined @click="clearFilter()" />
                    <span class="relative">
                        <i class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600" />
                        <InputText v-model="filters['global'].value" placeholder="Buscar"  class="pl-10 font-normal"/>
                    </span>
                </div>
            </template>
            <template #empty> No se encontró data. </template>
            <template #loading> Cargando data. Por favor espere </template>
            <Column field="order_id" header="No. Order" />
            <Column field="clientenombre" header="Nombre" />
            <Column field="cliente" header="Suscriptor" />
            <Column field="cuenta" header="Cuenta" />  
            <Column field="identificacion" header="Identificación" />  
            <Column field="email" header="Email" />  
            <Column header="Fecha de Aceptación" filterField="aceptadohora" dataType="date" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ new Date(data.aceptadohora).toLocaleDateString() }}
                </template>
                <template #filter="{ filterModel }">
                    <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
                </template>
            </Column>
            <Column headerStyle="text-align: center" bodyStyle="text-align: center; overflow: visible">
                <template  #body="{ data }">  
                   <a :href="baseUrlContracts + 'loadHTMLFile/' + data.order_id"
                        class="text-primary-700 dark:text-primary-100"
                        target="_blank">
                        <i class="pi pi-arrow-circle-down" style="font-size: 2rem"></i>
                        </a>
                </template>
            </Column>
        </DataTable>
    </div>
    </div>
  </template>
  
  
   
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { storeToRefs } from 'pinia'; 
  import { FilterMatchMode, FilterOperator} from 'primevue/api';
  import { OrderStore } from '@stores/OrderStore';  

const {a_fetchContratos} = OrderStore();
const { list_contracts, loading } =storeToRefs(OrderStore());
 
const baseUrlContracts= import.meta.env.VITE_BACKEND_CONTRACTS;
  const filters = ref(); 
  const filter_status = ref([ 'borrador', 'activo', 'inactivo']); 
 
  const valuesearch = ref(null);
 
  onMounted(async () => {
    await a_fetchContratos()
     
  });
  
  
  const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        lead_type: { value: null, matchMode: FilterMatchMode.EQUALS  },
        begindate: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        enddate: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }, 
    };
  };
  
  initFilters();
    
  const clearFilter = () => {
    initFilters();
  }; 

const getStatusOrder = (status) => {
    switch (status) { 
            case '6003':
                return 'Inicio';
            case '6004':
                return 'Propuesta enviada';
            case '6005':
                return 'Esperando por cliente';
            case '6006':
                return 'Orden aprobada';
            case '6007':
                return 'Esperando pago';
            case '6008':
                return 'Procesando';
            case '6009':
                return 'Orden completada';
            case '6010':
                return 'Orden cancelada';
            case '6011':
                return 'Error';
            case '6225':
                return 'Propuesta rechazada';
            case '6226':
                return 'Propuesta vencida';
            case '6325':
                return 'Esperando firma';
            case '6865':
                return 'Sin serie numerica';
            case '6187':
                return 'Agendar visita';
            case '6188':
                return 'Visita agendada';
            default:
                return ''; 
    }
};

  
 
  </script>
  