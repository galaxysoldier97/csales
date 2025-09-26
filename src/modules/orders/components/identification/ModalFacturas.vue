
<template>
    <div class="card flex justify-center"> 
        <Button label="Ver Facturas" rounded  size="small"  @click="visible = true"/>
        <Dialog v-model:visible="visible" modal header="Facturas"  class="md:w-1/2 w-full" >
            
            <div class="card min-h-64" >
                <TabView>
                    <TabPanel header="Hogar">
                        <div>  
                            <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            v-model="form_hogar_cliente" @change="handleSelectChange($event)">
                                <option v-for="item in list_accounts" :key="item.Cuenta" :value="item.Cuenta">
                                    Cuenta {{ item.Cuenta }} - {{ item.barrio }}
                                </option>
                            </select>

                            <div class="mt-6 border-t border-gray-100">
                                <dl class="divide-y divide-gray-100">
                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt class="text-sm font-medium leading-6 text-gray-900 dark:text-white">Saldo</dt>
                                    <dd class="mt-1 text-sm leading-6 text-gray-700 dark:text-white sm:col-span-2 sm:mt-0">B/. {{ list_accounts.find(item => item.Cuenta === form_hogar_cliente)?.saldo_vencido }}</dd>
                                </div>
                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt class="text-sm font-medium leading-6 text-gray-900 dark:text-white">Match Digital</dt>
                                    <dd class="mt-1 text-sm leading-6 text-gray-700 dark:text-white sm:col-span-2 sm:mt-0">{{ match_digital_value  }} / 4</dd>
                                </div>
                                </dl>
                            </div>


                                <div v-show="account_loading.facturas" class="mt-2" > 
                                    <Message :closable="false"> Cargando facturas...</Message>             
                                    <Skeleton class="mb-2"></Skeleton>
                                    <Skeleton width="10rem" class="mb-2"></Skeleton>
                                    <Skeleton width="5rem" class="mb-2"></Skeleton>
                                    <Skeleton height="2rem" class="mb-2"></Skeleton>
                                    <Skeleton width="10rem" height="4rem"></Skeleton>
                                </div>
                                <Message :closable="false" v-show="form_hogar_cliente && !account_loading.facturas && list_facturas_hogar.length == 0"
                                > No se encontraron facturas para esta cuenta</Message>
                                <ul role="list" class="divide-y divide-gray-100" v-show="!account_loading.facturas">
                                    <li v-for="item in list_facturas_hogar" :key="item.id" class="flex items-center justify-between gap-x-6 py-5">
                                    <div class="min-w-0">
                                        <div class="flex items-start gap-x-3">
                                        <p class="text-md font-semibold leading-6 text-gray-900 dark:text-white">{{  moment(item.issuedate).format('MMMM/YYYY') }}</p>
                                        <!-- <p :class="[statuses[item.status], 'mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset']">{{ item.status }}</p>-->
                                        </div>
                                        <div class="mt-1 flex items-center gap-x-2 text-md leading-5 text-gray-500 text-bold">
                                            B/. {{ item.dtinitamount }}
                                        </div>
                                    </div>
                                    <div class="flex flex-none items-center gap-x-4"> 
                                        <Button label="Descargar" text raised :loading="item.flag_descargar" rounded size="small"  @click="fn_PDFFacturasHogar(item)"  /> 
                                    </div>
                                    </li>
                                </ul>
                            </div>
                    </TabPanel>
                    <TabPanel header="Móvil" >
                        <div>  
                            <select  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            v-model="form_movil_cliente">
                                <option v-for="item in list_movilcuentas" :key="item.Cuenta" :value="item.Cuenta">
                                    Cuenta {{ item.Cuenta }} - {{ item.barrio }}
                                </option>
                            </select>
                                <div v-show="scl_loading.facturas_movil" class="mt-2" > 
                                    <Message :closable="false"> Cargando facturas...</Message>             
                                    <Skeleton class="mb-2"></Skeleton>
                                    <Skeleton width="10rem" class="mb-2"></Skeleton>
                                    <Skeleton width="5rem" class="mb-2"></Skeleton>
                                    <Skeleton height="2rem" class="mb-2"></Skeleton>
                                    <Skeleton width="10rem" height="4rem"></Skeleton>
                                </div>
                                <Message :closable="false" v-show="form_movil_cliente && !scl_loading.facturas_movil && list_facturas_movil.length == 0"> No se encontraron facturas para esta cuenta</Message>
                                <ul role="list" class="divide-y divide-gray-100" v-show="!scl_loading.facturas_movil">
                                    <li v-for="item in list_facturas_movil" :key="item.id" class="flex items-center justify-between gap-x-6 py-5">
                                    <div class="min-w-0">
                                        <div class="flex items-start gap-x-3">
                                        <p class="text-md font-semibold leading-6 text-gray-900 dark:text-white">{{item.invoiceId}} - {{  moment(item.issuedate).format('MMMM/YYYY') }}</p>
                                        <!-- <p :class="[statuses[item.status], 'mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset']">{{ item.status }}</p>-->
                                        </div>
                                        <div class="mt-1 flex items-center gap-x-2 text-md leading-5 text-gray-500 text-bold dark:text-sky-400"> 
                                            B/. {{ item.amount }}
                                        </div>
                                    </div> 
                                    <div class="flex flex-none items-center gap-x-4"> 
                                        <Button label="Descargar" text raised   rounded size="small"  @click="fn_PDFFacturasMovil(item)"  /> 
                                    </div>
                                    </li>
                                </ul>
                            </div>
                    </TabPanel> 
                </TabView>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref,onMounted,watch,computed } from "vue"; 
