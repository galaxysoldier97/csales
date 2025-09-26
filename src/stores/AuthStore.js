

import authApi from '@/api/authApi'
import tokenApi from '@/api/tokenApi'
import { defineStore } from 'pinia'

export const AuthStore = defineStore('auth', {
  state: () => ({
    loading: false,
    username: '',
    data_user: [],
    isLoggedIn: false,
    authStatus:'no-auth',
    token: '',
    rol:'default',
    user: null,
    permisos:[],
    flashlogin:false,
    reset_password:{ username:'', currentPassword : null,    newPassword : null,   confirmPassword : null}
  }),
  actions: 
  {
    
    async a_login(form_data) {
      try {  
        this.loading = true 
        let response = await authApi.get('session'); 
        this.token = response.data.token
        localStorage.setItem("token", response.data.token);
        response = await authApi.post('session', form_data)   
        const data=response.data.response
        const sol_change_pass=response.data.sol_change_pass
        this.token = data.token
        localStorage.setItem("token", data.token);
        this.username = data.username
        this.reset_password.username = data.username
        this.permisos=data.permisos
        this.isLoggedIn = true
        this.authStatus='authenticated'
        const {ok, message} = await this.checkAuth()
        this.loading = false 
        return { ok: ok, sol_change_pass: sol_change_pass,  message: message }
      } catch (error) {
        console.error(error)
        // Eliminar el token del almacenamiento local si no es válido
        localStorage.removeItem('token')
        this.loading = false
        if(error.response.data.message)
        {
          return { ok: false,  sol_change_pass:-1, message: error.response.data.message}
        }
        else
        {
          return { ok: false, sol_change_pass:-1,  message: 'Error inesperado. Favor contactar con Soporte.'}
        }
      }
    },

    
    async a_updatePassword() {
      try {  
        this.loading = true 
        const response = await authApi.post('auth/cambiar-password', this.reset_password) 
        this.loading = false 
        return { ok: true, message: "successful" }
      } catch (error) {
        console.error(error.response.data)
        // Eliminar el token del almacenamiento local si no es válido
        localStorage.removeItem('token')
        this.loading = false
        return { ok: false, message: error.response.data.errors.message}
      }
    },
     
     
    async logout() {
      try { 
        this.isLoggedIn = false
        this.authStatus='no-auth',
        this.token = ''
        this.user = null
        // Eliminar el token del almacenamiento local
        localStorage.removeItem('token')
      } catch (error) {
        console.error(error)
        // Mostrar un mensaje de error en el frontend
        throw new Error('Logout failed')
      }
    }, 
 
    
    async checkAuth() {
      // Verificar si hay un token en el almacenamiento local
      const token = localStorage.getItem('token') 
      if (token) {
        // Enviar una petición al servidor para verificar el token
        try {
          
          await tokenApi.post('session/isAlive',{ token: token })
          const response = await tokenApi.post('session/data')

            if (response.status != 200) 
            { 
              this.authStatus='no-auth'
              return { ok: false }
            }
      
          this.isLoggedIn = true
          this.data_user=response.data
          this.authStatus='authenticated'
          this.rol=response.data.perfil
          return { ok: true , rol : response.data.rol }
        } catch (error) {
          console.error(error)
          // Eliminar el token del almacenamiento local si no es válido
          //localStorage.removeItem('token')
          return { ok: false  }

        }
      }
      else
      {
        this.authStatus='no-auth'
        return { ok: false, rol:'no-auth' }
      }
    },

    async a_checkFlashLogin() 
    {
      if(this.authStatus=='authenticated')
        {
           
        const {ok} = await this.checkAuth()
        if(!ok)
        {
          this.flashlogin=true
        }
        else
        {
          this.flashlogin=false
        }
      }
    },

    async a_requestReset(username, email) {
      try {  
        this.loading = true 
        const response = await authApi.post('recuperar-password', { username: username, email: email }) 
        this.loading = false 
        return { ok: true, message:  " Se ha enviado un correo con las instrucciones para recuperar su contraseña." }
      } catch (error) {
        console.error(error) 
        this.loading = false 
        if(error.response.data.email)
        {
          console.log(error.response.data.email)
          return { ok: false, message: error.response.data.email[0]}
        }
        else if(error.response.data.username)
          {
            console.log(error.response.data.username)
            return { ok: false, message: error.response.data.username[0]}
          }
        else if(error.response.data.message)
          {
            return { ok: false, message: error.response.data.message}
          }
          else
          {
            return { ok: false, message: 'Error inesperado. Favor contactar con Soporte.'}
          }
      }
    },

    async a_changePassword(username,contrasenha_actual, contrasenha_nueva, confirmar_contrasenha) 
    {
      try {  
        this.loading = true 
         
        const response = await tokenApi.post('cambiar-password', { username: username, contrasenha_actual: contrasenha_actual, contrasenha_nueva: contrasenha_nueva, confirmar_contrasenha: confirmar_contrasenha }) 
        this.loading = false 
        return { ok: true, message: "successful" }
      } catch (error) {
        console.error(error.response.data) 
        this.loading = false
        return { ok: false, data_error: error.response.data}
      } finally {
        this.loading = false
      } 
    },


  },
})

 