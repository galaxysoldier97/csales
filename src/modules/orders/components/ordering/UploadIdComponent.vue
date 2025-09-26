<template>
    <div class="mt-4 p-4 bg-white dark:bg-slate-700 dark:text-white shadow-lg rounded-lg">
      <div class="sm:flex sm:items-center mb-6">
        <div class="sm:flex-auto">
          <h1 class="text-lg font-semibold leading-6 text-primary-700 dark:text-primary-100">Adjuntar Documentos</h1>
          <p class="mt-2 text-sm text-gray-700 dark:text-white">Sube tus documentos en las siguientes categorías:</p>
        </div>
      </div>
  
      <div class="flex items-center justify-center space-x-4">
          <div v-if="data_question.data.answer.options.includes('CED')"
          class="w-full md:w-1/3 p-6 bg-white dark:bg-slate-700 dark:text-white rounded-lg shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow duration-300 border-2 border-dashed border-gray-300">
            <div class="mb-3">
              <!-- Ícono de ejemplo, puedes reemplazarlo con el que prefieras -->
              <svg class="h-10 w-10 text-gray-500" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 7V17C3.5 18.1046 4.39543 19 5.5 19H19.5C20.6046 19 21.5 18.1046 21.5 17V7C21.5 5.89543 20.6046 5 19.5 5H5.5C4.39543 5 3.5 5.89543 3.5 7Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M15.5 10H18.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15.5 13H18.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 10C11.5 11.1046 10.6046 12 9.5 12C8.39543 12 7.5 11.1046 7.5 10C7.5 8.89543 8.39543 8 9.5 8C10.0304 8 10.5391 8.21071 10.9142 8.58579C11.2893 8.96086 11.5 9.46957 11.5 10Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M5.5 16C8.283 12.863 11.552 13.849 13.5 16" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
            </div>
            <label class="text-gray-700 font-semibold mb-3 dark:text-white dark:bg-slate-700">Identificación</label>
            <input type="file" @change="onFileChange($event, 'CED')" class="mb-3 text-sm border border-gray-300 rounded-lg p-2 w-full" />
            <img v-if="previews.CED" :src="previews.CED" alt="Preview" class="w-full h-36 object-cover rounded-lg mb-3 shadow-inner" />
          </div>
  
          <div v-if="data_question.data.answer.options.includes('COMPE')"
          class="w-full md:w-1/3 p-6 bg-white dark:bg-slate-700 dark:text-white rounded-lg shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow duration-300 border-2 border-dashed border-gray-300">
            <div class="mb-3">
              <!-- Ícono de ejemplo, puedes reemplazarlo con el que prefieras -->
              <svg class="h-10 w-10 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 11V15.8C21 16.9201 21 17.4802 20.782 17.908C20.5903 18.2843 20.2843 18.5903 19.908 18.782C19.4802 19 18.9201 19 17.8 19H6.2C5.0799 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2C3 7.0799 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.0799 5 6.2 5H15M21 11L15 5M21 11H16.6C16.0399 11 15.7599 11 15.546 10.891C15.3578 10.7951 15.2049 10.6422 15.109 10.454C15 10.2401 15 9.96005 15 9.4V5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </div>
            <label class="text-gray-700 font-semibold mb-3 dark:text-white dark:bg-slate-700">Estado de Cuenta</label>
            <input type="file" @change="onFileChange($event, 'COMPE')" class="mb-3 text-sm border border-gray-300 rounded-lg p-2 w-full" />
            <img v-if="previews.COMPE" :src="previews.COMPE" alt="Preview" class="w-full h-36 object-cover rounded-lg mb-3 shadow-inner" />
          </div>
      </div>

 
      <div v-if="data_question.data.answer.options.includes('FirmaDigital')"
        class="flex items-center justify-center space-x-4 mt-4">
        <div class="flex items-center justify-center space-x-4"> 
          <Button v-if="g_OrderIsActive" label="Firmar con el Pad Topaz Systems" icon="pi pi-pencil" size="small" @click="tipo_firma='topaz'" /> 
          <Button v-if="g_OrderIsActive" severity="secondary"  label="Firma desde la Pantalla" icon="pi pi-pencil" size="small" @click="tipo_firma='canva'" /> 
        </div>
      </div> 

        <!-- Topaz -->
        <div v-if="tipo_firma=='topaz'" class="mt-2 bg-gray-100 b-2 border-dashed border-gray-300 dark:bg-slate-700 dark:text-white rounded-lg shadow-lg p-4">
              <div id="guiaPasos" style="text-align: center; color: rgb(86,86,86); padding: 20px;">
                <h3 class="text-lg font-semibold leading-6 text-primary-700 dark:text-primary-100">Pasos para usar el Pad de firma digital:</h3>
                <div style="display: inline-block; text-align: left;">
                  <ol class="list-decimal list-inside">
                      <li>Haz click en "Iniciar PAD".</li>
                      <li>Escribe la Firma Digital con el Pad Topaz Systems.</li>
                      <li>Verifica que la firma sea visible.</li>
                      <li>Haz click en <span class="text-primary-500 font-bold">"Guardar firma"</span>.</li>
                      <li>Haz click en <span class="text-green-500 font-bold">"Enviar"</span>. junto con los adjuntos.</li>
                  </ol>
                </div>
            </div>

            <div class="flex justify-center items-center h-full">
                <table border="2" cellpadding="0" width="300" height="100">
                    <tr>
                        <td>
                            <canvas id="cnv" name="cnv" width="300" height="100"></canvas>
                        </td>
                    </tr>
                </table>
            </div>

            <br>

            <Message :closable="false" v-if="pad_iniciado && !pad_firma_guardada" severity="info"> Pad Topaz Systems iniciado. Proceda a firmar. Una vez el cliente firme, haga click en "Guardar Firma".</Message>
            <Message :closable="false" v-if="pad_firma_guardada"  severity="success"> Firma digital guardada. Proceda a enviar la tarea.</Message>
            <div class="flex justify-center items-center h-full">

                <div class="button-container">
                    <Button raised  severity="info" id="SignBtn" name="SignBtn" size="small" class="ml-1" label="Iniciar PAD" @click="onSign()" />
                    <Button raised  severity="secondary"    id="button1" name="ClearBtn" size="small" class="ml-1" label="Limpiar Firma" @click="onClear()" />
                    <Button raised  severity="success"  size="small" class="ml-1" label="Guardar Firma" @click="validarfirmadigital()" />

                    <a id="downloadLink" style="display: none;" download="signature.bmp">Download Signature</a>

                    <p id="daysUntilExpElement" style="display: none;"></p>
                    <p id="SigWebVersion" style="display: none;"></p>
                    <p id="SigWebTabletJSVersion" style="display: none;"></p>
                    <p id="CertificateExpirationDate" style="display: none;"></p>

                </div>

            </div>
        </div> 

        <!-- Firma desde la pantalla -->
        <div v-if="tipo_firma=='canva'" class="mt-2">
            <VueSignaturePad class="bg-gray-100" ref="signaturePad"/>
        </div> 

  
      <div class="sm:flex sm:items-center mt-10 justify-end"> 
        <Button v-if="g_OrderIsActive" class="ml-4" label="Saltar Tarea"  severity="warn" icon="pi pi-erase" :loading="lead_loading.store" size="small" @click="fn_skip()" />
        <Button v-if="g_OrderIsActive" :disabled="( (!pad_firma_guardada && tipo_firma=='topaz') || tipo_firma=='' )" class="ml-4" label="Enviar" icon="pi pi-save" :loading="lead_loading.store" size="small" @click="uploadFiles" />
      </div>
  
      <div v-if="uploadSuccess" class="mt-4 text-green-600">Archivos subidos exitosamente!</div>
      <div v-if="uploadError" class="mt-4 text-red-600">{{ message_error }}</div>
    </div>
  </template>

 

