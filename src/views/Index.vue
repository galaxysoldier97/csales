<template>
    <div>
        <h1>Cargando...</h1>
    </div>
</template>

<script setup>
import {AuthStore} from '@stores/AuthStore';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const { checkAuth} = AuthStore();
const router = useRouter();

 onMounted( async() => {
   const {ok} = await checkAuth();

   if(!ok) {
        router.push( {name: 'login'});
   }
   else
   {
    router.push( {name: 'orders_create'});
   }
  });
</script>