
<template> 
    <div class="xl:container mx-auto bg-gray-100 dark:bg-slate-800 dark:text-white"  v-if="order">
        <div class="mb-2"> 
          <div class="md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
              <h2  class="text-2xl font-bold leading-7 text-primary-700 dark:text-primary-100 sm:truncate sm:text-3xl sm:tracking-tight">
                Orden: {{ order.order_id }}</h2>
            </div> 
              <div class="mt-4 flex flex-shrink-0 md:ml-4 md:mt-0 gap-2"
              v-if="order && g_OrderIsActive">  
                
                <a :href="data_adjunto['numero_orden']" target="_blank"  v-if="data_adjunto['valido']">
                  <Button label="Adjuntar Documentos" icon="pi pi-link" size="small" />
                </a> 
 
                <Button v-if="order.orderstatus_id==6007" severity="success"  label="Aprobar Pago" icon="pi pi-check-square" size="small" @click="fn_aprobarPago()"/>

                <SplitButton v-if="order.orderstatus_id!=6009"   size="small" label="Acciones" class="dark:text-white"  :model="visibleItems" />
              </div>
          </div>
        </div>   
        <div class="bg-gray-100 dark:bg-slate-800 dark:text-white sm:min-h-screen" v-if="component_loading.finished"> 
              <DatosOrdenComponent /> 
              <TableOfferSelected />
              <OrderingComponent v-if="lead_stage.includes('Ordering')" />
              <LeadOrderingComponent v-if="lead_stage == 'End'" />  
              <MatchDigitalComponent  v-if="data_lead && data_lead['lead_data'] && data_lead['lead_data']['lead_type']=='MATCH DIGITAL'"/>
              <MobileIntegrationComponent v-if="lead_stage == 'End' && order " />
              <HogarIntegrationComponent v-if="lead_stage == 'End' && order " />
              <AppointmentComponent v-if="lead_stage == 'End' && order && order.orderstatus_name=='Pending Appointment'" />
              <EndComponent v-if="lead_stage == 'End'" />  
 
        </div>
    
        <!-- MODAL-->
        <div class="card flex justify-center"> 
        <Dialog v-model:visible="visible_modal" modal :header="typeAccion_modal+' Orden'" class="md:w-[50rem] w-full">
            <Message :closable="false" severity="warn"> ¿Estás seguro de realizar esta acción?</Message>
            <div v-if="typeAccion_modal=='Cancelar' || typeAccion_modal=='Rechazar'"> 
                <div class="md:flex md:items-center md:gap-4 mb-4 flex flex-col md:flex-row">
                    <label class="font-semibold w-24">Razón: </label>
                    <select v-model="form_acciones.motivo" class="flex-auto dark:bg-slate-800 dark:text-white" autocomplete="off">
                        <option ref="" value="">Seleccione una razón</option>
                        <option v-for="item in form_acciones.data_reason" :key="item.vvalue" :value="item.vvalue">{{ item.vvalue }}</option>
                    </select>
                </div>
                <div class="md:flex md:items-center md:gap-4 mb-4 flex flex-col md:flex-row">
                    <label class="font-semibold w-full md:w-24">Comentarios Adicionales: </label>
                    <textarea v-model="form_acciones.mensaje" class="flex-auto dark:bg-slate-800 dark:text-white" autocomplete="off"   rows="3" placeholder="Ingrese un comentario adicional para la orden"
                    ></textarea>
                </div>
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" size="small" label="Cancelar" severity="secondary" @click="visible_modal = false"></Button>
                <Button size="small" v-if="typeAccion_modal=='Cancelar'" type="button" label="Cancelar Orden" severity="warning" @click="fn_cancelar()"></Button>
                <Button size="small" v-if="typeAccion_modal=='Rechazar'" type="button" label="Rechazar Orden" severity="warning" @click="fn_rechazar()"></Button>
            </div>
        </Dialog>
    </div> 
      </div>
        <!--tabs-->
        
    
      </template>
      
      
      <script setup>
      import { ref, watch , computed, onMounted} from "vue"; 
      import { useRoute } from "vue-router";
      import { storeToRefs } from "pinia";
      import { EyeIcon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
      import AppointmentComponent from "../components/ordering/AppointmentComponent.vue";
      import DatosOrdenComponent from '../components/identification/DatosOrdenComponent.vue';
      import EndComponent from '../components/ordering/EndComponent.vue';
      import HogarIntegrationComponent from '../components/ordering/HogarIntegrationComponent.vue';
      import LeadOrderingComponent from '../components/ordering/LeadOrderingComponent.vue';
      import MatchDigitalComponent from '../components/ordering/MatchDigitalComponent.vue';
      import MobileIntegrationComponent from '../components/ordering/MobileIntegrationComponent.vue';
      import OrderingComponent from "../components/OrderingComponent.vue";
      import TableOfferSelected from '../components/eligibility/TableOfferSelected.vue';  
      import {OrderStore} from '@/stores/OrderStore'
      import { SystemDataStore } from "@/stores/SystemDataStore";
      import {LeadStore} from '@/stores/LeadStore' 
      import { useToast } from "primevue/usetoast";
      import Swal from 'sweetalert2'; 
     
      const component_loading = ref({started: false, finished: false});

      const {order,g_OrderIsActive,data_adjunto} = storeToRefs(OrderStore());
      const {lead_stage,data_lead} = storeToRefs(LeadStore());
      const {a_getOrder,a_urlAdjunto , a_aprobarPago, a_cancelarOrden, a_rechazarOrden} = OrderStore();
      const {a_LoadLead,a_LoadEligibility} = LeadStore();

      const router = useRoute(); 
      const toast = useToast();

      const {a_getDataComponent,a_getDataCancelReason, a_getDataRejectReason, a_getActionSalesType,a_getOrderStatus} = SystemDataStore();
      const {data_action_sales_type, data_order_status} = storeToRefs(SystemDataStore()); 
     
      const visible_modal = ref(false);
      const typeAccion_modal = ref('');
      const form_acciones = ref({
        motivo: '',
        mensaje: '',
        data_reason: []
      });
      const items = ref([])

 
      const visibleItems = computed(() => {
        return items.value.filter(item => item.visible());
      });

      const fn_cancelar = async() => {
        const {ok} = await a_cancelarOrden(form_acciones.value.motivo, form_acciones.value.mensaje);
        if(ok){
          toast.add({ severity: 'success', summary: 'Cancelado', detail: 'Orden cancelada', life: 3000 });
          visible_modal.value = false;
          await a_getOrder( router.params.id ); 
        }
      }

      const fn_rechazar = async() => {
        const {ok} = await a_rechazarOrden(form_acciones.value.motivo, form_acciones.value.mensaje);
        if(ok){
          toast.add({ severity: 'success', summary: 'Cancelado', detail: 'Orden cancelada', life: 3000 });
          visible_modal.value = false;
          await a_getOrder( router.params.id ); 
        }
      }

      const fn_aprobarPago = async () => {
                
            const confirmResult  = await Swal.fire({
              title: '¿Estás seguro de aprobar el pago?',
              text: 'La orden omitirá de inmediato la etapa de pago pendiente.',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Sí, aprobar',
              cancelButtonText: 'Cerrar',
              confirmButtonColor: '#dc3545',
              cancelButtonColor: '#6c757d',
            });

            if (confirmResult.isConfirmed) 
            {
              const {ok,message} = await a_aprobarPago()
              await a_getOrder( router.params.id ); 
              if(!ok){
              toast.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
              } 
              else {
                toast.add({ severity: 'success', summary: 'Aprobado', detail: 'Pago aprobado', life: 3000 });
              }
            }
      }

    onMounted( async ()=> {
      component_loading.value.started = true;
              
      await Promise.all([
        a_getOrder(router.params.id),
        a_getOrderStatus(),
        a_getActionSalesType()
      ]);

       items.value= [
        {
          label: 'Duplicar propuesta',
          icon: 'pi pi-copy',
          command: () => {
            visible_modal.value = true;
            typeAccion_modal.value = 'Duplicar';
          },
          visible: () => ![
          data_order_status.value.find(x => x.name == 'Pending Payment').id, 
          data_order_status.value.find(x => x.name == 'Waiting for contract sign').id, 
              data_order_status.value.find(x => x.name == 'Waiting for client').id].includes( order.value.orderstatus_id)
        },
        {
          separator: true,
          visible: () => true
        },
        {
          label: 'Rechazar',
          icon: 'pi pi-times',
          command: async() => {
            visible_modal.value = true;
            typeAccion_modal.value = 'Rechazar';
            form_acciones.value.data_reason = await a_getDataRejectReason();
          },
          visible: () => order.value.orderstatus_id.includes(data_order_status.value.find(x => x.name == 'Leak').id)
        },
        {
          label: 'Cancelar',
          icon: 'pi pi-trash',
          command: async() => {
            visible_modal.value = true;
            typeAccion_modal.value = 'Cancelar';
            form_acciones.value.data_reason = await a_getDataCancelReason();
          },
          visible: () => ![
          data_order_status.value.find(x => x.name == 'Pending Payment').id, 
          data_order_status.value.find(x => x.name == 'Waiting for contract sign').id, 
              data_order_status.value.find(x => x.name == 'Waiting for client').id].includes( order.value.orderstatus_id)
        },
        {
          separator: true,
          visible: () => true
        },
        {
          label: 'Reenviar cierre',
          icon: 'pi pi-send',
          command: () => {
            visible_modal.value = true;
            typeAccion_modal.value = 'Reenviar';
          },
          visible: () => order.value.orderstatus_id.includes(data_order_status.value.find(x => x.name == 'Waiting for contract sign').id)
        }
      ] 

      await Promise.all([ 
        a_LoadLead(order.value),
        a_LoadEligibility(order.value.offers),
        a_urlAdjunto(order.value.order_id)
      ]);
      component_loading.value.finished = true;
    } )
      </script>