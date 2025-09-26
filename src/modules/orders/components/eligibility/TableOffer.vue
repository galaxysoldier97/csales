<template>
    <div class="p-4 bg-white dark:bg-slate-700 dark:text-white shadow-lg rounded-lg"> 
    <DataTable v-model:selection="form_eligibility"  v-model:filters="filters" :value="g_filteredEligibility(filterNegocio)" paginator showGridlines :rows="10" dataKey="id" 
                filterDisplay="menu" :loading="lead_loading.getdata"  v-model:expandedRows="expandedRows"   
                 
                @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" :globalFilterFields="['name','clasification'  ]">
            <template #header>
                    <h1 class="text-lg font-bold leading-7 text-primary-700 dark:text-primary-100 sm:truncate sm:text-2xl sm:tracking-tight text-center"> 
                    Promociones aplicables para el cliente</h1> 
                    <div class="flex flex-wrap justify-center gap-4 mt-4">
                        <label class="inline-flex items-center checkbox-filter">
                            <input 
                            type="checkbox" 
                            v-model="filterNegocio.hogar"
                            class="form-checkbox h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500 dark:bg-slate-700"
                            >
                            <span class="ml-2 text-md font-medium text-primary-700 dark:text-primary-100">HOGAR</span>
                        </label>
    
                        <label class="inline-flex items-center checkbox-filter">
                            <input 
                            type="checkbox" 
                            v-model="filterNegocio.movil"
                            class="form-checkbox h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500 dark:bg-slate-700"
                            >
                            <span class="ml-2 text-md font-medium text-primary-700 dark:text-primary-100">MOVIL</span>
                        </label>
    
                        <label class="inline-flex items-center checkbox-filter">
                            <input 
                            type="checkbox" 
                            v-model="filterNegocio.convergencia"
                            class="form-checkbox h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500 dark:bg-slate-700"
                            >
                            <span class="ml-2 text-md font-medium text-primary-700 dark:text-primary-100">CONVERGENCIA</span>
                        </label>

                        
                        <label class="inline-flex items-center checkbox-filter">
                            <input 
                            type="checkbox" 
                            v-model="filterNegocio.vas"
                            class="form-checkbox h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500 dark:bg-slate-700"
                            >
                            <span class="ml-2 text-md font-medium text-primary-700 dark:text-primary-100">VAS</span>
                        </label>

                        
                        <label class="inline-flex items-center checkbox-filter">
                            <input 
                            type="checkbox" 
                            v-model="filterNegocio.vasMovil"
                            class="form-checkbox h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500 dark:bg-slate-700"
                            >
                            <span class="ml-2 text-md font-medium text-primary-700 dark:text-primary-100">Serv. Supl.</span>
                        </label>
                        </div>
            </template>
            <template #empty> 
               <Message severity="info" :closable="false">No se encontraron ofertas para el barrio seleccionado</Message>
            </template>
            <template #loading> Cargando data. Por favor espere </template>
            <Column header="" style="width: 2rem">
                <template #body="{ data }">
                    <input type="checkbox" v-model="data.checked"  class="form-checkbox h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500 dark:bg-slate-700" @change="onSelectionRuleOffers(data)"/>
                </template>
            </Column>
            <Column expander style="width: 5rem" />
            <Column header="Cantidad" style="width: 2rem">
                <template #body="{ data }">
                    <input type="number" min="1" max="5"  class="w-16 text-center dark:bg-slate-700"
                    v-model="data.quantity"  v-if="['3', '4', '6'].some(val => data.clasification_id.includes(val))" @change="onInputNumberRuleOffers(data)"/>
                    <label v-else>{{ data.quantity }}</label>
                </template>
            </Column>
            <Column field="name" header="Nombre" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.name }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by name" />
                </template>
            </Column>
            <Column header="TV" field="plan_TV.name"></Column>
            <Column header="INTERNET" field="plan_INT.name"></Column>
            <Column header="TELEFONÍA" field="plan_TEL.name"></Column>
            <Column header="MOVIL" field="plan_MOV.name"></Column>   
            <Column header="Precio" field="price">
                <template #body="{ data }">
                    <div v-if="data.clasification_id==8">
                           MOVIL {{ computed_format(data.priceMovil*data.quantity)  }}
                           FIJO {{ computed_format(data.priceFijo*data.quantity)  }}
                    </div>
                    <div v-else>
                        <label v-if="data.data_offer && data.data_offer.vas && data.data_offer.vas.filter(item => item.checked).length > 0"> {{  computed_format((Number(data.price) + Number(data.data_offer.vas.filter(item => item.checked).reduce((acc, item) => acc + (item.quantity * item.price), 0)))*data.quantity ) }}</label>
                        <label v-else> {{ computed_format(data.price*data.quantity)  }}</label>  
                    </div> 
                </template>
            </Column>
            <template #expansion="slotProps">
                <div class="b-1 border-gray-50 bg-white dark:bg-slate-700 dark:text-white shadow-lg"> 
                    <TableOfferDetail v-if="slotProps.data.data_offer" :data_offer="slotProps.data.data_offer"/>
                </div>
            </template>
        </DataTable>
        <Toast />
    </div>
    </template>
    
    <script setup>
    
    import { ref, onMounted, computed, watch , nextTick } from 'vue';
    import { storeToRefs } from 'pinia'; 
    import { FilterMatchMode, FilterOperator } from 'primevue/api';
    import { LeadStore } from '@stores/LeadStore'; 
    import { OfferStore } from '@stores/OfferStore'; 
    import { data_type_offer } from "@helpers/OfferHelper";
    import TableOfferDetail from './TableOfferDetail.vue'; 
    import { useToast } from "primevue/usetoast";
    const toast = useToast();
    
    const {a_get_eligibility} = LeadStore();
    const { form_eligibility, list_eligibility, g_filteredEligibility, lead_loading } =storeToRefs(LeadStore());
    
    const filterNegocio = ref({hogar:false, movil:false, convergencia:false, vas : false, vasMovil:false});
    const {a_fetchOffer} = OfferStore();
    const { data_offer } =storeToRefs(OfferStore());
    
    const computed_format = (value) => {
        return new Intl.NumberFormat('es-PA', { style: 'currency', currency: 'PAB' }).format(value);
    };
    
    const selectedProduct = ref(); 
    const filters = ref();  
    const filter_types = ref(data_type_offer.map(item => item.code));
    
     
    
    const initFilters = () => {
        filters.value = {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            clasification: { value: null, matchMode: FilterMatchMode.EQUALS  }, 
        };
      };
      
      initFilters();
        
      const clearFilter = () => {
        initFilters();
      }; 
    
    
    const expandedRows = ref([]);

    const fn_get_data_offer = async (id) => {
    const item = list_eligibility.value.find(item => item.id == id);
    if (!item.data_offer || item.data_offer.length == 0) 
    {
        const data_offer= await a_fetchOffer(id);
        list_eligibility.value.map((item) => {
            if(item.id==id)
            {
                item.data_offer=data_offer 
            }
        }); 
    }
    };
    
    const onRowExpand = async (event) => 
    {
    const id = event.data.id; 
    fn_get_data_offer(id);
    };
    const onRowCollapse = (event) => {
       // toast.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
    };
    const expandAll = () => {
        expandedRows.value = products.value.reduce((acc, p) => (acc[p.id] = true) && acc, {});
    };
    const collapseAll = () => {
        expandedRows.value = null;
    };

    const onInputNumberRuleOffers = (itemselected) => {
        const cantidad_sel_all = list_eligibility.value.filter(item => item.checked==true).reduce((acc, item) => acc + item.quantity, 0);
        if (cantidad_sel_all > 5) 
        { 
            const quantity=itemselected.quantity
            itemselected.quantity= quantity-1;
            toast.add({ 
                severity: 'error', 
                summary: 'Solo se  puede elegir un maximo de 5 lineas',
                detail: '', 
                life: 8000 
            });  
        }  
    };
    const onSelectionRuleOffers = (itemselected) => { 

        fn_get_data_offer(itemselected.id);
        
        // if list_eligibility not data skip
        if (!list_eligibility.value || list_eligibility.value.length == 0) return;
        const hogarClasifications = ["1", "5", "7", "8"]; // Lista de clasificaciones para hogar
        const hogarVas = ["2" ]; // Lista de clasificaciones para movil
        const movilClasifications = ["4" ]; // Lista de clasificaciones para movil
        const movilVas = ["3" ]; // Lista de clasificaciones para movil
        const movilConvergenteClasifications = ["6" ]; // Lista de clasificaciones para movil
        const cantidad_sel_hogar = list_eligibility.value.filter(item => 
            item.checked==true && hogarClasifications.includes(item.clasification_id)
        ).length;
        const cantidad_sel_hogarVas = list_eligibility.value.filter(item => 
            item.checked==true && hogarVas.includes(item.clasification_id)
        ).length;
        const cantidad_sel_movil = list_eligibility.value.filter(item =>  
        item.checked==true && movilClasifications.includes(item.clasification_id)
        ).length; 
        const cantidad_sel_movilVas = list_eligibility.value.filter(item =>  
        item.checked==true && movilVas.includes(item.clasification_id)
        ).length;
        
        const cantidad_sel_movilConvergente = list_eligibility.value.filter(item =>  
        item.checked==true && movilConvergenteClasifications.includes(item.clasification_id)
        ).length; 

        const cantidad_sel_all = list_eligibility.value.filter(item => item.checked==true).reduce((acc, item) => acc + item.quantity, 0);

        const index = list_eligibility.value.findIndex(item => item.id == itemselected.id);
      

        
         
        if (cantidad_sel_hogar > 1) 
        { 

            itemselected.checked = false;
            toast.add({ 
                severity: 'error', 
                summary: '', 
                detail: 'Solo se puede elegir una Oferta para Hogar', 
                life: 8000 
            });

             
        }
        else if (cantidad_sel_movilConvergente > 5) 
        { 

            itemselected.checked = false;
            toast.add({ 
                severity: 'error', 
                summary: '', 
                detail: 'Solo se puede elegir una Oferta para Convergente Movil.', 
                life: 8000 
            });

             
        }
        else if (cantidad_sel_movil >= 1 && cantidad_sel_movilVas >= 1)
        { 

            itemselected.checked = false;
            toast.add({ 
                severity: 'error', 
                summary: '', 
                detail: 'No se puede elegir una Oferta de Movil y Servicio Suplementario al mismo tiempo',
                life: 8000 
            });

        }
        else if ( ( (cantidad_sel_hogar >= 1 || cantidad_sel_hogarVas >=1 ) && cantidad_sel_movil >= 1) || ( (cantidad_sel_hogar >= 1 || cantidad_sel_hogarVas >=1 ) && cantidad_sel_movilConvergente >= 1) || (cantidad_sel_movil >= 1 && cantidad_sel_movilConvergente >= 1) )
        { 

            itemselected.checked = false; 
            toast.add({ 
                severity: 'error', 
                summary: '',
                detail: 'No se puede elegir una Oferta de Hogar y Movil o Convergente Movil al mismo tiempo',
                life: 8000 
            });
            
 
        } 
        else if (cantidad_sel_all > 5) 
        { 
            itemselected.checked = false;
            toast.add({ 
                severity: 'error', 
                summary: 'Solo se  puede elegir un maximo de 5 ',
                detail: '', 
                life: 8000 
            });  
        }  
    }; 
    </script>
    
    <style>
    [data-pc-section="box"] {
        display: none;
    }
    </style>