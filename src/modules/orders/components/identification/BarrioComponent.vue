<template>
<div>
    <div class="flex justify-center items-center w-full">  
    <div class="relative w-full sm:w-4/5">
        <i class="pi pi-search absolute top-2/4 -mt-2 right-3 text-surface-400 dark:text-surface-600"></i>
       
    <InputGroup>
      <InputText v-model="form_lead.barrio_text"
       @input="handleInput"  size="small" 
        placeholder="Escriba el barrio o corregimiento" 
        class="w-full pr-10" />
    <Button icon="pi pi-search" severity="info" @click="visibleModal = true"/>
    </InputGroup>
        <ul v-if="showResults" class="absolute z-10 mt-1 bg-white dark:bg-slate-800 dark:text-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto w-full">
            <li
              v-for="item in filteredBarrios"
              :key="item.idbarrio"
              @click="selectBarrio(item)"
              class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              <span class="font-medium">{{ item.barrio }}</span>
              <span class="text-sm text-gray-500 ml-2 dark:text-primary-100">({{ item.corregimiento }})</span>
            </li>
        </ul>
    </div>
 
</div>


<div class="card flex justify-center"> 
        <Dialog v-model:visible="visibleModal" modal header="Buscar Barrio" class="md:w-[35rem] w-full"> 
            <div class="md:flex md:items-center md:gap-4 mb-4 flex flex-col md:flex-row">
                <label for="username" class="font-semibold md:w-24">Provincia: </label>
                <select v-model="form_barrio.provincia" class="flex-auto dark:bg-slate-800 dark:text-white">
                  <option value="">Seleccione</option>
                  <option v-for="item in list_provincias" :key="item.idprov" :value="item.idprov">{{ item.provincia }}</option>
                </select> 
            </div>
            <div class="md:flex md:items-center md:gap-4 mb-4 flex flex-col md:flex-row">
                <label for="email" class="font-semibold md:w-24">Distrito</label>
                <select v-model="form_barrio.distrito" class="flex-auto dark:bg-slate-800 dark:text-white">
                  <option value="">Seleccione</option>
                  <option v-for="item in list_distritos.filter(item => item.idprov == form_barrio.provincia)" :key="item.iddist" :value="item.iddist">{{ item.distrito }}</option>
                </select>
            </div>
            <div class="md:flex md:items-center md:gap-4 mb-4 flex flex-col md:flex-row">
                <label for="email" class="font-semibold md:w-24">Corregimiento</label>
                <select v-model="form_barrio.corregimiento" class="flex-auto dark:bg-slate-800 dark:text-white">
                  <option value="">Seleccione</option>
                  <option v-for="item in list_corregimientos.filter(item => item.iddist == form_barrio.distrito)" :key="item.idcorreg" :value="item.idcorreg">{{ item.corregimiento }}</option>
                </select>
            </div>
            <div class="md:flex md:items-center md:gap-4 mb-4 flex flex-col md:flex-row">
                <label for="email" class="font-semibold md:w-24">Barrio</label>
                <select v-model="form_barrio.barrio" class="flex-auto dark:bg-slate-800 dark:text-white">
                  <option value="">Seleccione</option>
                  <option v-for="item in list_barrios.filter(item => item.idcorreg == form_barrio.corregimiento).sort((a, b) => a.barrio.localeCompare(b.barrio))
                    " :key="item.idbarrio" :value="item.idbarrio">{{ item.barrio }}</option>
                </select>
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" size="small" label="Cancelar" severity="secondary" @click="visibleModal = false"></Button>
                <Button type="button" size="small" label="Elegir" @click="elegirBarrio()"></Button>
            </div>
        </Dialog>
    </div>


  </div>
  </template>
  
  <script setup>
    import { ref, computed, onMounted } from 'vue'
    import { storeToRefs } from 'pinia'
    import {HomepassedStore} from '@/stores/HomepassedStore'

    import {LeadStore} from '@/stores/LeadStore'

    const {a_updateLeadAccountData} = LeadStore();
    const {form_lead} = storeToRefs(LeadStore()); 
    const {list_barrios, list_provincias,list_distritos,list_corregimientos} = storeToRefs(HomepassedStore());

    const showResults = ref(false)

    const form_barrio = ref({
      provincia: null,
      distrito: null,
      corregimiento: null,
      barrio: null
    })
    const visibleModal = ref(false);

    const filteredBarrios = computed(() => {
      if (form_lead.value.barrio_text.length < 5) return []
      let filterbarrio= list_barrios.value.filter(item => 
        item.barrio.toLowerCase().includes(form_lead.value.barrio_text.toLowerCase()) ||
        item.corregimiento.toLowerCase().includes(form_lead.value.barrio_text.toLowerCase())
      )

      return filterbarrio.sort((a, b) => a.barrio.localeCompare(b.barrio))
    })

    const handleInput = () => {
      showResults.value = form_lead.value.barrio_text.length >= 5
    }

    const elegirBarrio = async () => {
      console.log("elegirBarrio")
      const barrio_text = list_barrios.value.find(item => item.idbarrio == form_barrio.value.barrio).barrio
      const corregimiento_text = list_corregimientos.value.find(item => item.idcorreg == form_barrio.value.corregimiento).corregimiento
      form_lead.value.barrio_text = barrio_text + ' (' + corregimiento_text + ')'
      await a_updateLeadAccountData(form_barrio.value.barrio ,null,null,barrio_text + ' (' + corregimiento_text + ')')
      visibleModal.value = false
    }

    const selectBarrio = async(item) => {
      form_lead.value.barrio_text = item.barrio + ' (' + item.corregimiento + ')' 
      await a_updateLeadAccountData(item.idbarrio ,null,null,item.barrio + ' (' + item.corregimiento + ')')
      showResults.value = false
    }

    </script>