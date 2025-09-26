
<template>
    <div class="card flex justify-center bg-primary-600"> 
        <Dialog v-model:visible="flashlogin" modal header=" "   class="bg-primary-600 md:w-[35rem] w-full"  pt:root:class="!border-0 !bg-transparent" pt:mask:class="bg-black/60">
            <template #container="{ closeCallback }">
            <div class="bg-primary-600 px-6 py-12 shadow sm:rounded-lg sm:px-16">
 
                <div class="sm:mx-auto sm:w-full sm:max-w-md mb-5"> 
                <img class="mx-auto" src="@/assets/csales_logo.png" alt="Csales" width="100" />
                </div> 
                <Message :closable="false" severity="warn">Su sesión ha expirado, por favor inicie sesión nuevamente</Message>


                <form class="space-y-6" @submit.prevent="login" >
                <div>
                    <label for="username" class="block text-sm font-medium leading-6 text-white">Usuario</label>
                    <div class="mt-2">
                    <input id="username"  v-model="form_data.username" type="text" autocomplete="username" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" />
                    </div>
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium leading-6 text-white">Contraseña:</label>
                    <div class="mt-2">
                    <input id="password" v-model="form_data.password" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center" />
                    </div>
                </div> 
                <div>  
                    <Button type="submit" class="w-full" label="Iniciar" size="small" :loading="loading"  />
                </div>
                </form> 
                </div>
            </template>
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
const {loading, flashlogin} = storeToRefs(AuthStore());
const { a_login , a_checkFlashLogin } = AuthStore();

const form_data = ref({
  username: '',
  password: ''
});

const login = async () => {
  const { ok, message } = await a_login(form_data.value);
  if (ok) {
       flashlogin.value = false;
  } else {    
      Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
    }); 
  }
}



</script>


<style scoped>
.custom-backdrop {
  backdrop-filter: blur(10px); /* Adjust the blur amount as needed */
  background-color: rgba(0, 0, 0, 0.7); /* Darker background with transparency */
}
</style>