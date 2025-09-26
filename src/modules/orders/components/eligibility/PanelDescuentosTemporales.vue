<template>
    <div class="mt-2" v-if="data_descuentos_temporales && data_descuentos_temporales.length > 0"> 
        <div @click="mostrarListado" class="flex justify-between items-center bg-gray-50 text-sm text-gray-700 p-4 rounded shadow cursor-pointer :hover:bg-gray-300 dark:bg-slate-700 dark:text-white">
            <div class="flex items-center">
                <Bars3Icon class="h-6 w-6 mr-2" aria-hidden="true" />
                <span class="font-medium">Descuentos Temporales</span>    
            </div>
             
            <span class="font-semibold">{{ computed_format(data_descuentos_temporales.reduce((acc, d) => acc + Number(d.price), 0) ) }}</span>
        </div> 
            <div v-if="mostrar" class="b-1 border-gray-50 bg-white dark:bg-slate-700 dark:text-white shadow-lg">
                <div class="px-4 sm:px-6 lg:px-8 flow-root">  
                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table class="min-w-full divide-y divide-gray-300">
                        <thead>
                        <tr>
                            <th scope="col" class="py-1 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 dark:text-primary-100">Nombre</th>
                            <th scope="col" class="px-3 py-1 text-left text-sm font-semibold text-gray-900 dark:text-primary-100">Descuento</th>
                            <th scope="col" class="px-3 py-1 text-left text-sm font-semibold text-gray-900 dark:text-primary-100">Duración del descuento</th> 
                        </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 dark:bg-slate-700 dark:text-white">
                        <tr v-for="item in data_descuentos_temporales" :key="item.offeritem_id">
                            <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0 dark:bg-slate-700 dark:text-white">{{ item.block_name }}</td>
                            <td v-if="item.prop_1==1" class="whitespace-nowrap px-3 py-2 text-sm text-gray-500 dark:bg-slate-700 dark:text-white">% {{  item.price }}</td>
                            <td v-else-if="item.prop_1!=1" class="whitespace-nowrap px-3 py-2 text-sm text-gray-500 dark:bg-slate-700 dark:text-white">{{ computed_format(item.price) }}</td>
                            <td class="whitespace-nowrap px-3 py-2 text-sm text-gray-500 dark:bg-slate-700 dark:text-white">{{ item.duration }}</td>
                        </tr>
                         
                        </tbody>
                    </table>
                    </div>
                </div> 
                </div>
            </div> 
    </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  AdjustmentsHorizontalIcon,
  Bars3Icon,  
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon, 
} from '@heroicons/vue/24/outline' 
 

const computed_format = (value) => {
        return new Intl.NumberFormat('es-PA', { style: 'currency', currency: 'PAB' }).format(value);
    }; 


const props = defineProps({
    data_offer: Object
});

const data_descuentos_temporales = ref(props.data_offer.discounts.filter(d => d.duration != 'Permanente' && (d.producttype_id ==1 || d.producttype_id==2)));
const mostrar = ref(false);
const monto = ref(0);

function mostrarListado() {
    mostrar.value = !mostrar.value;
    // Lógica para obtener el listado de descuentos y actualizar el monto
}
</script>
 


<style>
/* Clases para la animación de escala y desvanecimiento */
.scale-fade-enter-active, .scale-fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.scale-fade-enter, .scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.95); /* Ajusta este valor según prefieras */
}
</style>