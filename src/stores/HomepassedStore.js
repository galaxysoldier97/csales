

import authApi from '@/api/authApi'
import tokenApi from '@/api/tokenApi'
import { defineStore } from 'pinia'



export const HomepassedStore = defineStore('homepassed', {
  state: () => ({
    list_provincias:[],
    list_distritos:[],
    list_corregimientos:[],
    list_barrios:[], 
    homepassed_loading: { getdata:false,store:false,update:false,delete:false},
   
  }),
  actions: {

    async a_getCalleByIdBarrio(barrio_id) {
      try {  
          this.homepassed_loading.getdata = true 
          const response = await authApi.get(`/homepass/callestytan/${barrio_id}`)
          const data= JSON.parse(response.data.response);
          return data.filter(item => item.calle && !item.calle.includes('TEMPORAL'));
      }
      catch (error) { 
        console.error(error) 
      }
      finally {
        this.homepassed_loading.getdata = false
      }
    },
    async a_getCasaByIdCalle(calle_id) {
      try {  
          this.homepassed_loading.getdata = true 
          const response = await authApi.get(`/homepass/casastytan/${calle_id}`)
          const data= JSON.parse(response.data.response);
          return data.filter(item => item.nombre && !item.nombre.includes('TEMPORAL'));
      }
      catch (error) { 
        console.error(error) 
      }
      finally {
        this.homepassed_loading.getdata = false
      }
    },
    async a_getCorregimientoById(id) {
      try {  
          this.homepassed_loading.getdata = true 
          const response = await authApi.get(`/homepass/corregimiento/${id}`)
          return response.data.response
      }
      catch (error) { 
        console.error(error) 
      }
      finally {
        this.homepassed_loading.getdata = false
      }
    },
    async a_fetchProvincias() {
      try {  
          this.homepassed_loading.getdata = true 
          const response = await authApi.get(`/homepass/provincias`)
          this.list_provincias = response.data
      }
      catch (error) { 
        console.error(error) 
      }
      finally {
        this.homepassed_loading.getdata = false
      } 
    },
    async a_fetchDistritos() {
      try {  
          this.homepassed_loading.getdata = true 
          const response = await authApi.get(`/homepass/distritos`)
          this.list_distritos = response.data
      }
      catch (error) { 
        console.error(error) 
      }
      finally {
        this.homepassed_loading.getdata = false
      }
    },
    async a_fetchCorregimientos() {
      try {  
          this.homepassed_loading.getdata = true 
          const response = await authApi.get(`/homepass/corregimientos`)
          this.list_corregimientos = JSON.parse(response.data.response);
      }
      catch (error) { 
        console.error(error) 
      }
      finally {
        this.homepassed_loading.getdata = false
      }
    },
    async a_fetchBarrios() {
        try {  
            this.homepassed_loading.getdata = true 
            const response = await authApi.get(`/homepass/barrios`)
            this.list_barrios = JSON.parse(response.data.response);
        }
        catch (error) { 
          console.error(error) 
        }
        finally {
          this.homepassed_loading.getdata = false
        }
      },
       
  },
})
