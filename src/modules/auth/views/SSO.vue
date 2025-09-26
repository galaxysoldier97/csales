<template>
  <div class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 z-50"
       v-if="loading">
    <div class="bg-white dark:bg-slate-800 dark:text-white p-5 rounded-lg shadow-lg">
      <div class="flex flex-col items-center">
        <span class="font-bold text-gray-800 mb-2">Inicializando SSO...</span>
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
  import { useRoute,useRouter } from 'vue-router'
  import { AuthStore}  from '@/store/AuthStore' 
  import Swal from 'sweetalert2'
import { ref, onMounted, watch } from 'vue';

  const loading = ref(false)

  const route = useRoute();
  const router = useRouter()
  const { a_loginSSO, checkAuth } = AuthStore()  
  
onMounted(async () => {
 const { ok } = await a_loginSSO(route.params.id);
 

 if ( ok )
  {
    
    const { rol } =  await checkAuth()
    if (rol == 'CallCenter')
    {
      
     router.push({ name: 'procesos_habilitaciones' })
    }
    else
    {

      router.push({ name: 'procesos_index' })
    } 
  }
  else 
  {
    Swal.fire({
  icon: 'error',
  title: 'Error',
  text: 'Para comenzar a utilizar la aplicación, es necesario iniciar sesión en el sistema de autenticación única (SSO) primero. Por favor, inicie sesión en el SSO antes de continuar con la aplicación.',
  confirmButtonColor: '#3085d6',
  confirmButtonText: 'Ir a PORTALCO',
  allowOutsideClick: true,
}).then((result) => {
  if (result.isConfirmed) {
    window.location.href = 'https://192.168.231.176/portalco/index.php/viewapp/'; // redirigir al usuario a la URL de inicio de sesión
  }
}); 
  }


});
 

</script>

<style>
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}
.lds-ellipsis div {
  position: absolute;
  top: 27px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #333;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 6px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 6px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 26px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 45px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(19px, 0);
  }
}
</style>

 