<template>
    <div class="mt-4 p-4 bg-white dark:bg-slate-700 dark:text-white px-4 sm:px-6 lg:px-8 shadow-lg rounded-lg">
        <Toast />
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-primary-700 dark:text-primary-100">Ingrese los Números y Simcard</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-white">   </p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none"> 
      </div>
    </div>
    <div class="mx-2 flow-root sm:mx-0"> 
        <table class="min-w-full divide-y divide-gray-300" v-if="loading_component">
            <thead>
              <tr>
                <th scope="col" class="hidden md:table-cell py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-primary-100 sm:pl-0 dark:text-primary-100">Oferta</th>
                <th scope="col" class="hidden md:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-primary-100">Tipo de Venta</th> 
                <th scope="col" class="hidden md:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-primary-100">Simcard</th>
                <th scope="col" class="hidden md:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-primary-100">Teléfono</th>
                <th scope="col" class="hidden md:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-primary-100">Operador</th> 
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="item in data_question.data.answer.input_required" :key="item.id">
                <td class=" md:hidden whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-primary-100 sm:pl-0 max-w-200 break-all">
                    <div class="block w-full">Oferta: {{ item.offer_name }}</div>
                    <div class="block w-full">
                        <label for="select-action-sales-type" class="block w-full">Tipo de Acción:</label>
                        <select
                        id="select-action-sales-type"
                        v-model="item.action_sales_type"
                        @change="item.object_id_number='', item.simcard=''"
                        class="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 dark:text-white dark:bg-slate-700 rounded-md focus:outline-none focus:ring focus:ring-primary-500 focus:border-primary-500"
                        >
                        <template v-for="action in temp_list_action_sales_type">
                            <option :value="action.id" v-if="action.vvalue==item.object_type">{{ action.name }}</option>
                        </template>
                        </select>
                    </div>
                    <div class="block w-full">
                        <label for="input-simcard" class="block w-full">Simcard:</label>
                        <input
                        id="input-simcard"
                        v-model="item.simcard"
                        :disabled="item.action_sales_type==list_action_sales_type.find(x => x.name=='PRE a POS').id || item.action_sales_type==list_action_sales_type.find(x => x.name=='Cambio de Plan').id"
                        type="text"
                        class="w-full px-3 py-2 text-sm text-gray-900 dark:text-white dark:bg-slate-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary-500 focus:border-primary-500"
                        @change="item.object_id_number=''"
                        />
                    </div>
                    <div class="block w-full">
                        <label for="input-simcard" class="block w-full">Teléfono:</label>
                        <template v-if="item.action_sales_type!='' && item.action_sales_type!=null && item.action_sales_type == list_action_sales_type.find(x => x.name=='Portabilidad').id">
                            <select v-model="item.object_id_number" class="dark:text-white dark:bg-slate-700" >
                                <option v-for="item in g_portabilityOrUpgradePhones" :key="item.celular" :value="item.celular">{{ item.celular }} - {{ item.codOperadoraActual  }}</option>
                            </select>
                        </template>
                        <template v-else-if="item.action_sales_type!='' && item.action_sales_type!=null && item.action_sales_type == list_action_sales_type.find(x => x.name=='Cambio de Plan').id">
                            <select v-model="item.object_id_number" class="dark:text-white dark:bg-slate-700" @change="fn_get_simcard(item)">
                                <option v-for="item in g_systemRegisteredPhonesPOS" :key="item.celular" :value="item.celular">{{ item.celular }}</option>
                            </select>
                        </template>
                        <template v-else-if="item.action_sales_type!='' && item.action_sales_type!=null && item.action_sales_type == list_action_sales_type.find(x => x.name=='Nueva Venta').id">
                            <input v-model="item.object_id_number" disabled type="text" class="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary-500 focus:border-primary-500 dark:text-white dark:bg-slate-700" />
                        </template> 
                        <template v-else-if="item.action_sales_type!='' && item.action_sales_type!=null && item.action_sales_type == list_action_sales_type.find(x => x.name=='PRE a POS').id">
                            <select v-model="item.object_id_number" class="dark:text-white dark:bg-slate-700" @change="fn_get_simcard(item)">
                                <option value="">Seleccione un número</option>
                                <option v-for="item in g_systemRegisteredPhonesPRE" :key="item.celular" :value="item.celular">{{ item.celular }}</option>
                            </select>
                        </template> 
                    </div>
                    <div class="block w-full">Operador: {{ item.operador }}</div>
                </td>
                <td class="hidden md:table-cell whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-primary-100 sm:pl-0 max-w-200 break-all">{{ item.offer_name }}</td>
                <td class="hidden md:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <select v-model="item.action_sales_type"  @change="item.object_id_number='',item.simcard=''"
                  class="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 dark:text-white dark:bg-slate-700 rounded-md focus:outline-none focus:ring focus:ring-primary-500 focus:border-primary-500">
                    <template v-for="action in temp_list_action_sales_type">
                      <option :value="action.id" v-if="action.vvalue==item.object_type">{{ action.name }}</option> 
                    </template>
                  </select>
                </td> 
                <td class="hidden md:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <input v-model="item.simcard" :disabled="item.action_sales_type==list_action_sales_type.find(x => x.name=='PRE a POS').id || item.action_sales_type==list_action_sales_type.find(x => x.name=='Cambio de Plan').id"
                     type="text" class="w-full px-3 py-2 text-sm text-gray-900 dark:text-white dark:bg-slate-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary-500 focus:border-primary-500"
                     @change="item.object_id_number=''"  />
                </td>
                <td class="hidden md:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <template v-if="item.action_sales_type!='' && item.action_sales_type!=null && item.action_sales_type == list_action_sales_type.find(x => x.name=='Portabilidad').id">
                        <select v-model="item.object_id_number" class="dark:text-white dark:bg-slate-700" >
                            <option v-for="item in g_portabilityOrUpgradePhones" :key="item.celular" :value="item.celular">{{ item.celular }} - {{ item.codOperadoraActual  }}</option>
                        </select>
                    </template>
                    <template v-else-if="item.action_sales_type!='' && item.action_sales_type!=null && item.action_sales_type == list_action_sales_type.find(x => x.name=='Cambio de Plan').id">
                        <select v-model="item.object_id_number" class="dark:text-white dark:bg-slate-700" @change="fn_get_simcard(item)">
                            <option v-for="item in g_systemRegisteredPhonesPOS" :key="item.celular" :value="item.celular">{{ item.celular }}</option>
                        </select>
                    </template>
                    <template v-else-if="item.action_sales_type!='' && item.action_sales_type!=null && item.action_sales_type == list_action_sales_type.find(x => x.name=='Nueva Venta').id">
                        <input v-model="item.object_id_number" disabled type="text" class="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary-500 focus:border-primary-500 dark:text-white dark:bg-slate-700" />
                    </template> 
                    <template v-else-if="item.action_sales_type!='' && item.action_sales_type!=null && item.action_sales_type == list_action_sales_type.find(x => x.name=='PRE a POS').id">
                        <select v-model="item.object_id_number" class="dark:text-white dark:bg-slate-700" @change="fn_get_simcard(item)">
                            <option value="">Seleccione un número</option>
                            <option v-for="item in g_systemRegisteredPhonesPRE" :key="item.celular" :value="item.celular">{{ item.celular }}</option>
                        </select>
                    </template> 
                </td>
                <td class="hidden md:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-white">{{ item.operador }}</td>
                 
              </tr>
            </tbody>
          </table> 
          <div>
            <div v-for="item in respValidaciones" :key="item.data" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong class="font-bold">Error! </strong>
              <span class="block sm:inline">{{ item.message }}</span>
            </div>
            <Message :closable="false" severity="success" v-if="valid_phones">El formulario de SIMCARD es válido. Ya puede enviar la información.</Message>
          </div>
      </div>
      
    <div class="sm:flex sm:items-center mt-10" >
      <div class="sm:flex-auto">
         
      </div>
      <div class="mt-4 flex justify-between sm:ml-16 sm:mt-0">
        <Button v-if="g_OrderIsActive" label="Validar" severity="success" icon="pi pi-check-circle" :loading="loading" size="small" @click="fn_validar_full()" />
        <Button v-if="g_OrderIsActive" class="ml-4" label="Enviar" :disabled="!valid_phones" icon="pi pi-save" :loading="loading_store" size="small" @click="fn_answer()" />
    </div>

    </div>

    </div>
