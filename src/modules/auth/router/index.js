export default {
  name: 'auth',
  component: () => import(/* webpackChunkName: "auth" */ '@/modules/auth/Layout'),
  children: [
    {
      path: 'login',  // Agregar ':id' al final de la ruta
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '@/modules/auth/views/Login')
    },
    
    {
      path: 'password/change',  // Agregar ':id' al final de la ruta
      name: 'edit_password',
      component: () => import(/* webpackChunkName: "edit_password" */ '@/modules/auth/views/EditPassword')
    }
  ]
}


