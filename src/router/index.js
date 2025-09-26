
import { createRouter, createWebHashHistory } from 'vue-router';
import Index from '@/views/Index.vue';

import isAuthenticatedGuard from '@/modules/auth/router/auth-guard'  
import routeAuth from '@/modules/auth/router'
import routeOrder from '@/modules/orders/router'

const routes = [

    { 
        path:'/',
        name:'index',
        component: Index
    },
    {
        path: '/auth',
        ...routeAuth
      }, 
      {
        path: '/orders',
        beforeEnter: [ isAuthenticatedGuard ],
        ...routeOrder
      }, 
]


const router = createRouter({
    history: createWebHashHistory(),
    routes
})


export default router