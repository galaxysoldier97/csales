

import authApi from '@/api/authApi'
import tokenApi from '@/api/tokenApi'
import { defineStore } from 'pinia'
import { fn_groupContracts } from '@/helpers/OfferHelper'
import { LeadStore } from '@/stores/LeadStore'
import { SCLStore } from '@/stores/SCLStore'
import { storeToRefs } from 'pinia';


export const CustomerStore = defineStore('customer', {
  state: () => ({
    list_accounts:[],
    data_buc:null,
    list_movilcuentas:[],
    list_contactosBUC:[],
    list_phones:[],
    account_loading: { phones:false,contracts:false, facturas:false,saldos:false,saldosMovil:false, getdata:false,store:false,update:false,delete:false},
    list_facturas_hogar: [],
    list_facturas_movil: [],
    list_TVcontracts: [],
    list_TELcontracts: [],
    list_INTcontracts: [],
    list_MOVcontracts: [],
    data_reference: [],
  }),

  getters: {
    list_phones_activos: (state) => {
      return state.list_phones.filter(item => item.Estado === 'Activo');
    },
    countCableModen:(state) => {
      return state.list_INTcontracts.filter(item => item.name.includes('Cable Modem')).length
    },
    allSaldoVencidoHogar: (state) => {
      return state.list_accounts.reduce((acc, account) => {
        return acc + account.saldo_vencido
      }, 0.00)
    },
    allSaldoVencidoMovil: (state) => {
      return state.list_movilcuentas.reduce((acc, account) => {
        return acc + account.saldo_vencido
      }, 0.00)
    },
    contracts_TV: (state) => {
      return state.list_contracts.filter(contract => contract.productType === 'Televisión' && contract.name != 'Addons')[0];
 
    },

    g_findReference: (state) => (cuenta) => {
      return state.data_reference.find(ref => ref.cuenta == cuenta);
    },

    g_list_account_activo:(state) => {
      return state.list_accounts.filter(item => item.Estado === 'Activo');
    },
  },

  actions: 
  {
 
    async a_fetchcontactosBUC(id) {

      const response = await authApi.get('contactosbuc',{params: {value: id, type: 'identificacion'}}) 
      const datajson = response.data;
      this.list_contactosBUC= datajson; 
    },
    async a_fetchBUC(id) {
      try {   
          this.account_loading.getdata = true 
          const response = await authApi.get('registrobuc',{params: {value: id, type: 'identificacion'}})
          const datajson =  JSON.parse(JSON.stringify( response.data))
          if (typeof datajson === 'object' && datajson.length > 0) 
          {
              this.data_buc = datajson; 
              const data_accounts= this.data_buc.filter(item => item.Sistema === 'Fijo')
                await this.a_checkIdReference(id); 
                this.list_accounts = data_accounts.map(item => {
                const reference = this.g_findReference(item.Cuenta);
                return {
                  ...item,
                  tipoclienteRef: reference ? reference.tipocliente : null
                };
                });
              const data_movil= this.data_buc.filter(item => item.Sistema === 'Movil')
              this.list_movilcuentas= data_movil
              const flattenedData = data_movil.flatMap(item => {
                return item.Servicios.map(service => ({
                    celular: service.celular,
                    Nombre: item.Nombre,
                    Des_nombre: item.Des_nombre,
                    Des_apellido: item.Des_apellido,
                    ID: item.ID,
                    Direccion: item.Direccion,
                    Cliente: item.Cliente,
                    Cuenta: item.Cuenta,
                    Segmento: item.Segmento,
                    Convergente: item.Convergente,
                    Identidad: item.Identidad,
                    Cedula: item.Cedula,
                    Estado: item.Estado,
                    Tipo: item.Tipo,
                    score: item.score,
                    personalizado: item.personalizado,
                    TipoCliente: item.TipoCliente,
                    prom_recarga: service.prom_recarga,
                    monto_deuda: service.monto_deuda,
                    apto_pre2pos: service.apto_pre2pos
                }));
              });
              this.list_phones = flattenedData 
          }
      }
      catch (error) { 
        console.error(error) 
        this.data_buc=null
      }
      finally {
        this.account_loading.getdata = false
      }
    },    
    async a_checkIdReference(id) 
    {
      try {
        const response = await authApi.post('orden/checkIdReference',{Id: id, Vendedor: -1})
        this.data_reference = response.data.detail
      }catch (error) {
        console.error(error)
      }
    },
    async a_CheckPhoneBUC(phone) {
      try {   
          const response = await authApi.get(`getdatacelnum`,{ params: {numero: phone}}) 
          if(response.data.success)
            {
              return { okbuc : true, bucphone: response.data.data}
            }
         return  { okbuc : false, bucphone: []}
      }
      catch (error) {  
        return  { okbuc : false, bucphone: []}
      } 
    },


    async a_saldoVencidogMovilList() {
      const {a_saldoVencidoMovil} = SCLStore()
      this.account_loading.saldosMovil = true;
      this.list_movilcuentas.map(async (account) => {
        const saldo_vencido = await a_saldoVencidoMovil(account.Cliente); 
        account.saldo_vencido = saldo_vencido;
      });
      this.account_loading.saldosMovil = false;
    },
    async a_saldoVencidoHogarList() {
      const {form_lead} = storeToRefs(LeadStore());
      this.account_loading.saldos = true;
      const promises = this.list_accounts.flatMap(account => [
          this.a_saldoVencidoHogar(account.Cliente, account.Cuenta)
              .then(saldo_vencido => { account.saldo_vencido = saldo_vencido; }),
          this.a_matchDigital(account.Cuenta, form_lead.value.identification_value)
              .then(matchdigital => { account.matchdigital = matchdigital; })
      ]);
      await Promise.all(promises);
      this.account_loading.saldos = false;
    },
    async a_saldoVencidoHogar(cparty_id,account_id)
    {
      try {    
        const response = await authApi.get('billing/getsaldovencidofijo',{params: { cparty_id: cparty_id, account_id: account_id}})
       return response.data.total_dueAmount
      }
      catch (error) {
        console.error(error) 
      } 
    },

    async a_matchDigital(mainaccount_id,cedula)
    {

      try {    
        const response = await authApi.get('/customer/check-matchdigital',{params: { mainaccount_id: mainaccount_id, cedula: cedula}})
        const value = response.data.response.available
        //set to list_account
        this.list_accounts.find(item => item.Cuenta === mainaccount_id).matchdigital = value
        return value
      }
      catch (error) {
        console.error(error) 
      }
    },

    async a_fetchPhoneMovilPlans() {
    try {
      const { a_fetchConsultsubscriber,a_fetchconsultByClient } = SCLStore()
      this.account_loading.phones_plans = true

    // Process phones in parallel for better performance
    const phonePromises = this.list_phones.map(async (item) => {
      try {
        // Fetch contracts first
        const contractResult = await a_fetchConsultsubscriber(null, null, item.celular, 3)
        if (!contractResult.ok || !contractResult.data) {
          console.warn(`Failed to fetch contracts for phone: ${item.celular}`)
          return
        }
        
        item.contracts = contractResult.data

        // Only proceed if we have contracts with required data
        if (!item.contracts?.codCliente || !item.contracts?.numAbonado) {
          console.warn(`Missing required contract data for phone: ${item.celular}`)
          return
        }

        // Fetch customer data and subscriber data in parallel
        const [clienteResult] = await Promise.all([
          a_fetchconsultByClient(item.contracts.codCliente, null, null, 1), 
        ])

        // Assign results if successful
        if (clienteResult.ok && clienteResult.data) {
          item.data_cliente = clienteResult.data
        } else {
          console.warn(`Failed to fetch cliente data for: ${item.contracts.codCliente}`)
        }
 

      } catch (itemError) {
        console.error(`Error processing phone ${item.celular}:`, itemError)
      }
    })

    // Wait for all phone processing to complete
    await Promise.all(phonePromises)

  } catch (error) {
    console.error('Error in a_fetchPhoneMovilPlans:', error)
  } finally {
    this.account_loading.phones_plans = false
  }
},

    a_fetchFacturasHogar: async function (cparty_id,cpartyaccount_id) {
      try {
        this.account_loading.facturas = true
        const response = await authApi.get('billing/facturas',{params: { cparty_id: cparty_id, cpartyaccount_id: cpartyaccount_id}})
        const data = response.data
    
        data.forEach(item => {
          item.flag_descargar = false;
        });
        this.list_facturas_hogar = data;
      }
      catch (error) {
        this.list_facturas_hogar = []
        console.error(error)
      }
      finally {
        this.account_loading.facturas = false
      }
    },
    a_PDFFacturasHogar: async function (documentId) {
      try { 
        const response = await authApi.get('billing/getdetallefactura', {
          params: { documentId: documentId, mediaType: 'pdf-home' },
          responseType: 'arraybuffer'  // This is crucial for receiving binary data
        });
        return response.data;  // This will be the ArrayBuffer
      }
      catch (error) { 
        console.error(error);
        throw error;  // Rethrow the error so it can be caught in fn_PDFFacturasHogar
      } 
    },

    
    a_PDFFacturasMovil: async function (documentId) {
      try { 
        const response = await authApi.get('billing/getdetallefactura', {
          params: { documentId: documentId, mediaType: 'pdf' },
          responseType: 'arraybuffer'  // This is crucial for receiving binary data
        });
        return response.data;  // This will be the ArrayBuffer
      }
      catch (error) { 
        console.error(error);
        throw error;  // Rethrow the error so it can be caught in fn_PDFFacturasHogar
      } 
    }, 
    async a_fetchHomeContracts(account_id) {
      try {
        this.account_loading.contracts = true;
        const response = await authApi.get(`/customer/id=${account_id}&type=accountId`);
        const data = response.data.response.accounts[0].products;
        
        const datagrouped = fn_groupContracts(data);
        
        this.list_TVcontracts = datagrouped.filter(contract => contract.productType === 'Televisión');
        
        const data_TEL_INT = datagrouped.filter(contract => contract.productType === 'Telefonía & Internet');
        
        this.list_INTcontracts = data_TEL_INT.map(contract => ({
          ...contract,
          childProducts: contract.childProducts?.filter(child => child.name !== 'Cablephone') || []
        }));
        
        this.list_TELcontracts = data_TEL_INT.map(contract => ({
          ...contract,
          childProducts: contract.childProducts?.filter(child => child.name === 'Cablephone') || []
        }));
      } catch (error) {
        console.error('Error fetching home contracts:', error);
        this.list_TVcontracts=[]
        this.list_TELcontracts=[]
        this.list_INTcontracts=[]
        
      } finally {
        this.account_loading.contracts = false;
      }
    },

    async a_fetchTelefonos(suscriptor) {

      try
      {
        
        const response = await authApi.get('orden/telefonoclientetytan/'+suscriptor)
        return {data: response.data.response, ok: true}
      } 
      catch (error) {
        console.error(error)
        return  {data: [], ok: false}
      } 

    },

    async a_getAccountFromCliente(cliente) {
      try { 
        const response = await authApi.get('customer/id='+cliente+'&type=suscriptionId');
        return response.data.response.accounts; 
      } catch (error) {
        console.error(error);
        return false;
        }
    },  


    async a_getDataFromSuscriber(cliente,cuenta) {
      try { 
        const response = await authApi.get('customer/id='+cliente+'&type=suscriptionId');
        const accounts = response.data.response.accounts;
        const account = accounts.find(account => account.accountId === cuenta);

        //get the first phone starting with 6
        const phone = account.general.phones.find(phone => phone.startsWith('6'));


        return {  ok: true, email: account.general.email, phone: phone};
      } catch (error) {
        console.error(error);
        return { ok: false, email: '', phone: ''};
        }
    },  

    async a_RefreshinAccount(identification)
    { 
      try { 
        const response = await authApi.post('fastAgregarBUC',{identification: identification})
        return { ok: true, data: response.data.response} 
        } catch (error) {
          console.error(error);
          return { ok: false, data: null}
          }
    }, 

    async a_mobileCustomer(cod_cliente)
    {
      try {   
        const response = await tokenApi.post(`mobile/customer`,{ cod_cliente: cod_cliente} )
        if(response.status == 200)
        {
          return { ok: true, data: response.data.data }
        }
        return { ok: false, data: null}
      }
      catch (error) { 
        console.error(error) 
        return { ok: false, data: null}
      } 
    },

    async a_mobileDevice(cod_cliente)
    {
      try {   
        const response = await tokenApi.post(`mobile/device`,{ cod_cliente: cod_cliente} )
        if(response.status == 200)
        {
          return { ok: true, data: response.data.data }
        }
        return { ok: false, data: null}
      }
      catch (error) { 
        console.error(error) 
        return { ok: false, data: null}
      } 
    },

    async a_mobileInstallments(cod_cliente)
    {
      try {   
        const response = await tokenApi.post(`mobile/installments`,{ cod_cliente: cod_cliente} )
        if(response.status == 200)
        {
          return { ok: true, data: response.data.data }
        }
        return { ok: false, data: null}
      }
      catch (error) { 
        console.error(error) 
        return { ok: false, data: null}
      } 
    },

    async a_mobileBenefits(cod_cliente)
    {
      try {   
        const response = await tokenApi.post(`mobile/benefits`,{ cod_cliente: cod_cliente} )
        if(response.status == 200)
        {
          return { ok: true, data: response.data.data }
        }
        return { ok: false, data: null}
      }
      catch (error) { 
        console.error(error) 
        return { ok: false, data: null}
      } 
    },

    a_resetCustomer()
    {
      this.list_accounts=[]
      this.data_buc=null,
      this.list_movilcuentas=[]
      this.list_contactosBUC=[]
      this.list_phones=[]
      this.account_loading= { phones:false,contracts:false, facturas:false,saldos:false,saldosMovil:false, getdata:false,store:false,update:false,delete:false},
      this.list_facturas_hogar= []
      this.list_facturas_movil= []
      this.list_TVcontracts= []
      this.list_TELcontracts= []
      this.list_INTcontracts= []
      this.list_MOVcontracts= []
      this.data_reference= []

    }
  },
})
