<template>
    <Dialog class="lg:w-1/2 w-full" v-model:visible="visible" modal :header="'Detalle del Servicio - ' + (phoneData?.celular || '')" 
             :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        
        <div v-if="phoneData" class="space-y-4">
            <!-- Información básica del teléfono -->
            <div class="bg-surface-50 dark:bg-surface-700 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Información General</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Número:</strong> {{ phoneData.celular }}
                        </p>
                        <p class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Tipo:</strong> 
                            <span class="px-2 py-1 text-xs font-semibold rounded-full" 
                                  :class="phoneData.Tipo.toLowerCase() === 'prepago' ? 'bg-primary-100 text-primary-800' : 'bg-green-100 text-green-800'">
                                {{ phoneData.Tipo }}
                            </span>
                        </p>
                        <p class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Personalizado:</strong> 
                            <span :class="phoneData.personalizado === 'Y' ? 'text-green-600' : 'text-red-600'">
                                {{ phoneData.personalizado === 'Y' ? 'SÍ' : 'NO' }}
                            </span>
                        </p>
                    </div>
                    <div v-if="phoneData.Tipo.toLowerCase() === 'prepago'">
                        <p class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Apto Pre a Pos:</strong> 
                            <span :class="phoneData.apto_pre2pos === 'Y' ? 'text-green-600' : 'text-red-600'">
                                {{ phoneData.apto_pre2pos === 'Y' ? 'SÍ' : 'NO' }}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Información del cliente -->
            <div v-if="phoneData.data_cliente" class="bg-surface-50 dark:bg-surface-700 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Información del Cliente</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div v-if="phoneData.data_cliente.apodNombre">
                        <p class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Nombre:</strong> {{ phoneData.data_cliente.apodNombre }}
                        </p>
                    </div>
                    <div v-if="phoneData.data_cliente.apodNumIdent">
                        <p class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Cédula:</strong> {{ phoneData.data_cliente.apodNumIdent }}
                        </p>
                    </div>
                    <div v-if="phoneData.data_cliente.nomEmail">
                        <p class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Email:</strong> {{ phoneData.data_cliente.nomEmail }}
                        </p>
                    </div>
                    <div v-if="phoneData.data_cliente.codCiclo">
                        <p class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Ciclo:</strong> {{ phoneData.data_cliente.codCiclo }}
                        </p>
                    </div>
                    <div v-if="phoneData.data_cliente.codCategoria">
                        <p class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Categoría:</strong> {{ phoneData.data_cliente.codCategoria }}
                        </p>
                    </div>
                    <div v-if="phoneData.data_cliente.cantAbonActivo">
                        <p class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Cant. Líneas Activas:</strong> {{ phoneData.data_cliente.cantAbonActivo }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Información del contrato -->
            <div v-if="phoneData.contracts" class="bg-surface-50 dark:bg-surface-700 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Información del Abonado</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Cliente:</strong> {{ phoneData.contracts.codCliente }}
                        </p>
                        <p v-if="phoneData.contracts.codplantarif" class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Plan:</strong> {{ phoneData.contracts.codplantarif }}
                        </p>
                        <p v-if="phoneData.contracts.nomUsuario" class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Nombre:</strong> {{ phoneData.contracts.nomUsuario }}
                        </p>
                        <p v-if="phoneData.contracts.nomApellido1" class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Apellido:</strong> {{ phoneData.contracts.nomApellido1 }}
                        </p>
                        <p v-if="phoneData.contracts.numIdent" class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Cédula:</strong> {{ phoneData.contracts.numIdent }}
                        </p>
                    </div>
                    <div>
                        <p v-if="phoneData.contracts.numAbonado" class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Núm. Abonado:</strong> {{ phoneData.contracts.numAbonado }}
                        </p>
                        <p v-if="phoneData.contracts.numCelular" class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Núm. Celular:</strong> {{ phoneData.contracts.numCelular }}
                        </p>
                        <p v-if="phoneData.contracts.numIMEI" class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>IMEI:</strong> {{ phoneData.contracts.numIMEI }}
                        </p>
                        <p v-if="phoneData.contracts.numSerie" class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Núm. Serie:</strong> {{ phoneData.contracts.numSerie }}
                        </p>
                        <p v-if="phoneData.contracts.codSituacion" class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Situación:</strong> {{ phoneData.contracts.codSituacion }}
                        </p>
                    </div>
                    <div>
                        <p v-if="phoneData.contracts.fecAlta" class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Fecha Alta:</strong> {{ moment(phoneData.contracts.fecAlta).format('DD/MM/YYYY') }}
                        </p>
                        <p v-if="phoneData.contracts.fecFinContrato" class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Fecha Baja:</strong> {{ moment(phoneData.contracts.fecFinContrato).format('DD/MM/YYYY') }}
                        </p>
                        <p v-if="phoneData.contracts.numMeses" class="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Núm. Meses:</strong> {{ phoneData.contracts.numMeses }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Información adicional del servicio móvil (datos del MobileStore) -->
            <div v-if="phoneData.mobileData" class="space-y-4">
                
                <!-- Información del dispositivo -->
                <div v-if="phoneData.mobileData.deviceInfo" class="bg-surface-50 dark:bg-surface-800 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                        Información del Dispositivo
                        <span v-if="Array.isArray(phoneData.mobileData.deviceInfo)" class="text-sm font-normal text-gray-500 dark:text-gray-400">
                            ({{ phoneData.mobileData.deviceInfo.length }} {{ phoneData.mobileData.deviceInfo.length === 1 ? 'dispositivo' : 'dispositivos' }})
                        </span>
                    </h3>
                    
                    <!-- Si deviceInfo es un array de dispositivos -->
                    <div v-if="Array.isArray(phoneData.mobileData.deviceInfo) && phoneData.mobileData.deviceInfo.length > 0" class="space-y-4">
                        <div v-for="(device, index) in phoneData.mobileData.deviceInfo" :key="index" 
                             class="border border-surface-200 dark:border-surface-600 rounded-lg p-4 bg-white dark:bg-surface-700">
                            <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3"> 
                                <span v-if="device.descripcion" class=" ">
                                    - {{ device.descripcion }}
                                </span>
                            </h4>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                <!-- Información básica -->
                                <div v-if="device.num_abonado" class="bg-primary-50 dark:bg-primary-900/20 rounded p-2">
                                    <p class="text-xs text-primary-600 dark:text-primary-400">Número Abonado</p>
                                    <p class="text-sm font-medium text-primary-800 dark:text-primary-200">{{ device.num_abonado }}</p>
                                </div>
                                
                                <div v-if="device.num_celular" class="bg-primary-50 dark:bg-primary-900/20 rounded p-2">
                                    <p class="text-xs text-primary-600 dark:text-primary-400">Número Celular</p>
                                    <p class="text-sm font-medium text-primary-800 dark:text-primary-200">{{ device.num_celular }}</p>
                                </div>
                                
                                <div v-if="device.cod_cliente" class="bg-surface-100 dark:bg-surface-600 rounded p-2">
                                    <p class="text-xs text-gray-500 dark:text-gray-400">Código Cliente</p>
                                    <p class="text-sm font-medium text-gray-800 dark:text-white">{{ device.cod_cliente }}</p>
                                </div>
                                
                                <div v-if="device.cod_ciclo" class="bg-surface-100 dark:bg-surface-600 rounded p-2">
                                    <p class="text-xs text-gray-500 dark:text-gray-400">Ciclo</p>
                                    <p class="text-sm font-medium text-gray-800 dark:text-white">{{ device.cod_ciclo }}</p>
                                </div>
                                
                                <!-- Información de contrato -->
                                <div v-if="device.meses_cont" class="bg-blue-50 dark:bg-blue-900/20 rounded p-2">
                                    <p class="text-xs text-blue-600 dark:text-blue-400">Meses Contrato</p>
                                    <p class="text-sm font-medium text-blue-800 dark:text-blue-200">{{ device.meses_cont }}</p>
                                </div>
                                
                                <div v-if="device.meses_transc" class="bg-blue-50 dark:bg-blue-900/20 rounded p-2">
                                    <p class="text-xs text-blue-600 dark:text-blue-400">Meses Transcurridos</p>
                                    <p class="text-sm font-medium text-blue-800 dark:text-blue-200">{{ device.meses_transc }}</p>
                                </div>
                                
                                <!-- Información monetaria -->
                                <div v-if="device.monto_equipo" class="bg-green-50 dark:bg-green-900/20 rounded p-2">
                                    <p class="text-xs text-green-600 dark:text-green-400">Monto Equipo</p>
                                    <p class="text-sm font-medium text-green-800 dark:text-green-200">${{ device.monto_equipo }}</p>
                                </div>
                                
                                <div v-if="device.monto_subsidio" class="bg-green-50 dark:bg-green-900/20 rounded p-2">
                                    <p class="text-xs text-green-600 dark:text-green-400">Monto Subsidio</p>
                                    <p class="text-sm font-medium text-green-800 dark:text-green-200">${{ device.monto_subsidio }}</p>
                                </div>
                                
                                <div v-if="device.monto_pendiente" class="bg-orange-50 dark:bg-orange-900/20 rounded p-2">
                                    <p class="text-xs text-orange-600 dark:text-orange-400">Monto Pendiente</p>
                                    <p class="text-sm font-medium text-orange-800 dark:text-orange-200">${{ device.monto_pendiente }}</p>
                                </div>
                                
                                <!-- Información del equipo -->
                                <div v-if="device.num_serie" class="bg-surface-100 dark:bg-surface-600 rounded p-2">
                                    <p class="text-xs text-gray-500 dark:text-gray-400">Número de Serie</p>
                                    <p class="text-sm font-medium text-gray-800 dark:text-white">{{ device.num_serie }}</p>
                                </div>
                            </div>
                            
                            <!-- Fechas importantes -->
                            <div class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                                <div v-if="device.fecha_fincont" class="text-xs">
                                    <span class="text-gray-500 dark:text-gray-400">Fin Contrato:</span>
                                    <p class="font-medium text-gray-800 dark:text-white">{{ moment(device.fecha_fincont).format('DD/MM/YYYY HH:mm') }}</p>
                                </div>
                                
                                <div v-if="device.fecha_cambioeq" class="text-xs">
                                    <span class="text-gray-500 dark:text-gray-400">Cambio Equipo:</span>
                                    <p class="font-medium text-gray-800 dark:text-white">{{ moment(device.fecha_cambioeq).format('DD/MM/YYYY HH:mm') }}</p>
                                </div>
                                
                                <div v-if="device.fecha_modif" class="text-xs">
                                    <span class="text-gray-500 dark:text-gray-400">Última Modificación:</span>
                                    <p class="font-medium text-gray-800 dark:text-white">{{ moment(device.fecha_modif).format('DD/MM/YYYY HH:mm') }}</p>
                                </div>
                            </div>
                            
                            <!-- Información adicional -->
                            <div v-if="device.causa_cambioeq && device.causa_cambioeq !== '-1'" class="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                <strong>Causa Cambio Equipo:</strong> {{ device.causa_cambioeq }}
                            </div>
                            
                            <!-- Descripción completa si existe -->
                            <div v-if="device.descripcion" class="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                                <strong>Descripción:</strong> {{ device.descripcion }}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Si deviceInfo es un objeto simple (fallback al comportamiento anterior) -->
                    <div v-else-if="!Array.isArray(phoneData.mobileData.deviceInfo)" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div v-for="(value, key) in phoneData.mobileData.deviceInfo" :key="key">
                            <p class="text-sm text-gray-600 dark:text-gray-300">
                                <strong>{{ formatKey(key) }}:</strong> {{ value }}
                            </p>
                        </div>
                    </div>
                    
                    <!-- Si es un array pero está vacío -->
                    <div v-else-if="Array.isArray(phoneData.mobileData.deviceInfo) && phoneData.mobileData.deviceInfo.length === 0" class="text-center py-4">
                        <p class="text-sm text-gray-500 dark:text-gray-400">No hay información de dispositivos disponible</p>
                    </div>
                </div>
 
                <!-- Estado de cuotas -->
                <div v-if="phoneData.mobileData.installmentsStatus" class="bg-primary-50 dark:bg-primary-800 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Información de Cuotas</h3>
                    
                    <!-- Si installmentsStatus es un array de cuotas -->
                    <div v-if="Array.isArray(phoneData.mobileData.installmentsStatus) && phoneData.mobileData.installmentsStatus.length > 0" class="space-y-6">
                        <!-- Iterar por cada grupo de num_secuenci -->
                        <div v-for="(grupoData, numSecuenci) in groupedInstallments" :key="numSecuenci" 
                             class="border border-primary-300 dark:border-primary-500 rounded-lg p-4 bg-white dark:bg-surface-700">
                            
                            <!-- Título del grupo con num_secuenci -->
                            <div class="flex justify-between items-center mb-4 pb-2 border-b border-primary-200 dark:border-primary-600">
                                <h4 class="text-lg font-semibold text-primary-800 dark:text-primary-200">
                                    Secuencia #{{ numSecuenci }} 
                                </h4>
                                <!-- Total del importe_debe -->
                                <div class="text-right">
                                    <p class="text-xs text-gray-500 dark:text-gray-400">Total Importe Debe (Pendiente)</p>
                                    <p class="text-lg font-bold text-red-600 dark:text-red-400">${{ grupoData.totalImporteDebe.toFixed(2) }}</p>
                                </div>
                            </div>
                            
                            <!-- Cuotas dentro del grupo -->
                            <div class="space-y-4">
                                <div v-for="(cuota, index) in grupoData.cuotas" :key="`${numSecuenci}-${cuota.sec_cuota}`" 
                                     class="border border-primary-200 dark:border-primary-600 rounded-lg p-4 bg-white dark:bg-surface-800">
                                    <h5 class="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                                        Cuota #{{ cuota.sec_cuota }}
                                        <span v-if="cuota.num_cuota" class="text-xs text-gray-500"> / {{ cuota.num_cuota }}</span>
                                    </h5>
                                    
                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        <!-- Información básica -->
                                        <div v-if="cuota.letra" class="bg-surface-100 dark:bg-surface-700 rounded p-2">
                                            <p class="text-xs text-gray-500 dark:text-gray-400">Letra</p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white">{{ cuota.letra }}</p>
                                        </div>
                                        
                                        <div v-if="cuota.cod_centremi" class="bg-surface-100 dark:bg-surface-700 rounded p-2">
                                            <p class="text-xs text-gray-500 dark:text-gray-400">Centro Emisor</p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white">{{ cuota.cod_centremi }}</p>
                                        </div>
                                        
                                        <div v-if="cuota.cod_concepto" class="bg-surface-100 dark:bg-surface-700 rounded p-2">
                                            <p class="text-xs text-gray-500 dark:text-gray-400">Concepto</p>
                                            <p class="text-sm font-medium text-gray-800 dark:text-white">{{ cuota.cod_concepto }}</p>
                                        </div>
                                        
                                        <!-- Importes -->
                                        <div v-if="cuota.importe_debe" class="bg-red-50 dark:bg-red-900/20 rounded p-2">
                                            <p class="text-xs text-red-600 dark:text-red-400">Importe Debe</p>
                                            <p class="text-sm font-medium text-red-800 dark:text-red-200">${{ cuota.importe_debe }}</p>
                                        </div>
                                        
                                        <div v-if="cuota.importe_haber" class="bg-green-50 dark:bg-green-900/20 rounded p-2">
                                            <p class="text-xs text-green-600 dark:text-green-400">Importe Haber</p>
                                            <p class="text-sm font-medium text-green-800 dark:text-green-200">${{ cuota.importe_haber }}</p>
                                        </div>
                                        
                                        <!-- Estados -->
                                        <div class="bg-primary-50 dark:bg-primary-800 rounded p-2">
                                            <p class="text-xs text-primary-600 dark:text-primary-400">Estado</p>
                                            <div class="flex gap-1 mt-1">
                                                <span v-if="cuota.ind_contado === '1'" class="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full">Contado</span>
                                                <span v-if="cuota.ind_facturado === '1'" class="px-2 py-1 text-xs bg-primary-200 text-primary-800 rounded-full">Facturado</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Fechas -->
                                    <div class="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                        <div v-if="cuota.fec_efectividad" class="text-xs">
                                            <span class="text-gray-500 dark:text-gray-400">Efectividad:</span>
                                            <p class="font-medium text-gray-800 dark:text-white">{{ moment(cuota.fec_efectividad).format('DD/MM/YYYY') }}</p>
                                        </div>
                                        
                                        <div v-if="cuota.fec_vencimie" class="text-xs">
                                            <span class="text-gray-500 dark:text-gray-400">Vencimiento:</span>
                                            <p class="font-medium text-gray-800 dark:text-white">{{ moment(cuota.fec_vencimie).format('DD/MM/YYYY') }}</p>
                                        </div>
                                        
                                        <div v-if="cuota.fec_caducida" class="text-xs">
                                            <span class="text-gray-500 dark:text-gray-400">Caducidad:</span>
                                            <p class="font-medium text-gray-800 dark:text-white">{{ moment(cuota.fec_caducida).format('DD/MM/YYYY') }}</p>
                                        </div>
                                        
                                        <div v-if="cuota.fec_antiguedad" class="text-xs">
                                            <span class="text-gray-500 dark:text-gray-400">Antigüedad:</span>
                                            <p class="font-medium text-gray-800 dark:text-white">{{ moment(cuota.fec_antiguedad).format('DD/MM/YYYY') }}</p>
                                        </div>
                                    </div>
                                    
                                    <!-- Información adicional -->
                                    <div v-if="cuota.cod_operadora_scl" class="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                        <strong>Operadora SCL:</strong> {{ cuota.cod_operadora_scl }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Si installmentsStatus es un objeto simple o array vacío (fallback al comportamiento anterior) -->
                    <div v-else-if="!Array.isArray(phoneData.mobileData.installmentsStatus)" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div v-for="(value, key) in phoneData.mobileData.installmentsStatus" :key="key">
                            <p class="text-sm text-gray-600 dark:text-gray-300">
                                <strong>{{ formatKey(key) }}:</strong> {{ value }}
                            </p>
                        </div>
                    </div>
                    
                    <!-- Si es un array pero está vacío -->
                    <div v-else-if="Array.isArray(phoneData.mobileData.installmentsStatus) && phoneData.mobileData.installmentsStatus.length === 0" class="text-center py-4">
                        <p class="text-sm text-gray-500 dark:text-gray-400">No hay información de cuotas disponible</p>
                    </div>
                </div>

                <!-- Beneficiarios BPT -->
                <div v-if="phoneData.mobileData.bpt.beneficiarios && phoneData.mobileData.bpt.beneficiarios.length > 0" class="bg-surface-50 dark:bg-surface-800 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Beneficiarios BPT</h3>
                    <div class="space-y-2">
                        <div v-for="(beneficiario, index) in phoneData.mobileData.bpt.beneficiarios" :key="index" 
                             class="border border-surface-200 dark:border-surface-600 rounded p-3">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div v-for="(value, key) in beneficiario" :key="key">
                                    <p class="text-sm text-gray-600 dark:text-gray-300">
                                        <strong>{{ formatKey(key) }}:</strong> {{ value }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Beneficios BPT -->
                <div v-if="phoneData.mobileData.bpt.beneficios && phoneData.mobileData.bpt.beneficios.length > 0" class="bg-primary-50 dark:bg-primary-800 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Beneficios BPT</h3>
                    <div class="space-y-2">
                        <div v-for="(beneficio, index) in phoneData.mobileData.bpt.beneficios" :key="index" 
                             class="border border-surface-200 dark:border-surface-600 rounded p-3">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div v-for="(value, key) in beneficio" :key="key">
                                    <p class="text-sm text-gray-600 dark:text-gray-300">
                                        <strong>{{ formatKey(key) }}:</strong> {{ value }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Skeleton loader para cuando se esté cargando información del MobileStore -->
            <div v-if="loading_mobile_data" class="bg-surface-50 dark:bg-surface-700 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Cargando información móvil...</h3>
                <Skeleton class="mb-2" borderRadius="2rem"></Skeleton>
                <Skeleton width="70%" class="mb-2" borderRadius="2rem"></Skeleton>
                <Skeleton width="50%" borderRadius="2rem" class="mb-2"></Skeleton>
                <Skeleton height="2rem" class="mb-2" borderRadius="2rem"></Skeleton>
            </div>

            <!-- Información adicional del servicio (legacy) -->
            <div v-if="phoneData.additional_service_data" class="bg-primary-50 dark:bg-primary-800 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Detalle Adicional del Servicio</h3>
                <div class="space-y-2">
                    <!-- Aquí se mostraría la información adicional obtenida del endpoint -->
                    <p class="text-sm text-gray-600 dark:text-gray-300">
                        <em>Información adicional se cargará cuando se implemente la llamada al endpoint</em>
                    </p>
                </div>
            </div>

            <!-- Skeleton loader para cuando se esté cargando información adicional -->
            <div v-if="loading_additional_data" class="bg-surface-50 dark:bg-surface-700 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Cargando información adicional...</h3>
                <Skeleton class="mb-2" borderRadius="2rem"></Skeleton>
                <Skeleton width="70%" class="mb-2" borderRadius="2rem"></Skeleton>
                <Skeleton width="50%" borderRadius="2rem" class="mb-2"></Skeleton>
                <Skeleton height="2rem" class="mb-2" borderRadius="2rem"></Skeleton>
            </div>
        </div>

        <template #footer class="mt-2">
            <Button size="small" label="Cerrar" icon="pi pi-times" @click="closeModal" class="p-button-text" />
        </template>
    </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { CustomerStore } from "@/stores/CustomerStore";
import { MobileStore } from "@/stores/MobileStore";
import moment from 'moment';

// Props
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    phoneNumber: {
        type: String,
        default: null
    }
});

// Emits
const emit = defineEmits(['update:show']);

// Refs
const loading_additional_data = ref(false);
const loading_mobile_data = ref(false);

// Store
const customerStore = CustomerStore();
const mobileStore = MobileStore();
const { list_phones } = storeToRefs(customerStore);
const { mobile_loading } = storeToRefs(mobileStore);

// Computed
const visible = computed({
    get: () => props.show,
    set: (value) => emit('update:show', value)
});

const phoneData = computed(() => {
    if (!props.phoneNumber || !list_phones.value) return null;
    return list_phones.value.find(phone => phone.celular === props.phoneNumber);
});

// Computed para agrupar y ordenar cuotas
const groupedInstallments = computed(() => {
    if (!phoneData.value?.mobileData?.installmentsStatus || !Array.isArray(phoneData.value.mobileData.installmentsStatus)) {
        return {};
    }
    
    // Agrupar por num_secuenci
    const grouped = phoneData.value.mobileData.installmentsStatus.reduce((acc, cuota) => {
        const secuencia = cuota.num_secuenci;
        if (!acc[secuencia]) {
            acc[secuencia] = {
                cuotas: [],
                totalImporteDebe: 0
            };
        }
        acc[secuencia].cuotas.push(cuota);
        
        // Sumar el importe_debe solo si ind_contado !== '1' (no pagado al contado)
        if (cuota.ind_contado !== '1') {
            const importeDebe = parseFloat(cuota.importe_debe || 0);
            acc[secuencia].totalImporteDebe += importeDebe;
        }
        
        return acc;
    }, {});
    
    // Ordenar cada grupo por sec_cuota de forma ascendente
    Object.keys(grouped).forEach(secuencia => {
        grouped[secuencia].cuotas.sort((a, b) => parseInt(a.sec_cuota) - parseInt(b.sec_cuota));
    });
    
    return grouped;
});

// Methods
const closeModal = () => {
    visible.value = false;
};

// Función para formatear las claves de los objetos
const formatKey = (key) => {
    return key
        .replace(/([A-Z])/g, ' $1') // Agregar espacio antes de mayúsculas
        .replace(/^./, str => str.toUpperCase()) // Capitalizar primera letra
        .replace(/_/g, ' '); // Reemplazar guiones bajos con espacios
};

// Función para cargar información adicional del servicio
const loadAdditionalServiceData = async (phoneNumber) => {
    loading_additional_data.value = true;
    
    try {
        // Ejemplo de llamada al CustomerStore para obtener información adicional
        // Descomenta y modifica según tus necesidades:
        
        // const additionalData = await customerStore.getPhoneServiceDetails(phoneNumber);
        // 
        // // Actualizar el teléfono en list_phones con la información adicional
        // const phoneIndex = list_phones.value.findIndex(phone => phone.celular === phoneNumber);
        // if (phoneIndex !== -1) {
        //     list_phones.value[phoneIndex] = {
        //         ...list_phones.value[phoneIndex],
        //         additional_service_data: additionalData
        //     };
        // }
        
        console.log('Aquí se debe implementar la llamada al endpoint para:', phoneNumber);
        
    } catch (error) {
        console.error('Error al cargar información adicional:', error);
    } finally {
        loading_additional_data.value = false;
    }
};

// Cargar información adicional cuando se abre el modal
const handleModalOpen = () => {
    if (props.show && props.phoneNumber) {
        loadAdditionalServiceData(props.phoneNumber);
    }
};

// Watch para detectar cuando se abre el modal
watch(() => props.show, (newValue) => {
    if (newValue) {
        handleModalOpen();
    }
});

// Watch para observar el estado de carga del MobileStore
watch(mobile_loading, (newValue) => {
    loading_mobile_data.value = newValue.all || newValue.deviceInfo || 
                                newValue.installments || newValue.beneficiarios || newValue.beneficios;
}, { deep: true });
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