</template>

<script setup>
import { ref, onMounted,computed } from 'vue';
import { storeToRefs } from 'pinia';  
import { LeadStore } from '@/stores/LeadStore';
import { SCLStore } from '@/stores/SCLStore';
import { SystemDataStore } from '@/stores/SystemDataStore';
import { useToast } from "primevue/usetoast";
const toast = useToast();
import { OrderStore } from '@stores/OrderStore';
const {g_OrderIsActive} = storeToRefs(OrderStore());
    
  
const {a_getDataComponent} = SystemDataStore();
const { a_actGetOperador, a_getBodega, a_validPhoneOrder, a_actBodegaValida ,a_fetchConsultsubscriber } = SCLStore();
const { lead_loading, data_question ,g_portabilityOrUpgradePhones, g_systemRegisteredPhonesPOS,g_systemRegisteredPhonesPRE} = storeToRefs(LeadStore());
const { a_storeAnswer } = LeadStore(); 

const loading = ref(false);
const loading_store = ref(false);
 
const respValidaciones = ref([]);
const valid_phones = ref(false);


const fn_answer = async () => {  
    loading_store.value = true;
    await fn_validar_full();
    await a_storeAnswer(data_question.value.data.answer.input_required);
    loading_store.value = false;
}

const fn_validar_if_order_existente = async () => {  
  
    for (const element of data_question.value.data.answer.input_required) {
        if (element.simcard && element.object_id_number) {
            const { aprobado, err } = await a_validPhoneOrder(element.object_id_number, element.simcard);
            if (!aprobado) {
                respValidaciones.value.push({ data: element, message: err });
            }
        }
    }
}

