<template>
  <div class="mt-4 p-4 bg-white dark:bg-slate-700 dark:text-white px-4 sm:px-6 lg:px-8 shadow-lg rounded-lg" v-if="g_formEligibility && g_formEligibility.length > 0 && g_formEligibility[0].data_offer">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-primary-700 dark:text-primary-100">Propuesta de Servicio</h1> 
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <Button  v-if="order && order.orderstatus_id!=6009"  @click="fn_a_SendEmail()" label="Enviar Propuesta" icon="pi pi-send" size="small"  ></Button>
      </div>
    </div>
    <div class="-mx-4 mt-8 flow-root sm:mx-0">  
      <table class="min-w-full">
        <colgroup>
          <col class="w-full sm:w-1/2" />
          <col class="sm:w-1/6" />
          <col class="sm:w-1/6" />
          <col class="sm:w-1/6" />
        </colgroup>
        <thead class="border-b border-gray-300 text-primary-700 dark:text-primary-100">
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-primary-700 dark:text-primary-100 sm:pl-0">Oferta</th>
            <th scope="col" class="hidden px-3 py-3.5 text-right text-sm font-semibold text-primary-700 dark:text-primary-100 sm:table-cell">Cantidad</th>
            <th scope="col" class="hidden px-3 py-3.5 text-right text-sm font-semibold text-primary-700 dark:text-primary-100 sm:table-cell">Precio x Unidad</th>
            <th scope="col" class="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-primary-700 dark:text-primary-100 sm:pr-0">Total</th>
          </tr>
        </thead>
        <tbody>
 
          <template v-for="item in g_formEligibility" :key="item.id">
              <template v-if=" item.data_offer"> 
                  <tr class="border-b border-gray-200" >
                    <td class="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                      <div class="text-md font-medium text-primary-700 dark:text-primary-100">{{ item.name }}</div>
                      <ul class="ml-4" v-if="item.data_offer && item.data_offer.planes"> 
                        <li v-for="plan in item.data_offer.planes.filter(plan => plan.type != 'MOV')" :key="plan.id" class="text-sm text-primary-700 dark:text-primary-100"> Plan {{plan.type}} : {{ plan.name }}</li>
                      </ul>
                      <p class="mt-2 text-sm text-justify">{{ item.description }}</p>
                      <h3 v-if="item.data_offer && item.data_offer.vas && item.data_offer.vas.some(v => v.checked)" class="mt-2 text-md font-medium text-primary-700 dark:text-primary-100">
                        Servicios Adicionales:
                        <label class="text-gray-700 dark:text-white">
                          {{ item.data_offer.vas
                            .filter(v => v.checked)
                            .map(v => v.quantity > 1 ? `${v.name} (cantidad: ${v.quantity})` : v.name)
                            .join(', ')
                          }}
                        </label>
                      </h3>
                    </td>
                    <td class="hidden px-3 py-5 text-right text-sm text-gray-500 dark:text-white sm:table-cell">{{ item.quantity }}</td>
                    <td class="hidden px-3 py-5 text-right text-sm text-gray-500 dark:text-white sm:table-cell">
                      <label v-if="item.data_offer && item.data_offer.vas && item.data_offer.vas.some(v => v.checked)">
                        {{ computed_format((Number(item.data_offer.price) + Number(item.data_offer.vas.filter(v => v.checked).reduce((acc, v) => acc + (v.quantity * v.price), 0))) ) }}
                      </label>
                      <label v-else>B/. {{ item.data_offer.price}}</label>
                    </td>
                    <td class="py-5 pl-3 pr-4 text-right text-sm text-gray-500 dark:text-white sm:pr-0">
                      <label v-if="item.data_offer && item.data_offer.vas && item.data_offer.vas.some(v => v.checked)">
                        {{ computed_format((Number(item.data_offer.price) + Number(item.data_offer.vas.filter(v => v.checked).reduce((acc, v) => acc + (v.quantity * v.price), 0))) * item.quantity) }}
                      </label>
                      <label v-else> {{ computed_format(item.data_offer.price * item.quantity) }}</label>
                    </td>
                  </tr> 
                  <template v-if="['4' ].includes(item.data_offer.clasification) "> 
                    <template v-for="item in item.data_offer.discounts" :key="item.offeritem_id"> 
                        <tr class="border-b border-gray-200"  v-if="item.prop_1=='1'">
                          <td class="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                            <div class="text-md font-medium text-primary-700 dark:text-primary-100 ml-10">{{ item.block_name }}</div>
                            <p class="text-sm text-justify"></p>
                          </td>
                          <td class="hidden px-3 py-5 text-right text-sm text-gray-500 dark:text-white sm:table-cell"></td>
                          <td class="hidden px-3 py-5 text-right text-sm text-gray-500 dark:text-white sm:table-cell"></td>
                          <td class="py-5 pl-3 pr-4 text-right text-sm text-gray-500 dark:text-white sm:pr-0">
                            <label>{{  item.price   }} % </label>
                          </td> 
                        </tr>
                    </template>
                  </template>
                  <tr class="border-b border-gray-200" v-if="item.data_offer && item.data_offer.planes && item.data_offer.planes.filter(p => p.desc_bundle < 0)">
                    <td class="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                      <div v-if="item.data_offer.clasification!=8" class="text-md font-medium text-primary-700 dark:text-primary-100">Descuento</div>
                      <div v-if="item.data_offer.clasification==8" class="text-md font-medium text-primary-700 dark:text-primary-100">Descuento Fijo</div>
                      <p class="text-sm text-justify"></p>
                    </td>
                    <td class="hidden px-3 py-5 text-right text-sm text-gray-500 dark:text-white sm:table-cell"></td>
                    <td class="hidden px-3 py-5 text-right text-sm text-gray-500 dark:text-white sm:table-cell"></td>
                    <td class="py-5 pl-3 pr-4 text-right text-sm text-gray-500 dark:text-white sm:pr-0">
                      <label v-if="false" >{{ computed_format(Number(item.data_offer.planes.filter(p => p.desc_bundle < 0).reduce((acc, p) => acc + Number(p.desc_bundle), 0)) + item.data_offer.discounts.filter(d => d.prop_1 != '1' && (d.producttype_id ==1 || d.producttype_id==2) ).reduce((acc, d) => acc + Number(d.price), 0)) }}</label>
                      <label >{{ computed_format(Number(item.data_offer.discount)) }}</label>
                    </td>
                  </tr>
                  
                  <tr class="border-b border-gray-200" v-if="item.data_offer.clasification==8">
                    <td class="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0"> 
                      <div class="text-md font-medium text-primary-700 dark:text-primary-100">Plan MOVIL: {{ item.data_offer.planes.find(p => p.type === 'MOV').name }}</div>
                      
                      <p class="text-sm text-justify"></p>
                    </td>
                    <td class="hidden px-3 py-5 text-right text-sm text-gray-500 dark:text-white sm:table-cell">1</td>
                    <td class="hidden px-3 py-5 text-right text-sm text-gray-500 dark:text-white sm:table-cell">{{ computed_format(item.data_offer.planes.find(p => p.type === 'MOV').price) }}</td>
                    <td class="py-5 pl-3 pr-4 text-right text-sm text-gray-500 dark:text-white sm:pr-0">
                      <label>  {{ computed_format(item.data_offer.planes.find(p => p.type === 'MOV').price) }}</label>
                    </td>
                  </tr>

                  <tr class="border-b border-gray-200" v-if="item.data_offer.clasification==8">
                    <td class="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0"> 
                      <div class="text-md font-medium text-primary-700 dark:text-primary-100">Descuento Movil</div>
                      
                      <p class="text-sm text-justify"></p>
                    </td>
                    <td class="hidden px-3 py-5 text-right text-sm text-gray-500 dark:text-white sm:table-cell"></td>
                    <td class="hidden px-3 py-5 text-right text-sm text-gray-500 dark:text-white sm:table-cell"></td>
                    <td class="py-5 pl-3 pr-4 text-right text-sm text-gray-500 dark:text-white sm:pr-0">
                      <label>  {{ computed_format(item.data_offer.movdiscount) }}</label>
                    </td>
                  </tr>
              </template>
          </template>
        </tbody>
        <tfoot>
            <tr>
              <th scope="row" colspan="3" class="hidden pl-4 pr-3 pt-4 text-right text-sm font-semibold text-primary-700 dark:text-primary-100 sm:table-cell sm:pl-0">Total</th>
              <th scope="row" class="pl-4 pr-3 pt-4 text-left text-sm font-semibold text-primary-700 dark:text-primary-100 sm:hidden">Total</th>
              <td class="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-primary-700 dark:text-primary-100 sm:pr-0" v-if="g_formEligibility[0].data_offer.clasification!=8" > 
        
                {{ computed_format(
                    g_formEligibility.reduce((acc, item) => {
                        // Check if the item has data_offer and vas, and if any vas is checked
                        if (item.data_offer && item.data_offer.vas && item.data_offer.vas.some(v => v.checked)) {
                            // Calculate the total price of checked vas items
                            const vasTotal = item.data_offer.vas
                                .filter(v => v.checked)
                                .reduce((vasAcc, v) => vasAcc + (v.quantity * v.price), 0);
                            
                            // Add the item price and vas total, then multiply by item quantity
                            return acc + (Number(item.price) + vasTotal) * item.quantity;
                        } else {
                            // If no vas items are checked, just add the item price multiplied by item quantity
                            return acc + item.price * item.quantity;
                        }
                    }, 0)
                ) }}
              </td>
              <td class="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-primary-700 dark:text-primary-100 sm:pr-0" v-if="g_formEligibility[0].data_offer.clasification==8" > 
                {{ computed_format(g_formEligibility.reduce((acc, item) => acc + (item.data_offer && item.data_offer.vas && item.data_offer.vas.some(v => v.checked) ? (Number(item.convergenteTotal) + Number(item.data_offer.vas.filter(v => v.checked).reduce((acc, v) => acc + (v.quantity * v.price), 0))) * item.quantity : item.convergenteTotal * item.quantity), 0)) }}
              </td>
            </tr>
          </tfoot>
        </table>

    </div>

    <div class="sm:flex sm:items-center mt-10" v-if="!order">
      <div class="sm:flex-auto">
         
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <Button label="Escoger" icon="pi pi-save" :loading="lead_loading.store" size="small" @click="fn_answer_eligibility()" :disabled="lead_stage!='SelectEligibility'" />
      </div>
    </div>
  </div>
