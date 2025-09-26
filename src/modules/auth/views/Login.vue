
<template>
    <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
       
      <div class="mt-10 sm:mx-auto sm:w-96"> 
        <div class="bg-primary-600 px-6 py-12 shadow sm:rounded-lg sm:px-16 dark:bg-slate-800">

          <div class="sm:mx-auto sm:w-full sm:max-w-md mb-5 flex items-center justify-center">
            <img class="mx-auto" src="@/assets/tigo-brand.png" alt="Tigo Logo" width="50" />
            <img class="mx-auto" src="@/assets/csales_logo.png" alt="Csales" width="100" />
          </div>
      

          
          <div  class="space-y-6"   >
            <div>
              <label for="username" class="block text-sm font-medium leading-6 text-white">Usuario:</label>
              <div class="">
                <InputText rounded v-model="form_data.username" type="text" class="block w-full  text-center" />
              </div>
            </div>
  

            
            <div>
              <label for="password" class="block text-sm font-medium leading-6 text-white">Contraseña:</label>
              <div class="">
                <Password rounded toggleMask :feedback="false" v-model="form_data.password" :style="{ width: '100%',  'text-align':'center' }" 
                :inputStyle="{ width: '100%', 'text-align':'center' }"   />
              </div>
            </div> 
            <div>  
                <Button rounded type="submit" class="w-full mt-4" label="Iniciar" size="small" :loading="loading"  @click="login()" />
            </div>
            
            <div class="flex items-center justify-end"> 
              <div class="text-sm leading-6"> 
                
                <button rounded class="text-white underline hover:bg-primary-500 dark:hover:bg-primary-400" @click="visibleReset = true">
                  Restablecer contraseña
                </button>
              </div>
            </div>
          </div> 
 
        </div>
   
      </div>

      

      <Dialog v-model:visible="visibleReset" modal header="Recuperación de Contraseña"  class="md:w-[35rem] w-full" >
            <Message :closable="false" severity="info">Ingrese su usuario y correo para recuperar su contraseña</Message>
            <div class="flex flex-col justify-start md:flex-row md:items-center gap-4 mb-4">
                <label for="username" class="font-semibold w-24">Usuario</label>
                <InputText  v-model="form_reset_data.username" class="flex-auto text-center" autocomplete="off" />
            </div>
            <div class="flex flex-col justify-start md:flex-row md:items-center gap-4 mb-4">
                <label for="email" class="font-semibold w-24">Correo</label>
                <InputText  v-model="form_reset_data.email" class="flex-auto text-center" autocomplete="off" />
            </div>
            <Message severity="error" v-if="form_reset_data.message_error">{{ form_reset_data.message_error }}</Message>
            <div class="flex justify-end gap-2">
                <Button size="small" type="button" label="Cancelar" severity="secondary" @click="visibleReset = false"></Button>
                <Button size="small" :loading="loading" type="button" label="Enviar" @click="fn_requestReset()"></Button>
            </div>
        </Dialog>

        <Dialog v-model:visible="form_change_password.modal_show" modal header="Cambiar Contraseña"  class="md:w-[35rem] w-full" >
            <Message :closable="false" severity="info">Ingrese una nueva contraseña</Message>
            <div class="flex flex-col justify-start md:flex-row md:items-center gap-4 mb-4">
                <label for="username" class="font-semibold w-24">Contraseña Actual</label>
                <Password rounded toggleMask :feedback="false" v-model="form_change_password.contrasenha_actual" :style="{ width: '100%',  'text-align':'center' }" 
                :inputStyle="{ width: '100%', 'text-align':'center' }"   />
            </div>  

            <div v-if="form_change_password.data_error && form_change_password.data_error.contrasenha_actual">
              <Message severity="error" v-for="item in form_change_password.data_error.contrasenha_actual" :key="item">{{ item }}</Message>
            </div>
  
            
            <div class="flex flex-col justify-start md:flex-row md:items-center gap-4 mb-4">
                <label for="username" class="font-semibold w-24">Nueva Contraseña</label>
                <Password rounded toggleMask v-model="form_change_password.contrasenha_nueva" :strongRegex="strongRegex" :style="{ width: '100%',  'text-align':'center' }" 
                 weakLabel="Débil"   mediumLabel="Moderado"  strongLabel="Robusto" 
                :inputStyle="{ width: '100%', 'text-align':'center' }">
                  <template #header>
                      <h6>Seguridad de la contraseña</h6>
                  </template>
                  <template #footer>
                      <Divider />
                      <p class="mt-2">Suggestions</p>
                      <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                        <li>Al menos 2 letra minúscula</li>
                        <li>Al menos 2 letra mayúscula</li>
                        <li>Al menos 2 número</li>
                        <li>Al menos 2 caracter especiales</li> 
                      </ul>
                  </template>
              </Password>
              
            </div> 

            <div v-if="form_change_password.data_error && form_change_password.data_error.contrasenha_nueva">
              <Message severity="error" v-for="item in form_change_password.data_error.contrasenha_nueva" :key="item">{{ item }}</Message>
            </div>
             

            
            <div class="flex flex-col justify-start md:flex-row md:items-center gap-4 mb-4">
                <label for="username" class="font-semibold w-24">Confirmar Contraseña</label>
                <Password rounded toggleMask :feedback="false" v-model="form_change_password.confirmar_contrasenha" :style="{ width: '100%',  'text-align':'center' }" 
                :inputStyle="{ width: '100%', 'text-align':'center' }"   />
            </div> 


            <div v-if="form_change_password.data_error && form_change_password.data_error.confirmar_contrasenha">
              <Message severity="error" v-for="item in form_change_password.data_error.confirmar_contrasenha" :key="item">{{ item }}</Message>
            </div>
  
            <div class="flex justify-end gap-2"> 
                <Button size="small" :loading="loading" type="button" label="Enviar" @click="fn_changePassword()"></Button>
            </div>
        </Dialog>


    </div>
  </template>
   
 <script setup>
    import { ref } from 'vue'
    import { storeToRefs } from 'pinia';
    import { AuthStore } from '@/stores/AuthStore';
    import { useRouter } from 'vue-router';
    import Swal from 'sweetalert2';
    const router = useRouter(); 
    const {loading} = storeToRefs(AuthStore());
    const { a_login , a_requestReset, a_changePassword} = AuthStore();

    const form_data = ref({
      username: '',
      password: ''
    });

    const form_reset_data = ref({
      username: '',
      email: '',
      message_error: null
    });

    const form_change_password = ref({
      username: '',
      contrasenha_actual: '',
      contrasenha_nueva: '',
      confirmar_contrasenha: '',
      modal_show: false,
      data_error: null
    });

    const visibleReset = ref(false); 

    const login = async () => {
      const { ok, sol_change_pass, message } = await a_login(form_data.value);
      if (ok) {
        if(sol_change_pass==1)
        {
          form_change_password.value.modal_show = true;
          form_change_password.value.username = form_data.value.username;
        }
        else
        {
          router.push({ name: 'orders_create' });
        } 
      } else { 
        if(message=="Debe cambiar su contraseña")
        {
          router.push({ name: 'edit_password' });
        }
        else
        {
          Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message,
        });
        } 
      }
    }


    const fn_requestReset = async () => {
      form_reset_data.value.message_error = null;
      const { ok, message } = await a_requestReset(form_reset_data.value.username, form_reset_data.value.email);
      if (ok) {
        visibleReset.value = false;
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: message,
        });
      } else {
         form_reset_data.value.message_error = message;
      }
    }

    const fn_changePassword = async () => {
      form_change_password.value.data_error = [];
      const { ok, data_error } = await a_changePassword(form_change_password.value.username, form_change_password.value.contrasenha_actual, form_change_password.value.contrasenha_nueva, form_change_password.value.confirmar_contrasenha);
      if (ok) {
        form_change_password.value.modal_show = false; 
        form_data.value.username = form_change_password.value.username;
        form_data.value.password = form_change_password.value.contrasenha_nueva;
        login();

      } else {
         form_change_password.value.data_error = data_error;
      }
    }


    const strongRegex = /^(?=(.*[a-z]){2,})(?=(.*[A-Z]){2,})(?=(.*\d){2,})(?=(.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]){2,}).{8,}$/;



  </script>