const fn_get_simcard = async (item) => {
    const {ok,data} = await a_fetchConsultsubscriber(null,null,item.object_id_number)
    if(!ok)
    {
        toast.add({ 
                severity: 'error', 
                summary: 'Error al buscar SIMCARD',
                detail: 'La línea '+item.object_id_number+' no se encuentra activa en el sistema.',
                life: 8000 
            }); 
        return;
    }
    item.simcard = data.numSerie
    item.abonado = data.numAbonado
}

 
const fn_validar_full = async () => { 
    loading.value = true;
    respValidaciones.value = [];
    const simcardEmpty = data_question.value.data.answer.input_required.filter(item => !item.simcard);
    
    if (simcardEmpty.length > 0) {
        respValidaciones.value.push({ data: null, message: 'No puede haber SIMCARD vacías. Complete los campos.' });
         loading.value = false; return;
    }
 
  
    for (const element of data_question.value.data.answer.input_required) {
        await fn_validar(element);
    }

    const phoneEmpty = data_question.value.data.answer.input_required.filter(item => !item.object_id_number);
    const simcardRepeted = data_question.value.data.answer.input_required.filter((item, index) => data_question.value.data.answer.input_required.findIndex(x => x.simcard === item.simcard) === index);
    const phoneRepeted = data_question.value.data.answer.input_required.filter((item, index) => data_question.value.data.answer.input_required.findIndex(x => x.object_id_number === item.object_id_number) === index);
   
    if(phoneEmpty.length > 0)
    {
        respValidaciones.value.push({ data: null, message: 'No puede haber Teléfonos vacíos. Complete los campos.' });
         loading.value = false; return;
    }

    if (simcardRepeted.length !== data_question.value.data.answer.input_required.length) {
        respValidaciones.value.push({ data: null, message: 'No puede haber SIMCARD repetidas.' });
         loading.value = false; return;
    }

    if (phoneRepeted.length !== data_question.value.data.answer.input_required.length) {
        respValidaciones.value.push({ data: null, message: 'No puede haber teléfonos repetidos.' });
         loading.value = false; return;
    }

    await fn_validar_if_order_existente();  

    if(respValidaciones.value.length>0)
    {
        loading.value = false;
        return;
    }
    else
    {
        valid_phones.value = true;
    } 
    loading.value = false;
} 

