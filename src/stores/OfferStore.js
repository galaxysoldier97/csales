

import authApi from '@/api/authApi'
import tokenApi from '@/api/tokenApi'
import { defineStore } from 'pinia'



export const OfferStore = defineStore('offers', {
  state: () => ({
    offer_loading: { getdata:false,store:false,update:false,delete:false},
    data_offer:[],
   
  }),
  getters: {
    g_total_price( offer_id) {
      const offer = this.data_offer.find((item) => item.id === offer_id)
      let total = 0.
      offer.vas.forEach((item) => {
        if (item.checked) {
          total += item.quantity * item.price;  // Assuming `quantity` is a property of `item`
        }
      });
      total += offer.price;
      return total.toFixed(2);
    },
  },
  actions: {
    async a_fetchOffer(offer_id) {
        try {  
            this.offer_loading.getdata = true 
            const response = await tokenApi.get(`offers/${offer_id}`)
             this.data_offer = response.data
             this.data_offer.vas.map((item) => {
              item.checked = false
              item.quantity = 1
              item.price_calc = 0
             })

             return this.data_offer
        }
        catch (error) { 
          console.error(error) 
        }
        finally {
          this.offer_loading.getdata = false
        }
      },
      
  },
})

 