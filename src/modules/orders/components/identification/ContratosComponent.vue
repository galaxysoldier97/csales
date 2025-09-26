<template>
    <div class="mt-2 w-full border-2 bg-white dark:bg-slate-800 dark:text-white border-gray-100 shadow-lg rounded-lg p-6"  > 
    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2 lg:grid-cols-4 lg:gap-4">
        <div class="border border-gray-300 rounded-lg overflow-hidden shadow-lg"   v-if="form_lead.account_id" >
            <h2 class="font-bold p-4 bg-primary-700 text-white w-full text-center" >TV</h2>
            <div class="p-2 bg-white dark:bg-slate-800">
                <div v-if="account_loading.contracts"> 
                  <Skeleton class="mb-2" borderRadius="2rem"></Skeleton>
                  <Skeleton width="10rem" class="mb-2" borderRadius="2rem"></Skeleton>
                  <Skeleton width="5rem" borderRadius="2rem" class="mb-2"></Skeleton>
                  <Skeleton height="2rem" class="mb-2" borderRadius="2rem"></Skeleton>
                  <Skeleton width="10rem" height="4rem" borderRadius="2rem"></Skeleton>
                </div>  
                <Message :closable="false" severity="info" v-if="!account_loading.contracts && list_TVcontracts.length == 0">No se encontraron contratos de TV</Message>
                <div v-if="!account_loading.contracts && list_TVcontracts && list_TVcontracts.length>0">
                    <div class="mb-4">
                        <p  v-for="itemTV in list_TVcontracts" :key="itemTV.id" class="font-semibold text-md">- {{ itemTV.plan }}</p>
                    </div>
                    <ul class="space-y-2" v-for="itemTV in list_TVcontracts" :key="itemTV.id">
                        <li v-for="(item, index) in itemTV.childProducts" :key="index"> 
                            <button @click="item.showSublist = !item.showSublist"
                            class="flex items-center w-full text-left p-2 rounded-lg" :class="{'border ay-100 focus:outl focus:outline-none focus:ring-2 focus:ring-primary-100 hover:bg-gray-100 dark:bg-slate-800 dark:text-white': item.childProducts.length > 0}">
                                <svg v-if="!item.showSublist && item.childProducts.length > 0" class="w-6 h-6 text-primary-100" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                </svg>
                                <svg v-if="item.showSublist && item.childProducts.length > 0" class="w-6 h-6 text-primary-100" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 13H5v-2h14v2z"/>
                                </svg>
                                <svg v-if="item.childProducts.length == 0" class="w-6 h-6 text-primary-100" fill="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="5"/>
                                </svg>
                                <label class="ml-2">{{ item.name }} <span v-if="item.cantidad>1">({{ item.cantidad }})</span></label>
                            </button>
                            <ul v-if="item.showSublist" class="ml-8 mt-2 space-y-2 list-disc text-primary-100"> 
                                <li v-for="(subitem, subindex) in item.childProducts" :key="subindex" >
                                    <label class="text-gray-700 text-sm"> {{ subitem.name }} <span v-if="subitem.cantidad>1">({{ subitem.cantidad }})</span></label>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="border border-gray-300 rounded-lg overflow-hidden shadow-lg" v-if="form_lead.account_id" > 
            <h2 class="font-bold p-4 bg-primary-700 text-white w-full text-center" >INTERNET</h2>
            <div class="p-2 bg-white dark:bg-slate-800"> 
                <div v-if="account_loading.contracts"> 
                  <Skeleton class="mb-2" borderRadius="2rem"></Skeleton>
                  <Skeleton width="10rem" class="mb-2" borderRadius="2rem"></Skeleton>
                  <Skeleton width="5rem" borderRadius="2rem" class="mb-2"></Skeleton>
                  <Skeleton height="2rem" class="mb-2" borderRadius="2rem"></Skeleton>
                  <Skeleton width="10rem" height="4rem" borderRadius="2rem"></Skeleton>
                </div> 
                
                <Message :closable="false" severity="info" v-if="!account_loading.contracts && list_INTcontracts.length == 0">No se encontraron contratos de Internet</Message>
                
                <div v-if="!account_loading.contracts && list_INTcontracts &&  list_INTcontracts.length > 0">
                    <div class="mb-4">
                        <p  v-for="itemINT in list_INTcontracts" :key="itemINT.id" class="font-semibold text-md">- {{ itemINT.plan }}</p>
                    </div>
                    <ul class="space-y-2" v-for="itemINT in list_INTcontracts" :key="itemINT.id">
                        <li v-for="(item, index) in itemINT.childProducts" :key="index"> 
                            <button @click="item.showSublist = !item.showSublist"
                            class="flex items-center w-full text-left p-2 rounded-lg" :class="{'border ay-100 focus:outl focus:outline-none focus:ring-2 focus:ring-primary-100 hover:bg-gray-100 dark:bg-slate-800 dark:text-white': item.childProducts.length > 0}">
                                <svg v-if="!item.showSublist && item.childProducts.length > 0" class="w-6 h-6 text-primary-100" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                </svg>
                                <svg v-if="item.showSublist && item.childProducts.length > 0" class="w-6 h-6 text-primary-100" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 13H5v-2h14v2z"/>
                                </svg>
                                <svg v-if="item.childProducts.length == 0" class="w-6 h-6 text-primary-100" fill="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="5"/>
                                </svg>
                                <label class="ml-2">{{ item.name }} <span v-if="item.cantidad>1">({{ item.cantidad }})</span></label>
                            </button>
                            <ul v-if="item.showSublist" class="ml-8 mt-2 space-y-2 list-disc text-primary-100"> 
                                <li v-for="(subitem, subindex) in item.childProducts" :key="subindex" >
                                    <label class="text-gray-700 text-sm"> {{ subitem.name }} <span v-if="subitem.cantidad>1">({{ subitem.cantidad }})</span></label>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="border border-gray-300 rounded-lg overflow-hidden shadow-lg" v-if="form_lead.account_id" > 
            <h2 class="font-bold p-4 bg-primary-700 text-white w-full text-center" >TELEFONÍA</h2>
            <div class="p-2 bg-white dark:bg-slate-800">
                <div v-if="account_loading.contracts"> 
                  <Skeleton class="mb-2" borderRadius="2rem"></Skeleton>
                  <Skeleton width="10rem" class="mb-2" borderRadius="2rem"></Skeleton>
                  <Skeleton width="5rem" borderRadius="2rem" class="mb-2"></Skeleton>
                  <Skeleton height="2rem" class="mb-2" borderRadius="2rem"></Skeleton>
                  <Skeleton width="10rem" height="4rem" borderRadius="2rem"></Skeleton>
                </div>  

                <Message :closable="false" severity="info" v-if="!account_loading.contracts && list_TELcontracts.length == 0">No se encontraron contratos de Telefonía</Message>
                <div v-if="!account_loading.contracts && list_TELcontracts &&  list_TELcontracts.length > 0">
                    <div class="mb-4">
                        <div  v-for="itemTEL in list_TELcontracts" :key="itemTEL.id">
                            <p  v-for="item in itemTEL.childProducts" :key="item.id" class="font-semibold text-md">- {{ item.plan }}</p>
                        </div>
                         
                    </div>
                    <ul class="space-y-2" v-for="itemTEL in list_TELcontracts" :key="itemTEL.id">
                        <li v-for="(item, index) in itemTEL.childProducts" :key="index"> 
                            <button @click="item.showSublist = !item.showSublist"
                            class="flex items-center w-full text-left p-2 rounded-lg" :class="{'border ay-100 focus:outl focus:outline-none focus:ring-2 focus:ring-primary-100 hover:bg-gray-100 dark:bg-slate-800 dark:text-white': item.childProducts.length > 0}">
                                <svg v-if="!item.showSublist && item.childProducts.length > 0" class="w-6 h-6 text-primary-100" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                </svg>
                                <svg v-if="item.showSublist && item.childProducts.length > 0" class="w-6 h-6 text-primary-100" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 13H5v-2h14v2z"/>
                                </svg>
                                <svg v-if="item.childProducts.length == 0" class="w-6 h-6 text-primary-100" fill="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="5"/>
                                </svg>
                                <label class="ml-2">{{ item.name }} <span v-if="item.cantidad>1">({{ item.cantidad }})</span></label>
                            </button>
                            <ul v-if="item.showSublist" class="ml-8 mt-2 space-y-2 list-disc text-primary-100"> 
                                <li v-for="(subitem, subindex) in item.childProducts" :key="subindex" >
                                    <label class="text-gray-700 text-sm"> {{ subitem.name }} <span v-if="subitem.cantidad>1">({{ subitem.cantidad }})</span></label>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="border border-gray-300 rounded-lg overflow-hidden shadow-lg" v-if="list_phones && list_phones.length > 0">
            <h2 class="font-bold p-4 bg-primary-700 text-white w-full text-center">MOVIL</h2>
            <div class="p-2 bg-white dark:bg-slate-800">
                <div v-if="account_loading.phones_plans"> 
                  <Skeleton class="mb-2" borderRadius="2rem"></Skeleton>
                  <Skeleton width="10rem" class="mb-2" borderRadius="2rem"></Skeleton>
                  <Skeleton width="5rem" borderRadius="2rem" class="mb-2"></Skeleton>
                  <Skeleton height="2rem" class="mb-2" borderRadius="2rem"></Skeleton>
                  <Skeleton width="10rem" height="4rem" borderRadius="2rem"></Skeleton>
                </div>
                <div class="mb-4" v-if="!account_loading.phones_plans">
                    <select v-model="phoneselected" class="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white" v-if="list_phones" >
                        <option v-for="(item, index) in list_phones" :key="index" :value="item.celular">{{ item.celular }}</option>
                    </select>
                </div> 
                <div class="max-w-md mx-auto bg-white dark:bg-slate-800 dark:text-white rounded-lg border border-gray-200 shadow-md p-4" v-if="!account_loading.phones_plans && phoneselected && list_phones.find(phone => phone.celular == phoneselected)">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-md font-semibold text-gray-800 dark:text-primary-100"> {{list_phones.find(phone => phone.celular == phoneselected).celular}}</h2>
                        <span class="px-3 py-1 text-sm font-semibold text-primary-700 dark:text-primary-700 bg-white rounded-full border border-primary-100 dark:border-primary-100">{{list_phones.find(phone => phone.celular == phoneselected).Tipo}}</span>
                    </div>
                    <div class="" v-if="list_phones.find(phone => phone.celular == phoneselected)"> 
                         
                        <p class="text-sm text-gray-600 dark:text-white"><strong>Personalizado:  </strong> 
                            <span v-if="list_phones.find(phone => phone.celular == phoneselected).personalizado == 'Y'"> <strong>SI</strong></span>
                            <span v-else><strong>NO</strong></span>
                        </p>
                    </div>
                    <div  v-if="list_phones.find(phone => phone.celular == phoneselected && phone.Tipo.toLowerCase() == 'prepago')"> 
                         
                        <p class="text-sm text-gray-600 dark:text-white"><strong>Apto Pre a Pos:  </strong> 
                            <span v-if="list_phones.find(phone => phone.celular == phoneselected).apto_pre2pos == 'Y'"> <strong>SI</strong></span>
                            <span v-else><strong>NO</strong></span>
                        </p>
                    </div>
                    <div class="mt-2" v-if="list_phones.find(phone => phone.celular == phoneselected).contracts"> 
                        <fieldset class="border-t border-solid border-gray-300 rounded p-1">
                            <legend class="text-sm">Cliente:</legend>
                            <p v-if="list_phones.find(phone => phone.celular == phoneselected).data_cliente.codCiclo" class="text-sm text-gray-600 dark:text-white"><strong>Ciclo:</strong> {{list_phones.find(phone => phone.celular == phoneselected).data_cliente.codCiclo}}</p> 
                            <p v-if="list_phones.find(phone => phone.celular == phoneselected).data_cliente.codCategoria" class="text-sm text-gray-600 dark:text-white"><strong>Categoria:</strong> {{list_phones.find(phone => phone.celular == phoneselected).data_cliente.codCategoria}}</p> 
                            <p v-if="list_phones.find(phone => phone.celular == phoneselected).data_cliente.cantAbonActivo" class="text-sm text-gray-600 dark:text-white"><strong>Cant Líneas Activas:</strong> {{list_phones.find(phone => phone.celular == phoneselected).data_cliente.cantAbonActivo}}</p> 
                        
                        </fieldset>

                        <fieldset class="border-t border-solid border-gray-300 rounded p-1">
                            <legend class="text-sm">Abonado:</legend>
                            <p class="text-sm text-gray-600 dark:text-white"><strong>Cliente:</strong> {{list_phones.find(phone => phone.celular == phoneselected).contracts.codCliente}}</p> 
                            <p v-if="list_phones.find(phone => phone.celular == phoneselected).contracts.codplantarif" class="text-sm text-gray-600 dark:text-white"><strong>Plan:</strong> {{list_phones.find(phone => phone.celular == phoneselected).contracts.codplantarif}}</p>
                            <p v-if="list_phones.find(phone => phone.celular == phoneselected).contracts.fecAlta" class="text-sm text-gray-600 dark:text-white"><strong>Alta:</strong> {{ moment(list_phones.find(phone => phone.celular == phoneselected).contracts.fecAlta).format('DD/MM/YYYY') }}</p>
                            <p v-if="list_phones.find(phone => phone.celular == phoneselected).contracts.fecFinContrato" class="text-sm text-gray-600 dark:text-white"><strong>Baja:</strong> {{ moment(list_phones.find(phone => phone.celular == phoneselected).contracts.fecFinContrato).format('DD/MM/YYYY') }}</p>
                        </fieldset> 

                    </div>

                    <!-- button detalle modal -->
                    <Button   label="Detalle del Servicio" size="small"  @click="fn_showDetail(phoneselected)" class="mt-2 flex justify-center" />
                </div>
                 
            </div>
        </div>