<script setup>
import tokenApi from '@/api/tokenApi';
import { ref, onMounted, onUnmounted  } from 'vue';
import { storeToRefs } from 'pinia';
import Swal from 'sweetalert2';
import { LeadStore } from '@/stores/LeadStore';
import { OrderStore } from '@stores/OrderStore';

const {g_OrderIsActive} = storeToRefs(OrderStore()); 
    

  const { lead_loading, data_question,lead_id, lead_stage } = storeToRefs(LeadStore());
  const { a_NextQuestion, a_storeAnswer } = LeadStore();
  
  const message_error = ref('');
  const tipo_firma = ref('normal');
  const data_firma = ref(null);
  
  const signaturePad = ref(null);

  const previews = ref({
    CED: null,
    FirmaDigital: null,
    COMPE: null,
  });
  
  const selectedFiles = ref({
    CED: null,
    FirmaDigital: null,
    COMPE: null,
  });
  
  const onFileChange = (event, id) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        previews.value[id] = reader.result;
        selectedFiles.value[id] = reader.result;
      };
    }
  };


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
  const uploadFiles = async () => {
    try {
      const options = data_question.value.data.answer.options;
      let payload; // Declare payload here to ensure it's accessible throughout the function 
      if (options.includes('FirmaDigital')) 
      {
        if (tipo_firma.value=='canva')
        {
          if(signaturePad.value == null) 
          {
            message_error.value = 'Se eligió firma por pantalla pero no se ha firmado';
            uploadError.value = true;
            return;
          } 
          
          const { isEmpty, data } = signaturePad.value.saveSignature();
          if (isEmpty) {
            message_error.value = 'Hubo un error al guardar la firma por pantalla';
            uploadError.value = true;
            return;
          }

          data_firma.value = data;
        }
        else if (tipo_firma.value=='topaz')
        {
          if (data_firma.value == null) {
            message_error.value = 'Se eligió firma con el Pad Topaz Systems pero no se pudo leer la firma. Favor limpiar y volver a firmar.';
            uploadError.value = true;
            return;
          }
          //añadir al texto el base64 de la firma
          data_firma.value= `data:image/png;base64,${data_firma.value}`;
 
        }

         

        // Define payload for the case where FirmaDigital is included
        payload = {
          answer: [
            { id: 'CED', image: selectedFiles.value.CED },
            { id: 'FirmaDigital', image: data_firma.value },
            { id: 'COMPE', image: selectedFiles.value.COMPE },
          ],
          lead_id: lead_id.value,
          stage: lead_stage.value,
        };

      } else {
        // Define payload for the case where FirmaDigital is not included
        payload = {
          answer: [
            { id: 'CED', image: selectedFiles.value.CED },
          ],
          lead_id: lead_id.value,
          stage: lead_stage.value,
        };
      }

      const response = await tokenApi.post(`leads/orchestration/${lead_id.value}/answer`, payload);

      if (response.data.success) {
        uploadSuccess.value = true;
        uploadError.value = false;
        await a_NextQuestion();
      }
    } catch (error) {
      console.error(error);
      if (error.response.data.message) {
        message_error.value = error.response.data.message;
      } else {
        message_error.value = 'Error al subir los archivos';
      }
      uploadError.value = true;
    }
  };
  
  const uploadSuccess = ref(false);
  const uploadError = ref(false);


  // SIGWEB

  
