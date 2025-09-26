

import tokenApi from '@/api/tokenApi'
import { defineStore } from 'pinia'
import moment from 'moment'



export const SCLStore = defineStore('scl', {
  state: () => ({
    list_barrios:[], 
    scl_loading: { saldo:false,facturas_movil:false,getdata:false,store:false,update:false,delete:false},
    list_facturas_movil:[],
    list_operadores:[],
   
  }),
  getters: { 
  },
  actions: {
    async a_CheckPhoneSCL(phone) {
        try {  
            this.scl_loading.getdata = true 
            const response = await tokenApi.post(`scl/check-phone-portability`,{numero:phone})
           return { ok : true, dataphone:  response.data} 
        }
        catch (error) { 
          console.error(error) 
          return { ok : false, dataphone:  null}
        }
        finally {
          this.scl_loading.getdata = false
        }
      },
      async a_fetchFacturasMovil(billingAccountId)
      {

        try {  
          this.scl_loading.facturas_movil = true 
          const response = await tokenApi.get(`billing/getfacturapagomovil`,{params: { billingAccountId: billingAccountId,invoiceType:'2',startDatetime: moment().subtract(16, 'months').format('YYYY-MM-DD') }})
          this.list_facturas_movil= response.data.invoices
        }
        catch (error) { 
          console.error(error) 
          return  []
        }
        finally {
          this.scl_loading.facturas_movil = false
        }


      },
      async a_saldoVencidoMovil(billingAccountId) 
      {
        try {  
          this.scl_loading.saldo = true 
          const response = await tokenApi.get(`billing/getsaldovencidomovil`,{params: { billingAccountId: billingAccountId}})
          return response.data.dueAmount
        }
        catch (error) { 
          console.error(error) 
          return { ok : false, data:  null}
        }
        finally {
          this.scl_loading.saldo = false
        }
      }, 


      
      async a_getBodega(num_serie) 
        {
          try {   
            const response = await tokenApi.post(`scl/simcard-warehouse-validation`,{ num_serie: num_serie} )
 
            if(!response.data.data[0])
            {
              return { ok : false, data_bodega:  'No se encontró la bodega' }
            }
            return { ok : response.data.success, data_bodega:  response.data.data[0]}
          }
          catch (error) { 
            console.error(error) 
            return { ok : false, data_bodega:  null}
          } 
        }, 

        async a_actBodegaValida(bodega)
        {

          try {   
            const response = await tokenApi.post(`scl/bodegas`,{ bodega: bodega} )
            return { okvalidabodega : response.data.success, msg: response.data.msg}
          }
          catch (error) { 
            if(error.response.data.msg)
            {
              return { okvalidabodega : false, msg: error.response.data.msg}
            }
            console.error(error) 
            return { okvalidabodega : false, msg: 'Error al validar Bodega' }
          } 
        },

        
        async a_actGetOperador(num_linea)
        {
          try {    
            const response = await tokenApi.post(`portability/information-msisdn`,{ 
              nroLinea: num_linea,
              entidadLlamante: {
                  direccionEmail: "",
                  codInteraccionNegocio: "",
                  codPuntoDeVenta: "",
                  numeroTelefono: "",
                  codAplicacion: "5",
                  codUsuario: "1",
              }
          })
            if(response.status == 200)
            {
              let data = response.data.data.response
              const operador=await this.actGetOperadorName(data.codOperadoraActual)
              data.operador = operador 
              return { ok_operador : true, data_operador:  data}
            }
            return { ok_operador : false, data_operador:  null}
          }
          catch (error) { 
            console.error(error) 
            return { ok_operador : false, data_operador:  null}
          } 
        },

        async actGetOperadorName(codoperador)
        {
          try {   
            if(this.list_operadores.find(x=>x.codoperador == codoperador))
            {
              return this.list_operadores.find(x=>x.codoperador == codoperador).operador
            }
            const response = await tokenApi.post(`operator-info`,{  cod_operator: codoperador}) 
            if(response.status == 200)
            {
              this.list_operadores.push(response.data.data[0])
              return response.data.data[0].operador
            } 
          }
          catch (error) { 
            console.error(error) 
            return 'ERROR'
          } 
        },
        

        async a_validPhoneOrder(celular,simcard)
        {

          try {   
            const response = await tokenApi.post(`movil/lineasims`,{ celular: celular,simcard:simcard} )
            return { aprobado : response.data.aprobado, err: simcard+' - '+celular+':'+response.data.err}
          }
          catch (error) { 
            console.error(error) 
            return { aprobado : false, err: ''}
          } 
        },
 
      async a_fetchconsultByClient(codCliente,tipIdent,numCelular,tipoConsulta = 1)
      {
        try { 
          const formdata = new FormData();
          /* recordar que BUC cuenta_id = SCL codCliente y codcliente  = scl cod_cuenta */
          formdata.append('tipoConsulta', tipoConsulta);   /*1, CLIENTE,    2 ABONADO   3 CELULAR*/
          formdata.append('codCliente', codCliente);
          formdata.append('tipIdent', tipIdent);
          formdata.append('numCelular', numCelular);  
          
          const response = await tokenApi.post(`/scl/consultclient`, formdata);
          
          // Verificamos si existe la estructura de datos esperada
          const datosClienteDTO = response.data?.data?.ConsultaClienteDTO; 
          
          if (!datosClienteDTO) {
            console.error(`No se encontraron datos para el número ${numCelular}`);
            return {ok:false, data: null};
          }

          return {ok:true, data: datosClienteDTO}; 
           
        }
        catch (error) { 
          console.error(`Error al consultar el número ${numCelular}:`, error);
          return {ok:false, data: null};
        } 
      },
 

      async a_fetchConsultsubscriber(codCliente,codAbonado,numCelular,tipoConsulta = 3) {
        try { 
          const formdata = new FormData();
          /* recordar que BUC cuenta_id = SCL codCliente y codcliente  = scl cod_cuenta */
          formdata.append('tipoConsulta', tipoConsulta);   /*1, CLIENTE,    2 ABONADO   3 CELULAR*/
          formdata.append('codCliente', codCliente);
          formdata.append('codAbonado', codAbonado);
          formdata.append('numCelular', numCelular);  
          
          const response = await tokenApi.post(`/scl/consultsubscriber`, formdata);
          
          // Verificamos si existe la estructura de datos esperada
          const datosClienteDTO = response.data?.data?.ConsultaAbonadoDTO?.datosClienteDTO;
          const serviciosDTO = response.data?.data?.ConsultaAbonadoDTO?.serviciosDTO;
          
          if (!datosClienteDTO) {
            console.error(`No se encontraron datos para el número ${numCelular}`);
            return {ok:false, data: null};
          }
          
          let clienteData;
          
          // Si datosClienteDTO es un array, filtramos y tomamos el primero
          if (Array.isArray(datosClienteDTO)) {
            const filteredData = datosClienteDTO.filter((item) => item.codSituacion === 'AAA');
            clienteData = filteredData.length > 0 ? filteredData[0] : null;
          } 
          // Si es un objeto, verificamos si cumple la condición
          else if (typeof datosClienteDTO === 'object') {
            clienteData = datosClienteDTO.codSituacion === 'AAA' ? datosClienteDTO : null;
          }
          
          // Si no encontramos datos válidos del cliente, retornamos null
          if (!clienteData) {
            return {ok:false, data: null};
          }
          
          // Añadimos la información de servicios si existe
          if (serviciosDTO) {
            clienteData.servicios = serviciosDTO;
          }

          return {ok:true, data: clienteData};
           
        }
        catch (error) { 
          console.error(`Error al consultar el número ${numCelular}:`, error);
          return {ok:false, data: null};
        } 
      }
  },
})
