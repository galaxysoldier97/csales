

import authApi from '@/api/authApi'
import tokenApi from '@/api/tokenApi'
import { defineStore } from 'pinia' 

export const SystemDataStore = defineStore('systemdata', {
  state: () => ({
    systemdata_loading: {  getdata:false}, 
    data_action_sales_type:[],
    data_order_status:[],
  }),
    getters: { 
    },

    actions: {
        async a_getDataComponent(component) {
            this.systemdata_loading.getdata = true
            try {
                const response = await tokenApi.get(`systemdata`, { params: { component: component } }) 
                return response.data
            } catch (error) {
                console.error(error)
            } finally {
                this.systemdata_loading.getdata = false
            }
        },

        
        async a_getActionSalesType() 
        {
          this.systemdata_loading.getdata = true
          try { 
            this.data_action_sales_type = await this.a_getDataComponent('Action_Sales_Type') 
               console.log(this.data_action_sales_type)
          } catch (error) {
              console.error(error)
          } finally {
              this.systemdata_loading.getdata = false
          }
      },

      async a_getOrderStatus()
      {
        this.systemdata_loading.getdata = true
        try { 
          this.data_order_status = await this.a_getDataComponent('OrderStatus') 
        } catch (error) {
            console.error(error)
        } finally {
            this.systemdata_loading.getdata = false
        }
      },
 
        
      async a_getDataCancelReason()
      {
        this.loading = true
        try {
          const response = await tokenApi.get(`cancelreasons`)
          return  response.data.response
        } catch (error) {
          console.error(error)
          return  []
        } 
      },

      
      async a_getDataRejectReason()
      {
        this.loading = true
        try {
          const response = await tokenApi.get(`rejectreasons`)
          return  response.data.response
        } catch (error) {
          console.error(error)
          return  []
        } 
      },

    }
})