import { storeToRefs } from 'pinia';
import { CustomerStore } from "@/stores/CustomerStore";
import { LeadStore } from "@/stores/LeadStore";
import { SCLStore } from "@/stores/SCLStore";
import moment from 'moment';

const {a_PDFFacturasHogar,a_PDFFacturasMovil, a_fetchFacturasHogar ,a_matchDigital} = CustomerStore();
const { list_accounts, list_facturas_hogar, account_loading,list_movilcuentas } = storeToRefs(CustomerStore());
const {form_lead} = storeToRefs(LeadStore());
const {a_updateLeadAccountData} = LeadStore();
const {scl_loading, list_facturas_movil} = storeToRefs(SCLStore());
const {a_fetchFacturasMovil} = SCLStore(); 
const visible = ref(false);
const form_movil_cliente = ref(null); 
const form_hogar_cliente = ref(null); 
const match_digital_value=ref(null)

 

const handleSelectChange = async (event) => { 
    const data= event.target.value;
    const cuenta = list_accounts.value.find((item) => item.Cuenta == data);
    //a_updateLeadAccountData(cuenta.barrio_id,cuenta.Cuenta,cuenta.Cliente.cuenta.Direccion);
    a_fetchFacturasHogar(cuenta.Cliente,cuenta.Cuenta)
    const valormatch=await a_matchDigital(cuenta.Cuenta,form_lead.value.identification_value);
    fn_calculate_matchdigital(valormatch);
}
const fn_PDFFacturasHogar = async (item) => {
  try {
    list_facturas_hogar.value.forEach((factura) => {
      if (factura.id === item.id) {
        factura.flag_descargar = true;
      }
    });
    const idvoice = item.reference;
    const modifiedIdFactura = idvoice.replace("FAC-", "").trim(); 
    
    // Get the ArrayBuffer from a_PDFFacturasHogar
    const pdfArrayBuffer = await a_PDFFacturasHogar(modifiedIdFactura);
    
    // Create a Blob from the ArrayBuffer
    const blob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });

    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `factura-hogar-${modifiedIdFactura}.pdf`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    console.error('Error downloading PDF:', error);
  } finally {
    list_facturas_hogar.value.forEach((factura) => {
      if (factura.id === item.id) {
        factura.flag_descargar = false;
      }
    });
  }
};


const fn_PDFFacturasMovil = async (item) => {
    try {
        const idvoice= item.invoiceId;
        //take off  everything left when find FAC
    const modifiedIdFactura = idvoice.split("FAC").pop().trim();
        console.log(modifiedIdFactura);
        // Get the ArrayBuffer from a_PDFFacturasHogar
        const pdfArrayBuffer = await a_PDFFacturasMovil(modifiedIdFactura);
    
    // Create a Blob from the ArrayBuffer
    const blob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });

    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `factura-movil-${modifiedIdFactura}.pdf`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    console.error('Error downloading PDF:', error);
  } finally {
    list_facturas_hogar.value.forEach((factura) => {
      if (factura.id === item.id) {
        factura.flag_descargar = false;
      }
    });
  }
};

const fn_calculate_matchdigital = (valormatch) => {
    // Calculate the new value based on the conditions
    console.log(valormatch);
    if (valormatch === 4) {
        match_digital_value.value= 0;
    } else if (valormatch === 3) {
        match_digital_value.value= 1;
    } else if (valormatch === 2) {
        match_digital_value.value= 2;
    } else if (valormatch === 1) {
        match_digital_value.value= 3;
    } else if (valormatch === 0) {
        match_digital_value.value= 4;
    }  
}
 

watch ( () => form_movil_cliente.value, async (newValue) => {
    if (newValue) { 
        await a_fetchFacturasMovil(newValue);
    }
});
</script>