</div>

<!-- Modal para mostrar detalle del servicio -->
<ModalContratosComponent 
    v-model:show="showModal" 
    :phoneNumber="selectedPhoneForModal" 
/>

</div>
</template>

<script setup>
import { ref,onMounted,watch } from "vue"; 
import { storeToRefs } from 'pinia';
import { CustomerStore } from "@/stores/CustomerStore";
import { LeadStore} from "@/stores/LeadStore";
import { MobileStore } from "@/stores/MobileStore";
import ModalContratosComponent from './ModalContratosComponent.vue';
import moment from "moment";

    const phoneselected= ref(null);
    const showModal = ref(false);
    const selectedPhoneForModal = ref(null);
    const { list_phones , list_TVcontracts,list_TELcontracts, list_INTcontracts, account_loading } = storeToRefs(CustomerStore());
    const { form_lead } = storeToRefs(LeadStore());
    const mobileStore = MobileStore();

    // Función para mostrar el modal con el detalle del servicio
    const fn_showDetail = async (phoneNumber) => {
        selectedPhoneForModal.value = phoneNumber;
        showModal.value = true;
        
        // Buscar el teléfono seleccionado para obtener el numAbonado
        const selectedPhone = list_phones.value.find(phone => phone.celular === phoneNumber);
        
        if (selectedPhone && selectedPhone.contracts?.numAbonado) {
            const numAbonado = selectedPhone.contracts.numAbonado;
            const codCliente = selectedPhone.contracts.codCliente;
            
            try {
                // Llamar a todos los actions del MobileStore con el numAbonado
                const results = await mobileStore.a_loadAllMobileData(numAbonado, codCliente);

                if (results.ok) {
                    // Agregar los datos del MobileStore al teléfono en list_phones
                    const phoneIndex = list_phones.value.findIndex(phone => phone.celular === phoneNumber);
                    if (phoneIndex !== -1) {
                        list_phones.value[phoneIndex] = {
                            ...list_phones.value[phoneIndex],
                            mobileData: {
                                deviceInfo: mobileStore.data_mobile.deviceInfo,
                                customerInfo: mobileStore.data_mobile.customerInfo,
                                installmentsStatus: mobileStore.data_mobile.installmentsStatus,
                                bpt: {
                                    beneficiarios: mobileStore.data_mobile.bpt.beneficiarios,
                                    beneficios: mobileStore.data_mobile.bpt.beneficios
                                }
                            }
                        };
                    }
                } else {
                    console.error('Error al cargar datos móviles:', results.message);
                }
            } catch (error) {
                console.error('Error al obtener detalles del servicio móvil:', error);
            }
        } else {
            console.warn('No se encontró numAbonado para el teléfono:', phoneNumber);
        }
    };

    const toggleSublistTV = (index) => {
       list_TVcontracts.value.foreach((item) => {
           item.childProducts.foreach((child) => {
               child.showSublist = false;
           });
       });
    }


    const toggleSublistTEL = (index) => {
        list_TELcontracts.value.childProducts[index].showSublist = !list_TELcontracts.value.childProducts[index].showSublist
    }


    const toggleSublistINT = (index) => {
        list_INTcontracts.value.childProducts[index].showSublist = !list_INTcontracts.value.childProducts[index].showSublist
    }

    watch(list_phones, () => {
        if (list_phones.value && list_phones.value.length > 0) {
            phoneselected.value = list_phones.value[0].celular;
        }
    });
    
    
</script>