


import tokenApi from '@/api/tokenApi'
import { defineStore } from 'pinia'
import axios from 'axios'



export const OrderStore = defineStore('orders', {
  state: () => ({
    loading: false,
    list_orders:[],
    list_contracts:[],
    order:null,
    data_adjunto:[], 
    data_token:[],
    order_lead:[],
    order_lead_items:[],
    order_lead_ordering:[],
   
  }),
  getters: {

    g_OrderIsActive() {
      if (!this.order) return false;
      else if (this.order.orderstatus_name != 'Cancelled') return true;
      else if (this.order.orderstatus_name != 'Rejected') return true;
      else return false;
    },
  },
  actions: {
     
    async a_getOrders() 
    {
      this.loading = true
      try {
        const response = await tokenApi.get('orders')
        this.list_orders = response.data
      } catch (error) {
        console.error(error)
      }
      this.loading = false
    },

    async a_getOrder(id)
    {
      this.loading = true
      try {
        const response = await tokenApi.get('orders/'+id)
        this.order = response.data
      } catch (error) {
        console.error(error)
      }
      this.loading = false
    },

    
    async a_searchOrder(valuesearch)
    {
      this.loading = true
      try {
        const response = await tokenApi.get('orders/search', {params: {valuesearch: valuesearch}})
        this.list_orders = response.data
      } catch (error) {
        console.error(error)
      }
      this.loading = false
    },


    async a_fetchContratos()
    {
      this.loading = true
      try {
        const response = await tokenApi.get('orden/contratos')
        const data =  response.data.response
        this.list_contracts =data.sort((a, b) => b.id - a.id);
      } catch (error) {
        console.error(error)
      }
      this.loading = false
    },
    
    async a_FindOrderLeadid(lead_id)
    {
      this.loading = true
      try {
        const response = await tokenApi.get('orders/find/'+lead_id)
        this.order = response.data
      } catch (error) {
        console.error(error)
      }
      this.loading = false
    },

    async a_urlAdjunto(numero_orden)
    {
      this.loading = true
      try {
        const response = await tokenApi.post('urladjunto', {numero_orden: numero_orden})
        this.data_adjunto=response.data
      } catch (error) {
        console.error(error)
      }
      this.loading = false
    },

    async a_getintegracionMovil()
    {
      this.loading = true
      try {
        const response = await tokenApi.get('integracionMovil/' + this.order.order_id)
         console.log(response.data.response)
        if(response.data.successful)
        { 
          return response.data.response
        }
        else{
          return []
        }

      } catch (error) {
        console.error(error)
      }
      this.loading = false
    },

    
    async a_getintegracionHogar()
    {
      this.loading = true
      try {
        const response = await tokenApi.get('integracionHogar/' + this.order.order_id)
        return response.data

      } catch (error) {
        console.error(error)
      }
      this.loading = false
    },
 
    async a_tokencsale()
    {
      this.loading = true
      try {
        const response = await tokenApi.get('tokencsale', {params: {orderId: this.order.order_id}})
        this.data_token = response.data.response
        return {ok: true, data: response.data.response}
      } catch (error) {
        console.error(error)
        return {ok: false}
      }
      this.loading = false
    },
        
    async a_sendPortabilidad(payload) { 
      console.log(this.data_token.token)
      const token = this.data_token.token;

      const promises = payload.map(({ id, image }) => {
        if (!image) return Promise.resolve(null); // Si no hay imagen, resolver la promesa inmediatamente

        const formData = new FormData();
        formData.append('photo', image);
        formData.append('token', token);
        formData.append('orderid', this.order.order_id);

        // Convertir el id a tipo para el formulario
        let tipo;
        switch (id) {
          case 'CED':
            tipo = 'CED';
            break;
          case 'PostPago':
            tipo = 'Postpago';
            break;
          case 'COMPE':
            tipo = 'COMPE';
            break;
          default:
            tipo = id; // Por defecto, usar el id como tipo si no coincide con los casos anteriores
        }
        formData.append('type', tipo);

        return tokenApi.post('upload/portabilidad', formData, { 
        })
        .then(response => {
          if (response.status === 200) {
            return response.data;
          } else {
            throw new Error("Error en la solicitud");
          }
        })
        .catch(error => {
          console.error("Error:", error);
          return { response: false, message: "Error en la solicitud" };
        });
      });

      // Esperar a que todas las promesas se resuelvan
      return Promise.all(promises)
        .then((results) => {
          console.log("Resultados:", results.filter(result => result !== null)); // Filtrar resultados nulos
          // Verificar si al menos una respuesta fue exitosa
          const anySuccessful = results.some(result => result && result.response === true);
          if (anySuccessful) {
            return { ok: true };
          } else {
            return { ok: false, message: "No se pudo completar ninguna solicitud con éxito." };
          }
        })
        .catch(error => {
          console.error("Error en Promise.all:", error);
          return { ok: false, message: "Error al procesar las solicitudes." };
        });
    },

    async a_actDescargarPdf()
    {
      this.loading = true
      try {
        const response = await tokenApi.get('csalepdf', {params: {orden: this.order.order_id},  responseType: 'arraybuffer'}   )
         
        return { successful: true, data: response.data  };
  
        } catch (error) {
          console.error(error)
          if(error.response.data)
            {
              return error.response.data
            }
        }
        this.loading = false
      },

      async a_aprobarPago()
      { 
        this.loading = true
        try {
          const response = await tokenApi.post(`orders/${this.order.order_id}/aprobarpago`)
          return {ok:true,message:response.data.message}
        } catch (error) {
          console.error(error)
          return {ok:false,message:error.response.data.message}
        } 
      },

      async a_cancelarOrden(motivo,mensaje)
      {
        this.loading = true
        try {
          const response = await tokenApi.post(`orden/cancel`, {ordenId: this.order.order_id, motivo: motivo, mensaje: mensaje})
          return {ok:true}
        } catch (error) {
          console.error(error)
          return {ok:false}
        } 
      },

      async a_rechazarOrden(motivo,mensaje)
      {
        this.loading = true
        try {
          const response = await tokenApi.post(`orden/reject`, {ordenId: this.order.order_id, motivo: motivo, mensaje: mensaje})
          return {ok:true}
        } catch (error) {
          console.error(error)
          return {ok:false}
        } 
      },

      async a_order_lead()
      {
        this.loading = true
        try {
          const response = await tokenApi.get('orders/'+this.order.order_id+'/lead')
          this.order_lead = response.data
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      },

      async a_order_lead_items()
      {
        this.loading = true
        try {
          const response = await tokenApi.get('orders/'+this.order.order_id+'/lead_items')
          this.order_lead_items = response.data
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      },

      async a_order_lead_ordering()
      {
        this.loading = true
        try {
          const response = await tokenApi.get('orders/'+this.order.order_id+'/lead_ordering')
          this.order_lead_ordering = response.data
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      },
      async a_resetOrder()
      {
        this.order = null
      }

  },
})

 