
<template> 
    <div> 
    <div class="mb-2"> 
      <div class="mt-2 md:flex md:items-center md:justify-between">
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-primary-100 sm:truncate sm:text-3xl sm:tracking-tight">Mis Ordenes</h2>
        </div>
        <div class="mt-4 flex flex-shrink-0 md:ml-4 md:mt-0">
        <router-link :to="{ name: 'orders_create' }">
            <Button label="Nueva Orden" icon="pi pi-plus" size="small" />
        </router-link>
         </div>
      </div>
    </div>   
    <div class="card"> 
        <DataTable v-model:filters="filters" :value="list_orders" paginator showGridlines :rows="10" dataKey="id"
                filterDisplay="menu" :loading="loading.carga_general" :globalFilterFields="['order_id','identification_firstname','identification_lastname','identification_value','begindate' ,'enddate'  ]">
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
            <Column header="Orden" class="table-cell lg:hidden" >
                <template #body="{ data }">
                     <div><strong>No. Orden:</strong> {{ data.order_id }}</div>
                        <div><strong>Tipo:</strong> {{ data.lead_type }}</div>
                        <div><strong>Estado:</strong> {{ getStatusOrder(data.orderstatus_id) }}</div>
                        <div>
                        <strong>Cliente:</strong>
                        {{ data.identification_firstname }} {{ data.identification_lastname }}
                        </div>
                        <div><strong>ID:</strong> {{ data.identification_value }}</div>
                        <div><strong>Creado:</strong> {{ new Date(data.begindate).toLocaleDateString() }}</div>
                        <div v-if="data.enddate">
                        <strong>Fin:</strong> {{ new Date(data.enddate).toLocaleDateString() }}
                        </div>
                </template>
            </Column>
            <Column class="hidden lg:table-cell" field="order_id" header="No. Order" />
            <Column class="hidden lg:table-cell" field="lead_type" header="Tipo" />
            <Column class="hidden lg:table-cell" header="Estado">
                <template #body="{ data }">
                    <span>{{ getStatusOrder(data.orderstatus_id) }}</span>
                </template>
            </Column>
            <Column class="hidden lg:table-cell" field="identification_firstname" header="Nombre" />
            <Column class="hidden lg:table-cell" field="identification_lastname" header="Apellido" />
            <Column class="hidden lg:table-cell" field="identification_value" header="Identificación" />  
            <Column class="hidden lg:table-cell" header="Creado" filterField="begindate" dataType="date" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ new Date(data.begindate).toLocaleDateString() }}
                </template>
                <template #filter="{ filterModel }">
                    <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
                </template>
            </Column>
            <Column class="hidden lg:table-cell" header="Fecha Fin" filterField="enddate" dataType="date" style="min-width: 10rem">
                <template #body="{ data }">
                  <label v-if="data.enddate">{{ new Date(data.enddate).toLocaleDateString() }}</label>  
                </template>
                <template #filter="{ filterModel }">
                    <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
                </template>
            </Column> 
            <Column headerStyle="text-align: center" bodyStyle="text-align: center; overflow: visible">
                <template  #body="{ data }">
                    <router-link :to="{ name: 'orders_edit', params: { id: data.order_id } }"  >
                        <Button  type="button" icon="pi pi-search"  size="small" rounded  />
                    </router-link>
                </template>
            </Column>
        </DataTable>
    </div>
    </div>
  </template>
  
  
   
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { storeToRefs } from 'pinia'; 
  import { FilterMatchMode, FilterOperator } from 'primevue/api';
  import { OrderStore } from '@stores/OrderStore';  

const {a_getOrders} = OrderStore();
const { list_orders, loading } =storeToRefs(OrderStore());
 
  const filters = ref(); 
  const filter_status = ref([ 'borrador', 'activo', 'inactivo']); 
 
  
  onMounted(async () => {

    await a_getOrders();  
     
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
  