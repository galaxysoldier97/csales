<template>
<div> 
    <div class="md:flex my-2">
        <!-- Primer div, ocupa la mitad del espacio disponible -->
        <div class="md:flex-1  w-full md:w-auto p-4">
            <div v-if="offer_loading.getdata">
                <Skeleton class="mb-2"></Skeleton>
                <Skeleton width="10rem" class="mb-2"></Skeleton>
                <Skeleton width="5rem" class="mb-2"></Skeleton>
                <Skeleton height="2rem" class="mb-2"></Skeleton>
                <Skeleton width="10rem" height="4rem"></Skeleton>
            </div>
            <div v-if="!offer_loading.getdata"> 
                <div class="w-full">
                <div class="text-md font-medium leading-6 text-gray-700 dark:text-primary-100">Descripción de la Oferta</div>
                <div class="p-1 bg-gray-50 dark:bg-slate-700 text-sm leading-6 text-gray-700 dark:text-white sm:mt-2 border-t border-b border-gray-300">{{ data_offer.description }}</div>
                </div> 


                <div class="w-full mt-4">
                    <div class="text-md font-medium leading-6 text-gray-700 dark:text-primary-100">Precio</div>
                    <div class="bg-gray-50 dark:bg-slate-700 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t border-b border-gray-300">
                        <dt class="text-sm font-medium text-gray-700 dark:text-white">Precio Regular</dt>
                        <dd class="mt-1 text-sm leading-6 text-gray-700 dark:text-white sm:col-span-2 sm:mt-0 ml-auto mr-2">{{ computed_format(data_offer.price) }}</dd>
                    </div>
                    <div v-if="['3', '4','6' ].includes(data_offer.clasification) " class="bg-gray-50 dark:bg-slate-700 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-300">
                        <dt class="text-sm font-medium text-gray-700 dark:text-white">Descuento</dt>
                        <dd class="mt-1 text-sm leading-6 text-gray-700 dark:text-white sm:col-span-2 sm:mt-0 ml-auto mr-2">{{ computed_format(data_offer.discount) }}</dd>
                    </div> 
                 
                </div> 
                <div class="w-full mt-4" v-if="['1', '7','8'].includes(data_offer.clasification) ">
                <div class="text-md font-medium leading-6 text-gray-700 dark:text-primary-100">Exoneraciones</div>
                <div class="bg-gray-50 dark:bg-slate-700 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t border-b border-gray-300">
                    <dt class="text-sm font-medium text-gray-700 dark:text-primary-100">Depósito</dt>
                    <dd class="mt-1 text-sm leading-6 text-gray-700 dark:text-primary-100 sm:col-span-2 sm:mt-0 ml-auto mr-2">{{data_offer.exodeposito === '1' ? 'SI' : 'NO'}}</dd>
                </div>
                <div class="bg-gray-50 dark:bg-slate-700 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-300">
                    <dt class="text-sm font-medium text-gray-700 dark:text-primary-100">Instalación</dt>
                    <dd class="mt-1 text-sm leading-6 text-gray-700 dark:text-primary-100 sm:col-span-2 sm:mt-0 ml-auto mr-2">{{data_offer.exoinstalacion === '1' ? 'SI' : 'NO'}}</dd>
                </div>
                </div>


                <div class="w-full mt-4">
                <div class="text-md font-medium leading-6 text-gray-700 dark:text-primary-100">Pago Anticipado</div>
                <div class="bg-gray-50 dark:bg-slate-700 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t border-b border-gray-300">
                    <dt class="text-sm font-medium text-gray-700 dark:text-white">Depósito</dt>
                    <dd class="mt-1 text-sm leading-6 text-gray-700 dark:text-white sm:col-span-2 sm:mt-0 ml-auto mr-2">{{data_offer.anticipado_deposito === '1' ? 'SI' : 'NO'}}</dd>
                </div>
                <div class="bg-gray-50 dark:bg-slate-700 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-300">
                    <dt class="text-sm font-medium text-gray-700 dark:text-white">Instalación</dt>
                    <dd class="mt-1 text-sm leading-6 text-gray-700 dark:text-white sm:col-span-2 sm:mt-0 ml-auto mr-2">{{data_offer.anticipado_instalacion === '1' ? 'SI' : 'NO'}}</dd>
                </div>
                <div class="bg-gray-50 dark:bg-slate-700 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-300">
                    <dt class="text-sm font-medium text-gray-700 dark:text-white">Mensualidad</dt>
                    <dd class="mt-1 text-sm leading-6 text-gray-700 dark:text-white sm:col-span-2 sm:mt-0 ml-auto mr-2">{{data_offer.anticipado_mensualidad === '1' ? 'SI' : 'NO'}}</dd>
                </div>
                </div> 

                </div>
        </div>
        <!-- Línea divisoria gris vertical -->
        <div class="w-px bg-gray-300"></div>
        <!-- Segundo div, ocupa la mitad del espacio disponible -->
        <div class="md:flex-1  w-full md:w-auto p-4">
            <div v-if="offer_loading.getdata">
                <Skeleton class="mb-2"></Skeleton>
                <Skeleton width="10rem" class="mb-2"></Skeleton>
                <Skeleton width="5rem" class="mb-2"></Skeleton>
                <Skeleton height="2rem" class="mb-2"></Skeleton>
                <Skeleton width="10rem" height="4rem"></Skeleton>
            </div>
            
            <table v-if="!offer_loading.getdata &data_offer.benefits.length>0" class="min-w-full bg-white dark:bg-slate-700 dark:text-white border border-gray-300">
            <thead>
                <tr class="bg-gray-100 dark:bg-slate-700 dark:text-white"> 
                    <th class="py-2 px-4 border-b" colspan="2">Beneficios</th> 
                </tr>
            </thead>
            <tbody>  
                <tr v-for="item in data_offer.benefits" :key="item.id" class="hover:bg-gray-50">
                    
                    <td class="py-2 px-4 border-b">
                        <label class="font-bold" v-if="item.service=='home_benefits'">Hogar</label>
                        <label class="font-bold" v-if="mov_benefits">Movil</label>
                    </td>
                    <td class="py-2 px-4 border-b">{{ item.name }}</td>
                   
                </tr> 
            </tbody>
            </table>
            <table v-if="!offer_loading.getdata" class="min-w-full bg-white dark:bg-slate-700 dark:text-white border border-gray-300">
            <thead>
                <tr class="bg-gray-100 dark:bg-slate-700 dark:text-white">
                    <td class="py-2 px-4 border-b"></td>
                    <th class="py-2 px-4 border-b">Valores Agregados</th>
                    <th class="py-2 px-4 border-b">Precio</th>
                    <th class="py-2 px-4 border-b">Cantidad</th>
                </tr>
            </thead>
            <tbody> 
                <tr v-if="!data_offer.vas || data_offer.vas.length == 0" class="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td class="py-2 px-4 border-b" colspan="4"><Message :closable="false" >No hay valores agregados disponibles</Message></td>
                </tr>
                <tr v-for="item in data_offer.vas" :key="item.id" class="hover:bg-gray-50">
                    
                    <td class="py-2 px-4 border-b"><input type="checkbox" v-model="item.checked" class="form-checkbox text-primary-600"></td>
                    <td class="py-2 px-4 border-b">
                        {{ item.name }} <span v-if="item.service">({{ item.service }})</span> 
                        <div v-if="item.discount_selected" class="text-xs text-gray-500 dark:text-primary-100">
                            <ul>
                                <li v-for="discount in item.discount_selected" :key="discount.id">
                                    - {{ discount.name }}: {{ computed_format(discount.price) }}
                                </li>
                            </ul>
                        </div>
                    </td>
                    <td class="py-2 px-4 border-b">{{ computed_format(item.price) }}</td>
                    <td class="py-2 px-4 border-b">
                        <input v-if="item.checked && item.max_quantity > 1" type="number" v-model="item.quantity" min="1" :max="item.max_quantity" class="w-16 border border-gray-300 rounded-md p-1">
                    </td>
                </tr> 
            </tbody>
            </table>
        </div>
    </div>

    <PanelDescuentosPermanente :data_offer="data_offer" />

    <PanelDescuentosTemporales :data_offer="data_offer" />

</div>
</template>



<script setup>

import { ref, onMounted,computed } from 'vue';
import { storeToRefs } from 'pinia';  
import { OfferStore } from '@stores/OfferStore';   
const { offer_loading,g_total_price } =storeToRefs(OfferStore());

import PanelDescuentosPermanente from './PanelDescuentosPermanente.vue';
import PanelDescuentosTemporales from './PanelDescuentosTemporales.vue';
 
const props = defineProps({
    data_offer: Object
});


const computed_format = (value) => {
        return new Intl.NumberFormat('es-PA', { style: 'currency', currency: 'PAB' }).format(value);
    }; 
 
</script>