const fn_validar = async (item) => {  

    try
    {
         
        if (item.simcard && item.simcard.length < 10) { 
            respValidaciones.value.push({ data: item, message: 'Ingrese un número de SIMCARD válido.' });
            item.status='ERROR';
            loading.value = false; return;
        }

        if (item.action_sales_type === list_action_sales_type.value.find(x => x.name=='Cambio de Plan').id) 
        {
            if (!item.object_id_number) {
                respValidaciones.value.push({ data: item, message: 'Ingrese un número de teléfono válido para Cambio de Plan.' });
                item.status='ERROR';
                loading.value = false; return;
            }
        }

        else if (item.action_sales_type === list_action_sales_type.value.find(x => x.name=='PRE a POS').id) 
        {
            if (!item.object_id_number) {
                respValidaciones.value.push({ data: item, message: 'Ingrese un número de teléfono válido para PRE a POS.' });
                item.status='ERROR';
                loading.value = false; return;
            }
        }
        else
        {

            const { ok, data_bodega } = await a_getBodega(item.simcard);

            if (!ok) {
                respValidaciones.value.push({ data: item, message: `No se encontró bodega para este SIM: ${item.simcard}. Por favor ingrese un número SIM válido.` });
                loading.value = false; return;
            }

            const { okvalidabodega, msg } = await a_actBodegaValida(data_bodega.cod_bodega);
            if (!okvalidabodega) {
                respValidaciones.value.push({ data: item, message: `La bodega no es válida para este SIM: ${item.simcard} ${msg}.` });
                loading.value = false; return;
            }

            if(data_bodega.num_telefono && item.object_id_number && data_bodega.num_telefono != item.object_id_number)
            {
                respValidaciones.value.push({ data: item, message: `La SIMCARD ${item.simcard} ya tiene un número asociado. No es posible asociar a ${item.object_id_number}.` });
                loading.value = false; return;
            }

            if(!data_bodega.num_telefono && !item.object_id_number)
            {
                respValidaciones.value.push({ data: item, message: `La SIMCARD ${item.simcard} no tiene un número asociado. Por favor, ingrese un número.` });
                loading.value = false; return;
            }

            if(data_bodega.cod_uso !=item.cod_uso)
            {
                respValidaciones.value.push({ data: item, message: `La SIMCARD ${item.simcard} no tiene el Codigo de USO correcto a la Oferta` });
                loading.value = false; return;
            }   



            if(data_bodega.num_telefono)
            {

                const { ok_operador, data_operador } = await a_actGetOperador(data_bodega.num_telefono);

                data_question.value.data.answer.input_required.forEach(element => {
                    if (element.simcard === item.simcard) {
                        element.object_id_number = data_bodega.num_telefono || item.object_id_number;
                        element.cod_uso = data_bodega.cod_uso;
                        element.bodega = data_bodega.cod_bodega;
                        element.operador = data_operador.operador;
                        element.codoperador=data_operador.codOperadoraActual;
                        fn_validar_operador(element, item, data_operador, ok_operador);
                    }
                });
            }

            else if (item.object_id_number)
            {
            
                const { ok_operador, data_operador } = await a_actGetOperador(item.object_id_number);

                data_question.value.data.answer.input_required.forEach(element => {
                    if (element.simcard === item.simcard) {
                        element.cod_uso = data_bodega.cod_uso;
                        element.bodega = data_bodega.cod_bodega;
                        element.operador = data_operador.operador;
                        element.codoperador=data_operador.codOperadoraActual;
                    }
                });
            }
        
        }
    }catch(e)
    {
        console.error(e);
        respValidaciones.value.push({ data: item, message: 'Error al validar SIMCARD.' });
        loading.value = false; return;
    }
  
 
}

const fn_validar_operador = (element, item, data_operador, ok_operador) => {
    console.debug('fn_validar_operador', element, item, data_operador, ok_operador);
    if (ok_operador) {
        if (data_operador.codOperadoraActual == 196) {
            if (element.action_sales_type === list_action_sales_type.value.find(x => x.name=='Portabilidad').id) {
                respValidaciones.value.push({ data: item, message: `La SIMCARD ${item.simcard} es para una Nueva Venta. Por favor, seleccione el tipo de venta correcto.` });
            } else {
                element.action_sales_type = list_action_sales_type.value.find(x => x.name=='Nueva Venta').id;
            }
        } else {
            if (element.action_sales_type == list_action_sales_type.value.find(x => x.name=='Nueva Venta').id) {
                respValidaciones.value.push({ data: item, message: `La SIMCARD ${item.simcard} es para una Portabilidad. Por favor, seleccione el tipo de venta correcto.` });
            } else {
                element.action_sales_type = list_action_sales_type.value.find(x => x.name=='Portabilidad').id;
            }
        }
    } else {
        element.action_sales_type = 'ERROR';
        respValidaciones.value.push({ data: item, message: 'No se pudo validar el operador del número.' });
    }
}


const loading_component = ref(false)
const list_action_sales_type = ref(null)
 
const temp_list_action_sales_type=ref([])
 
onMounted(async () => {
    list_action_sales_type.value= await a_getDataComponent('Action_Sales_Type'); 
    if(g_systemRegisteredPhonesPRE.value && g_systemRegisteredPhonesPRE.value.length > 0)
    { 
        temp_list_action_sales_type.value.push(list_action_sales_type.value.find(item => item.name=='PRE a POS'))
    }
    if(g_systemRegisteredPhonesPOS.value && g_systemRegisteredPhonesPOS.value.length > 0)
    { 
        temp_list_action_sales_type.value.push(list_action_sales_type.value.find(item => item.name=='Cambio de Plan'))
    }
    if(g_portabilityOrUpgradePhones.value && g_portabilityOrUpgradePhones.value.length > 0)
    { 
        temp_list_action_sales_type.value.push(list_action_sales_type.value.find(item => item.name=='Portabilidad'))
    }

    temp_list_action_sales_type.value.push(list_action_sales_type.value.find(item => item.name=='Nueva Venta'))


    loading_component.value = true;
});
</script>
