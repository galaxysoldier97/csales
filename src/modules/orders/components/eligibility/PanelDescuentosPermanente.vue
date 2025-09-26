<template>
    <div v-if="data_descuentos_permanentes && data_descuentos_permanentes.length > 0">

        <div @click="mostrarListado" class="flex justify-between items-center bg-gray-50 text-sm text-gray-700 p-4 rounded shadow cursor-pointer :hover:bg-gray-300">
            <div class="flex items-center">
                <Bars3Icon class="h-6 w-6 mr-2" aria-hidden="true" />
                <span class="font-medium">Descuentos Permanentes</span>    
            </div>
             
            <span class="font-semibold">{{ computed_format(data_descuentos_permanentes.reduce((acc, d) => acc + Number(d.price), 0) + data_offer.planes.filter(p => p.desc_bundle < 0).reduce((acc, p) => acc + Number(p.desc_bundle), 0)) }}</span>
        </div> 
            <div v-if="mostrar" class="b-1 border-gray-50 bg-white dark:bg-slate-800 dark:text-white shadow-lg">
                <div class="px-4 sm:px-6 lg:px-8 flow-root">  
                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table class="min-w-full divide-y divide-gray-300">
                        <thead>
                        <tr>
                            <th scope="col" class="py-1 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Nombre</th>
                            <th scope="col" class="px-3 py-1 text-left text-sm font-semibold text-gray-900">Descuento</th>
                            <th scope="col" class="px-3 py-1 text-left text-sm font-semibold text-gray-900">Duración del descuento</th> 
                        </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                        <tr v-for="item in data_descuentos_permanentes" :key="item.offeritem_id">
                            <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{{ item.block_name }}</td>
                            <td class="whitespace-nowrap px-3 py-2 text-sm text-gray-500">{{ computed_format(item.price) }}</td>
                            <td class="whitespace-nowrap px-3 py-2 text-sm text-gray-500">{{ item.duration }}</td>
                        </tr>
                        
                        <tr v-for="item in data_offer.planes.filter(p => p.desc_bundle < 0)" :key="item.id">
                            <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">Promo Paquete {{ item.type }}</td>
                            <td class="whitespace-nowrap px-3 py-2 text-sm text-gray-500">{{ computed_format(item.desc_bundle) }}</td>
                            <td class="whitespace-nowrap px-3 py-2 text-sm text-gray-500">Permanente</td>
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

const data_descuentos_permanentes =  ref(props.data_offer.discounts.filter(d => d.duration == 'Permanente'));

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