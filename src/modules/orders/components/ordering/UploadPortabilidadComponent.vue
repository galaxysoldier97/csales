<template>
    <div class="mt-4 p-4 bg-white dark:bg-slate-700 dark:text-white shadow-lg rounded-lg">
      <div class="sm:flex sm:items-center mb-6">
        <div class="sm:flex-auto">
          <h1 class="text-lg font-semibold leading-6 text-primary-700 dark:text-primary-100">Adjuntar Documentos</h1>
          <p class="mt-2 text-sm text-gray-700 dark:text-white">Sube tus documentos en las siguientes categorías:</p>
        </div>
      </div>
  
      <div class="flex items-center justify-center space-x-4">
          <div  
          class="w-1/3 p-6 bg-white dark:bg-slate-700 dark:text-white rounded-lg shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow duration-300 border-2 border-dashed border-gray-300">
            <div class="mb-3">
              <!-- Ícono de ejemplo, puedes reemplazarlo con el que prefieras -->
              <svg class="h-10 w-10 text-gray-500" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 7V17C3.5 18.1046 4.39543 19 5.5 19H19.5C20.6046 19 21.5 18.1046 21.5 17V7C21.5 5.89543 20.6046 5 19.5 5H5.5C4.39543 5 3.5 5.89543 3.5 7Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M15.5 10H18.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15.5 13H18.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 10C11.5 11.1046 10.6046 12 9.5 12C8.39543 12 7.5 11.1046 7.5 10C7.5 8.89543 8.39543 8 9.5 8C10.0304 8 10.5391 8.21071 10.9142 8.58579C11.2893 8.96086 11.5 9.46957 11.5 10Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M5.5 16C8.283 12.863 11.552 13.849 13.5 16" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
            </div>
            <label class="text-gray-700 font-semibold mb-3 dark:text-white dark:bg-slate-700">Identificación</label>
            <input type="file" @change="onFileChange($event, 'CED')" class="mb-3 text-sm border border-gray-300 rounded-lg p-2 w-full" />
            <img v-if="previews.CED" :src="previews.CED" alt="Preview" class="w-full h-36 object-cover rounded-lg mb-3 shadow-inner" />
          </div>
  
          <div  
          class="w-1/3 p-6 bg-white dark:bg-slate-700 dark:text-white rounded-lg shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow duration-300 border-2 border-dashed border-gray-300">
            <div class="mb-3">
              <!-- Ícono de ejemplo, puedes reemplazarlo con el que prefieras -->
              <svg class="h-10 w-10 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 11V15.8C21 16.9201 21 17.4802 20.782 17.908C20.5903 18.2843 20.2843 18.5903 19.908 18.782C19.4802 19 18.9201 19 17.8 19H6.2C5.0799 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2C3 7.0799 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.0799 5 6.2 5H15M21 11L15 5M21 11H16.6C16.0399 11 15.7599 11 15.546 10.891C15.3578 10.7951 15.2049 10.6422 15.109 10.454C15 10.2401 15 9.96005 15 9.4V5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </div>
            <label class="text-gray-700 font-semibold mb-3 dark:text-white dark:bg-slate-700">Estado de Cuenta</label>
            <input type="file" @change="onFileChange($event, 'COMPE')" class="mb-3 text-sm border border-gray-300 rounded-lg p-2 w-full" />
            <img v-if="previews.COMPE" :src="previews.COMPE" alt="Preview" class="w-full h-36 object-cover rounded-lg mb-3 shadow-inner" />
          </div>

          
          <div  
          class="w-1/3 p-6 bg-white dark:bg-slate-700 dark:text-white rounded-lg shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow duration-300 border-2 border-dashed border-gray-300">
            <div class="mb-3">
              <!-- Ícono de ejemplo, puedes reemplazarlo con el que prefieras -->
              <svg class="h-10 w-10 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 11V15.8C21 16.9201 21 17.4802 20.782 17.908C20.5903 18.2843 20.2843 18.5903 19.908 18.782C19.4802 19 18.9201 19 17.8 19H6.2C5.0799 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2C3 7.0799 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.0799 5 6.2 5H15M21 11L15 5M21 11H16.6C16.0399 11 15.7599 11 15.546 10.891C15.3578 10.7951 15.2049 10.6422 15.109 10.454C15 10.2401 15 9.96005 15 9.4V5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </div>
            <label class="text-gray-700 font-semibold mb-3 dark:text-white dark:bg-slate-700">Formulario de Portabilidad</label>
            <input type="file" @change="onFileChange($event, 'PostPago')" class="mb-3 text-sm border border-gray-300 rounded-lg p-2 w-full" />
            <img v-if="previews.PostPago" :src="previews.PostPago" alt="Preview" class="w-full h-36 object-cover rounded-lg mb-3 shadow-inner" />
          </div>
      </div> 
 

  
      <div class="sm:flex sm:items-center mt-10 justify-end"> 
         <Button v-if="g_OrderIsActive" class="ml-4" label="Enviar" icon="pi pi-save" :loading="loading" size="small" @click="fnEnviarPortab" />
      </div>
  
      <div v-if="uploadSuccess" class="mt-4 text-green-600">Archivos subidos exitosamente!</div>
      <div v-if="uploadError" class="mt-4 text-red-600">{{ message_error }}</div>
    </div>
  </template>
<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { OrderStore } from '@/stores/OrderStore';

const { g_OrderIsActive } = storeToRefs(OrderStore());
const { a_sendPortabilidad } = OrderStore();

const message_error = ref('');
const loading = ref(false);
const previews = ref({
  CED: null,
  PostPago: null,
  COMPE: null,
});

const payload2 = ref([]);
const selectedFiles = ref({
  CED: null,
  PostPago: null,
  COMPE: null,
});

const onFileChange = (event, id) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    if (file.type.startsWith('image/')) {
      console.log("IMAGE")
      // Convert image files to base64
      reader.readAsDataURL(file);
      reader.onload = () => {
        previews.value[id] = reader.result;
        selectedFiles.value[id] = reader.result;
      };
    } else if (file.type === 'application/pdf') {
      console.log("PDF")
      // For PDF, store the raw binary
      reader.readAsDataURL(file);
      reader.onload = () => {
        selectedFiles.value[id] = reader.result;
      };
    }
  }
};

const fnEnviarPortab = async () => {
  try {
    let payload = [];
    loading.value = true;

    // Prepare the payload based on file type (base64 for images, raw file for PDFs)
    Object.keys(selectedFiles.value).forEach(id => {
      const file = selectedFiles.value[id];
      if (file) {
        payload.push({
          id,
          image: file, // image can be base64 or binary depending on the type
        });
      }
    });
    payload2.value = payload;
    const { ok } = await a_sendPortabilidad(payload);
    if (ok) {
      uploadSuccess.value = true;
      uploadError.value = false;
    } else {
      uploadSuccess.value = false;
      uploadError.value = true;
      message_error.value = 'Error al subir los archivos';
    }
  } catch (error) {
    console.log(error);
    uploadSuccess.value = false;
    uploadError.value = true;
    message_error.value = 'Error al subir los archivos';
  }
  loading.value = false;
};

const uploadSuccess = ref(false);
const uploadError = ref(false);
</script>
