<template>
    <div class="mt-4 p-4 bg-white dark:bg-slate-700 dark:text-white shadow-lg rounded-lg">
      <div class="sm:flex sm:items-center mb-6">
        <div class="sm:flex-auto">
          <h1 class="text-lg font-semibold leading-6 text-primary-700 dark:text-primary-100">Firma Digital</h1> 
        </div>
      </div>
      <div class="mx-2 flow-root sm:mx-0"> 
        <div class="flex items-center justify-center space-x-4"> 
            <Button v-if="g_OrderIsActive" label="Firma desde Pantalla" icon="pi pi-pencil" size="small" @click="tipo_firma='canva'" />
            <Button v-if="g_OrderIsActive" label="Firma con Pad Topaz System" icon="pi pi-pencil" size="small" @click="tipo_firma='topaz'"/>
        </div>
{{ tipo_firma }}  ---
        <!-- Firma desde la pantalla -->
        <div v-if="tipo_firma=='canva'" class="mt-2">.

            <VueSignaturePad class="bg-gray-100" ref="signaturePad"/>
        </div>
 
        </div>

  
      <div class="sm:flex sm:items-center mt-10 justify-end"> 
        <Button v-if="tipo_firma=='canva'" class="ml-4" label="Limpiar Firma"  severity="danger" icon="pi pi-trash" :loading="lead_loading.store" size="small" @click="fn_erase()" />
        <Button v-if="tipo_firma=='canva'" class="ml-4" label="Guardar Firma" icon="pi pi-save" :loading="lead_loading.store" size="small" @click="storeFirmaCanva()" />
      </div>
  
      <div v-if="asignSuccess" class="mt-4 text-green-600">Firma digital guardada exitosamente!</div>
      <div v-if="signError" class="mt-4 text-red-600">Error al guardar firma digital. Por favor, intenta de nuevo.</div>
    </div>
  </template>
  
  <script setup>
  import tokenApi from '@/api/tokenApi';
  import { ref, onMounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import { LeadStore } from '@/stores/LeadStore';
  import Swal from 'sweetalert2'; 
import { OrderStore } from '@stores/OrderStore';

const {g_OrderIsActive} = storeToRefs(OrderStore());

    
  
  const { lead_loading, data_question,lead_id, lead_stage } = storeToRefs(LeadStore());
  const { a_NextQuestion, a_storeAnswer } = LeadStore();
  
  const tipo_firma = ref(null);
 
const signaturePad = ref(null);


  const fn_skip = async() => {

    const confirmResult  = await Swal.fire({
      title: '¿Estás seguro de saltar esta tarea?',
      text: 'Podrás volver a esta tarea más tarde si es necesario.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, saltar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
    });

    if (confirmResult.isConfirmed) {
      await a_storeAnswer(null);
    }
  }

  const fn_erase = async() => {

    signaturePad.value.undoSignature();
  }
  const storeFirmaCanva = async () => {
    try {

      const { isEmpty, data } = signaturePad.value.saveSignature();
      if(isEmpty){
        signError.value = true;
        return;
      }

      const payload = {
        image: data,
        answer: [
          { id: 'DigitalSigning', image: data }, 
        ],
        lead_id: lead_id.value,
        stage: lead_stage.value,
      };
      const response = await tokenApi.post(`leads/orchestration/${lead_id.value}/answer`, payload);
  
      if (response.data.success) { 
        await  a_NextQuestion()
      } else {
        signError.value = true;
      }
    } catch (error) {
      signError.value = true;
      console.error('Error sign:', error);
    }
  };
  
  const asignSuccess = ref(false);
  const signError = ref(false);



  
  </script>
  
 