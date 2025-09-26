import tokenApi from '@/api/tokenApi'
import { defineStore } from 'pinia'

export const MobileStore = defineStore('mobile', {
  state: () => ({
    mobile_loading: { 
      deviceInfo: false, 
      customerInfo: false, 
      installments: false, 
      beneficiarios: false, 
      beneficios: false,
      all: false 
    },
    data_mobile: {
      deviceInfo: null,
      customerInfo: null,
      installmentsStatus: null,
      bpt: {
        beneficiarios: [],
        beneficios: []
      }
    },
    error: null
  }),

  getters: {
    // Check if device info is available
    g_hasDeviceInfo: (state) => state.data_mobile.deviceInfo !== null,
    
    // Check if customer info is available
    g_hasCustomerInfo: (state) => state.data_mobile.customerInfo !== null,
    
    // Check if installments data is available
    g_hasInstallmentsData: (state) => state.data_mobile.installmentsStatus !== null,
    
    // Get active beneficiarios
    g_activeBeneficiarios: (state) => {
      return state.data_mobile.bpt.beneficiarios.filter(b => b.active === true)
    },
    
    // Get available beneficios
    g_availableBeneficios: (state) => {
      return state.data_mobile.bpt.beneficios.filter(b => b.available === true)
    }
  },

  actions: {
    // Get mobile device information
    async a_getMobileDeviceInfo(num_abonado, cod_cliente) {
      try {
        this.mobile_loading.deviceInfo = true
        this.error = null
        
        const response = await tokenApi.get('/mobile/devices-info', {
          params: { num_abonado, cod_cliente }
        })
        this.data_mobile.deviceInfo = response.data.data
        
        return { ok: true, data: response.data }
      } catch (error) {
        console.error('Error fetching mobile device info:', error)
        this.error = error.response?.data?.message || 'Error fetching mobile device information'
        return { ok: false, message: error.response?.data?.message || 'Error fetching mobile device information' }
      } finally {
        this.mobile_loading.deviceInfo = false
      }
    },

    // Get mobile customer information
    async a_getMobileCustomerInfo(num_abonado, cod_cliente) {
      try {
        this.mobile_loading.customerInfo = true
        this.error = null
        
        const response = await tokenApi.get('/mobile/customer-info', {
          params: { num_abonado, cod_cliente }
        })
        this.data_mobile.customerInfo = response.data.data
        
        return { ok: true, data: response.data }
      } catch (error) {
        console.error('Error fetching mobile customer info:', error)
        this.error = error.response?.data?.message || 'Error fetching mobile customer information'
        return { ok: false, message: error.response?.data?.message || 'Error fetching mobile customer information' }
      } finally {
        this.mobile_loading.customerInfo = false
      }
    },

    // Get installments status
    async a_getInstallmentsStatus(num_abonado, cod_cliente) {
      try {
        this.mobile_loading.installments = true
        this.error = null
        
        const response = await tokenApi.get('/mobile/installments-status', {
          params: { num_abonado, cod_cliente }
        })
        this.data_mobile.installmentsStatus = response.data.data
        
        return { ok: true, data: response.data }
      } catch (error) {
        console.error('Error fetching installments status:', error)
        this.error = error.response?.data?.message || 'Error fetching installments status'
        return { ok: false, message: error.response?.data?.message || 'Error fetching installments status' }
      } finally {
        this.mobile_loading.installments = false
      }
    },

    // Get BPT beneficiarios
    async a_getBptBeneficiarios(num_abonado, cod_cliente) {
      try {
        this.mobile_loading.beneficiarios = true
        this.error = null
        
        const response = await tokenApi.get('/mobile/bpt/beneficiarios', {
          params: { num_abonado, cod_cliente }
        })
        this.data_mobile.bpt.beneficiarios = response.data.data
        
        return { ok: true, data: response.data }
      } catch (error) {
        console.error('Error fetching BPT beneficiarios:', error)
        this.error = error.response?.data?.message || 'Error fetching BPT beneficiarios'
        return { ok: false, message: error.response?.data?.message || 'Error fetching BPT beneficiarios' }
      } finally {
        this.mobile_loading.beneficiarios = false
      }
    },

    // Get BPT beneficios
    async a_getBptBeneficios(num_abonado, cod_cliente) {
      try {
        this.mobile_loading.beneficios = true
        this.error = null
        
        const response = await tokenApi.get('/mobile/bpt/beneficios', {
          params: { num_abonado, cod_cliente }
        })
        this.data_mobile.bpt.beneficios = response.data.data
        
        return { ok: true, data: response.data }
      } catch (error) {
        console.error('Error fetching BPT beneficios:', error)
        this.error = error.response?.data?.message || 'Error fetching BPT beneficios'
        return { ok: false, message: error.response?.data?.message || 'Error fetching BPT beneficios' }
      } finally {
        this.mobile_loading.beneficios = false
      }
    },

    // Load all mobile data
    async a_loadAllMobileData(num_abonado, cod_cliente) {
      try {
        this.mobile_loading.all = true
        this.error = null

        const promises = [
          this.a_getMobileDeviceInfo(num_abonado, cod_cliente), 
          this.a_getInstallmentsStatus(num_abonado, cod_cliente),
          this.a_getBptBeneficiarios(num_abonado, cod_cliente),
          this.a_getBptBeneficios(num_abonado, cod_cliente)
        ]

        const results = await Promise.allSettled(promises)
        
        const failedRequests = results.filter(result => result.status === 'rejected')
        
        if (failedRequests.length > 0) {
          console.warn('Some mobile data requests failed:', failedRequests)
          return { 
            ok: false, 
            message: `${failedRequests.length} requests failed`,
            details: failedRequests 
          }
        }

        return { ok: true, message: 'All mobile data loaded successfully' }
      } catch (error) {
        console.error('Error loading mobile data:', error)
        this.error = 'Error loading mobile data'
        return { ok: false, message: 'Error loading mobile data' }
      } finally {
        this.mobile_loading.all = false
      }
    },

    // Reset store state
    a_resetStore() {
      this.mobile_loading = { 
        deviceInfo: false, 
        customerInfo: false, 
        installments: false, 
        beneficiarios: false, 
        beneficios: false,
        all: false 
      }
      this.error = null
      this.data_mobile = {
        deviceInfo: null,
        customerInfo: null,
        installmentsStatus: null,
        bpt: {
          beneficiarios: [],
          beneficios: []
        }
      }
    },

    // Update device info
    a_updateDeviceInfo(info) {
      this.data_mobile.deviceInfo = { ...this.data_mobile.deviceInfo, ...info }
    },

    // Update customer info
    a_updateCustomerInfo(info) {
      this.data_mobile.customerInfo = { ...this.data_mobile.customerInfo, ...info }
    },

    // Update installments status
    a_updateInstallmentsStatus(status) {
      this.data_mobile.installmentsStatus = { ...this.data_mobile.installmentsStatus, ...status }
    },

    // Add beneficiario
    a_addBeneficiario(beneficiario) {
      this.data_mobile.bpt.beneficiarios.push(beneficiario)
    },

    // Remove beneficiario
    a_removeBeneficiario(beneficiarioId) {
      this.data_mobile.bpt.beneficiarios = this.data_mobile.bpt.beneficiarios.filter(b => b.id !== beneficiarioId)
    },

    // Update beneficiario
    a_updateBeneficiario(beneficiarioId, updates) {
      const index = this.data_mobile.bpt.beneficiarios.findIndex(b => b.id === beneficiarioId)
      if (index !== -1) {
        this.data_mobile.bpt.beneficiarios[index] = { ...this.data_mobile.bpt.beneficiarios[index], ...updates }
      }
    }
  }
})