const tmr = ref(null);
const resetIsSupported = ref(false);
const sigWebInstalled = ref(false);
const sigWebVersion = ref('');
const pad_iniciado= ref(false);
const pad_firma_guardada= ref(false);

// Methods to check SigWeb version and installation
const isSigWeb_1_6_4_0_Installed = (sigWebVer) => {
  const minSigWebVersionResetSupport = "1.6.4.0";
  return !isOlderVersion(minSigWebVersionResetSupport, sigWebVer);
};

const isSigWeb_1_7_0_0_Installed = (sigWebVer) => {
  const minSigWebVersionGetDaysUntilCertificateExpiresSupport = "1.7.0.0";
  return !isOlderVersion(minSigWebVersionGetDaysUntilCertificateExpiresSupport, sigWebVer);
};

const isOlderVersion = (oldVer, newVer) => {
  const oldParts = oldVer.split('.');
  const newParts = newVer.split('.');
  
  for (let i = 0; i < newParts.length; i++) {
    const a = parseInt(newParts[i]) || 0;
    const b = parseInt(oldParts[i]) || 0;
    if (a < b) return true;
    if (a > b) return false;
  }
  return false;
};

// SigWeb signature methods
const onSign = () => {
  pad_iniciado.value = true;
  if (window.IsSigWebInstalled) {
    const ctx = document.getElementById('cnv').getContext('2d');
    window.SetDisplayXSize(300);
    window.SetDisplayYSize(100);
    window.SetTabletState(0, tmr.value);
    window.SetJustifyMode(0);
    window.ClearTablet();
    
    if (tmr.value == null) {
      tmr.value = window.SetTabletState(1, ctx, 50);
    } else {
      window.SetTabletState(0, tmr.value);
      tmr.value = null;
      tmr.value = window.SetTabletState(1, ctx, 50);
    }
  } else {
    alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
  }
};

const onClear = () => {
  window.ClearTablet();
};

const validarfirmadigital = () => {
  if (window.NumberOfTabletPoints() === 0) {
    alert("Please sign before continuing");
    return;
  }
  
  window.SetTabletState(0, tmr.value);
  window.SetSigCompressionMode(1);
  
  // Get signature as base64 image
  window.SetImageXSize(500);
  window.SetImageYSize(100);
  window.SetImagePenWidth(5);
  window.GetSigImageB64(sigImageCallback);

  pad_firma_guardada.value=true;
};

const sigImageCallback = (base64Signature) => {
  // Here you can handle the base64 signature 
  // For example, emit it to parent or store it
  console.log('Signature received:', base64Signature);
  data_firma.value = base64Signature;
};


// Check SigWeb installation and version on component mount
onMounted(() => {

  const script = document.createElement('script')
  script.src = 'https://www.sigplusweb.com/SigWebTablet.js'
  script.async = true
  document.head.appendChild(script)


  if (window.IsSigWebInstalled && window.IsSigWebInstalled()) {
    sigWebInstalled.value = true;
    
    try {
      sigWebVersion.value = window.GetSigWebVersion();
      
      if (sigWebVersion.value) {
        resetIsSupported.value = true;
        
        if (isSigWeb_1_7_0_0_Installed(sigWebVersion.value)) {
          try {
            const daysUntilCertExpires = window.GetDaysUntilCertificateExpires();
            console.log(`SigWeb Certificate expires in ${daysUntilCertExpires} days`);
          } catch (err) {
            console.error('Certificate expiration check failed:', err);
          }
        }
      }
    } catch (err) {
      console.error('SigWeb version check failed:', err);
    }
  }
});

// Cleanup on component unmount
onUnmounted(() => {
  if (tmr.value) {
    window.SetTabletState(0, tmr.value);
    tmr.value = null;
  }
});

</script>
  
  
  