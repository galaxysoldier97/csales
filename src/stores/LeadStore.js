

import authApi from '@/api/authApi'
import tokenApi from '@/api/tokenApi'
import { defineStore } from 'pinia'
import {CustomerStore} from '@/stores/CustomerStore'
import message from '@/presets/lara/message'
'no'

export const LeadStore = defineStore('leads', {
  state: () => ({
    lead_loading: { account:false,getdata:false,store:false,update:false,delete:false},
    lead_id:null,
    data_lead:[], 
    data_question:[], 
    lead_stage:'', 
    form_lead:{   
      identification_type:'ident',
      identification_value:'',
      identification_firstname:'',
      identification_lastname:'',
      identification_email:'',
      identification_personalphone:'',
      identification_personalphone2:'',
      identification_address:'',
      barrio_id:null,
      checkbox_hogar:'new',
      barrio_text:null,
      cparty_id:null, 
      account_id:null,  
      movil:[], 
      ifhomeaccount:'no',
      ifnewaddress:'N',
      systemRegisteredPhones:[],
      portabilityOrUpgradePhones:[],
      additionalLinesCount:0,  
      phone:'',
    },
    indentification:[],
    list_eligibility:[],
    form_eligibility:[],
    ordering:[],
   
  }),
  getters: {
    g_portabilityOrUpgradePhones() {
      return this.data_lead.identification.identification.portabilityOrUpgradePhones.filter(item => item.codOperadoraActual!='Grupo de Comunicaciones Digitales')
    },
    g_systemRegisteredPhonesPOS() {
      return this.data_lead.identification.identification.systemRegisteredPhones.filter(item => item.Tipo=='postpago')
    },
    
    g_systemRegisteredPhonesPRE() {
      const systemRegisteredPhonesPRE = this.data_lead.identification.identification.systemRegisteredPhones.filter(item => item.Tipo=='prepago'); 
      const portabilityOrUpgradePhones = this.data_lead.identification.identification.portabilityOrUpgradePhones.filter(item => item.codOperadoraActual=='Grupo de Comunicaciones Digitales');
      
      return [...systemRegisteredPhonesPRE, ...portabilityOrUpgradePhones];
    },
    g_formEligibility() { 
      return this.list_eligibility.filter(item => item.checked)
    },
    g_filteredEligibility() {
      return (filterNegocio) => {
        let clasification_includes = [];
    
        if (filterNegocio.hogar) {
          clasification_includes.push("1",1);
        }
        
        if (filterNegocio.vas) {
          clasification_includes.push( "2", 2);
        }

        if (filterNegocio.movil) {
          clasification_includes.push("3", "4",3,4);
        }
        if (filterNegocio.vasMovil) {
          clasification_includes.push("3",3);
        }
        if (filterNegocio.convergencia) {
          clasification_includes.push("6", "7", "8",6,7,8);
        }
    
        if (!filterNegocio.hogar && !filterNegocio.movil && !filterNegocio.convergencia && !filterNegocio.vas && !filterNegocio.vasMovil) {
          return this.list_eligibility;
        }
    
        return this.list_eligibility.filter(item => 
          clasification_includes.includes(item.clasification_id)
        );
      }
    }, 
  },
  actions: { 
    async a_CreateLead() {
      try {  
          this.lead_loading.store = true 
          const response = await tokenApi.post(`leads/orchestration/new`,this.form_lead)
          this.lead_id = response.data.ID 

          await this.a_NextQuestion() 
      }
      catch (error) { 
        console.error(error) 
      }
      finally {
        this.lead_loading.store = false
      }
    },
    async a_CreateLeadBulkAnswer() {
      try {  
          this.lead_loading.store = true 
          this.list_eligibility = []
          this.form_eligibility = [] 
          const response = await tokenApi.post(`leads/orchestration/new_bulk_answers`,this.form_lead) 
          this.lead_id = response.data.ID
          await this.a_NextQuestion() 
          return { ok : true, message: 'Lead creado correctamente'}
      }
      catch (error) { 
        console.error(error) 
        if(error.response.data.errors)
         {return { ok : false,  errors: error.response.data.errors}}
        else
        {return { ok : false,  errors: null}}
      }
      finally {
        this.lead_loading.store = false
      }
    },

    async a_LoadLead(order) {
      this.lead_id = order.lead_id
      this.form_lead.identification_value= order.identification_value
      await this.a_NextQuestion()
    },
    async a_LoadEligibility(offers) {
      this.list_eligibility = offers
    },
    async a_NextQuestion() {
      try {  
          this.lead_loading.getdata = true 
          const response = await tokenApi.get(`leads/orchestration/${this.lead_id}/next_question`)
          this.data_question = response.data 
          this.lead_stage= response.data.stage
          if(this.lead_stage=='SelectEligibility')
          {
            const data = response.data.data.answer.options
            data.map((item) => 
            {
              item.checked = false
              item.quantity = 1
            })
            this.list_eligibility=data
          }
          else if(this.lead_stage=='Ordering_Simcard')
          {
            const data = response.data.data.answer.input_required
            data.map((item) => 
            {
              item.status=null
            })
            this.data_question.data.answer.input_required = data
          }

          await this.a_getData()
      }
      catch (error) { 
        console.error(error) 
      }
      finally {
        this.lead_loading.getdata = false
      }
    },
    

    async a_storeAnswer(answer)
    {
      try {  
          this.lead_loading.store = true

          const payload = {
            answer, // The answer array is sent directly
            lead_id: this.lead_id,
            stage: this.lead_stage
          }; 
          const response = await tokenApi.post(`leads/orchestration/${this.lead_id}/answer`,payload) 
          if(response.data.success)
          {
            await this.a_NextQuestion()
          }
          return { ok : true}
      }
      catch (error) { 
        console.error(error) 
        return { ok : false}
      }
      finally {
        this.lead_loading.store = false
      }
    },

    async a_setAccount_id(account_id) {
      this.form_lead.checkbox_hogar = account_id
    },
    async a_setDatosClienteLead()
    { 
      const {data_buc,list_contactosBUC} =  CustomerStore();  

      if(data_buc && data_buc.length>0)
      {   
          this.form_lead.identification_firstname = data_buc[0]?.Des_nombre || null;
          this.form_lead.identification_lastname = data_buc[0]?.Des_apellido || null;
          //this.form_lead.identification_personalphone = list_contactosBUC.find(item => item.Tipo=='Número de teléfono del contacto')?.Valor || null;
          this.form_lead.identification_address = data_buc[0]?.Direccion || null;
      }  
      if(list_contactosBUC && list_contactosBUC.length>0)
      {
        this.form_lead.identification_email = list_contactosBUC.find(item => item.Tipo === 'E-mail')?.Valor || null;
      }
        
    },
    a_updateTelefonos(data)
    { 
      console.log(data)
      console.log(data.phone2)
      this.form_lead.identification_personalphone=parseInt(data.phone1);
      this.form_lead.identification_personalphone2 = parseInt(data.phone2);
    },
    async a_updateLeadAccountData(barrio_id,cuenta,cliente,direccion) 
    { 
        this.lead_loading.account = true
        this.form_lead.barrio_id = barrio_id

        this.form_lead.identification_address = direccion
        if(cuenta)
        {
          this.form_lead.account_id=  cuenta 
          this.form_lead.ifhomeaccount = 'owner'
          this.form_lead.ifnewaddress = 'N'
          this.form_lead.cparty_id=  cliente
          this.form_lead.checkbox_hogar=cuenta

            const {a_fetchHomeContracts, a_fetchFacturasHogar} = CustomerStore()

            await Promise.all([
              a_fetchHomeContracts(cuenta),
              //a_fetchFacturasHogar(cliente, cuenta)
            ]);
        } 
        else{
          this.form_lead.account_id=null
          this.form_lead.ifnewaddress = 'Y'
        }
        
        this.lead_loading.account = false 
    },
    
    async a_getData() {
      try {   
          const response = await tokenApi.get(`leads/orchestration/${this.lead_id}/data`)
          this.data_lead = response.data  
      }
      catch (error) { 
        console.error(error) 
      } 
    },

    
    async a_SendEmail(lead_id) 
    {
      const response = await tokenApi.post(`emaillead`,{id:lead_id})
      return response.data
    },
    a_reseteligibility() {
      this.list_eligibility = []
      this.form_eligibility = []
    },
    a_setIdentification(identification_value)
    {
      this.form_lead.identification_value = identification_value
    },

    async a_updateMatchDigitalOwner(email,phone)
    { 
      const response = await tokenApi.post(`leads/orchestration/${this.lead_id}/updateMatchDigitalOwner`,{email:email,phone:phone})
      return {ok:true} 
    },

    
    async a_resendMatchDigitalOwner(email,phone)
    { 
      const response = await tokenApi.post(`leads/orchestration/${this.lead_id}/resendMatchDigitalOwner`)
      return {ok:true} 
    },

    
    a_resetLead() {
      const identification_value = this.form_lead.identification_value
      this.lead_id = null
      this.data_lead = []
      this.lead_stage = ''
      this.form_lead = {   
        identification_type:'ident',
        identification_value:identification_value,
        identification_firstname:'',
        identification_lastname:'',
        identification_email:'',
        identification_personalphone:'',
        identification_address:'',
        barrio_id:null,
        checkbox_hogar:'new',
        barrio_text:null,
        cparty_id:null, 
        account_id:null,  
        movil:[], 
        ifhomeaccount:'N',
        ifnewaddress:'N',
        systemRegisteredPhones:[],
        portabilityOrUpgradePhones:[],
        additionalLinesCount:0,  
        phone:'',
      }
      this.indentification = []
      this.list_eligibility = []
      this.form_eligibility = []
      this.ordering = []
    },
     
  },
})

 