<template>
    <div class="flex min-h-full flex-1 flex-col justify-center py-2 sm:px-6 lg:px-8">
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div class="bg-primary-600 px-6 py-8 shadow sm:rounded-lg sm:px-12">
          <div class="sm:mx-auto sm:w-full sm:max-w-md mb-5">
            <img class="mx-auto" src="@/assets/logo_tigofet.jpg" alt="Csales" />
          </div>
  
          <Message :closable="false">Debes cambiar tu contraseña como parte de nuestras medidas de seguridad.</Message>
      

          <form class="space-y-6" @submit.prevent="updatePassword">
            <div>
              <label for="current-password" class="block text-sm font-medium leading-6 text-white">Contraseña Actual</label>
              <div class="mt-2">
                <input id="current-password" v-model="reset_password.currentPassword" type="password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
            </div>
  
            <div>
              <label for="new-password" class="block text-sm font-medium leading-6 text-white">Nueva Contraseña</label>
              <div class="mt-2">
                <input id="new-password" v-model="reset_password.newPassword" type="password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
            </div>
  
            <div>
              <label for="confirm-password" class="block text-sm font-medium leading-6 text-white">Confirmar Nueva Contraseña</label>
              <div class="mt-2">
                <input id="confirm-password" v-model="reset_password.confirmPassword" type="password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
            </div>
  
            <div>
              <Button type="submit" class="w-full" label="Cambiar Contraseña" size="small" :loading="loading" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { AuthStore } from '@/stores/AuthStore';
  import { useRouter } from 'vue-router';
  import Swal from 'sweetalert2';
  import Button from 'primevue/button';
  
  const router = useRouter();
  const { loading, reset_password } = storeToRefs(AuthStore());
  const { a_updatePassword } = AuthStore();
   
  
  const updatePassword = async () => {
    if (reset_password.value.newPassword !== reset_password.value.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La nueva contraseña y la confirmación de la contraseña no coinciden.',
      });
      return;
    }
  
    const { ok, message } = await a_updatePassword();
  
    if (ok) {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'La contraseña ha sido actualizada con éxito.',
      }).then(() => {
        router.push({ name: 'login' }); // Asegúrate de tener una ruta de login definida
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
      });
    }
  };
  </script>
  