</template>


<script setup>
    
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia'; 
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { LeadStore } from '@stores/LeadStore'; 
import { OrderStore } from '@stores/OrderStore'; 
import { useRouter } from 'vue-router';

 
const router = useRouter(); 
const {order} =storeToRefs(OrderStore());
const {a_FindOrderLeadid} = OrderStore();
const {g_formEligibility,lead_stage ,lead_loading,lead_id} =storeToRefs(LeadStore());
const {a_storeAnswer,a_LoadLead,a_LoadEligibility,a_SendEmail} = LeadStore();
const computed_format = (value) => {
        return new Intl.NumberFormat('es-PA', { style: 'currency', currency: 'PAB' }).format(value);
    };  

const fn_answer_eligibility = async () => {
  // Clear the previous answers to avoid duplicate entries
  let data_answer = [];

  g_formEligibility.value.forEach((item) => {

    let selected_offer = {...item}
    let ordering=[];
    
    //obtener VAS
    selected_offer.vas = item.data_offer?.vas?.filter(v => v.checked).map(v => ({
      name: v.name,
      offerId: item.id,
      itemId: v.id,
      qty: v.quantity,
      type: 3,
    })) || [];

    if(item.clasification_id=="6") //MOVIL PLUS BENEFICIO FIJO
    {
      //CANT MOVIL
      ordering.push({
        object_type: 'phone',
        object_id_number: null,
        simcard: null,
        offer_id: item.id,
        action_sales_type: null,
        quantity: item.quantity,
      });
      //BENEFICIO FIJO
      ordering.push({
        object_type: 'account',
        object_id_number: null,
        simcard: null,
        offer_id: item.id,
        action_sales_type: null,
        quantity: 1,
      });
    }
    else if(item.clasification_id=="7") //FIJO PLUS BENEFICIO MOVIL
    {
      //CANT MOVIL
      ordering.push({
        object_type: 'phone',
        object_id_number: null,
        simcard: null,
        offer_id: item.id,
        action_sales_type: null,
        quantity: 1,
      });
      //BENEFICIO FIJO
      ordering.push({
        object_type: 'account',
        object_id_number: null,
        simcard: null,
        offer_id: item.id,
        action_sales_type: null,
        quantity: 1,
      });
    }
    
    else if(item.clasification_id=="8") //FIJO + MOVIL
    {
      //CANT MOVIL
      ordering.push({
        object_type: 'phone',
        object_id_number: null,
        simcard: null,
        offer_id: item.id,
        action_sales_type: null,
        quantity: 1,
      });
      //BENEFICIO FIJO
      ordering.push({
        object_type: 'account',
        object_id_number: null,
        simcard: null,
        offer_id: item.id,
        action_sales_type: null,
        quantity: 1,
      });
    }
    else
    {
      const l_type = ["3","4"].includes(item.clasification_id) ? 'phone' : 'account';
  
  
      ordering.push({
          object_type: l_type,
          object_id_number: null,
          simcard: null,
          offer_id: item.id,
          action_sales_type: null,
          quantity: item.quantity,
        });

    } 
     

    selected_offer.ordering = ordering;

    data_answer.push(selected_offer);
       
  });
 
  try { 
    const { ok } = await a_storeAnswer(data_answer);
    if (!ok) {
      console.error('Failed to store answer');
    }
    else{
      await a_FindOrderLeadid(lead_id.value);
      router.push({ name: 'orders_edit', params : { id: order.value.order_id } });
    }
  } catch (error) {
    console.error('Error in storing answer:', error);
  }
};


const fn_a_SendEmail= async () => {
  console.debug('fn_a_SendEmail');
  await a_SendEmail(lead_id.value);
}

 
</script>