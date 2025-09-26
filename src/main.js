import './assets/main.css'

import PrimeVue from 'primevue/config';
import Lara from '@/presets/lara';      //import preset  

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import VueSignaturePad from 'vue-signature-pad';

import  Button  from 'primevue/button';
import  Calendar  from 'primevue/calendar';
import  Checkbox   from 'primevue/checkbox';
import  Column  from 'primevue/column';
import  DataTable  from 'primevue/datatable';
import  Dropdown  from 'primevue/dropdown';
import Divider from 'primevue/divider';
import  InputNumber  from 'primevue/inputnumber';
import  InputText  from 'primevue/inputtext';
import  Message  from 'primevue/message';
import  MultiSelect  from 'primevue/multiselect';
import  ProgressBar  from 'primevue/progressbar';
import  Slider  from 'primevue/slider';
import  Tag  from 'primevue/tag';
import  TriStateCheckbox  from 'primevue/tristatecheckbox';
import CascadeSelect from 'primevue/cascadeselect';
import Dialog from 'primevue/dialog';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Panel from "primevue/panel";
import PanelMenu from "primevue/panelmenu";
import PickList from 'primevue/picklist';
import RadioButton from 'primevue/radiobutton';
import Ripple from 'primevue/ripple';
import Skeleton from 'primevue/skeleton'; 
import TabMenu from "primevue/tabmenu";
import TabPanel from 'primevue/tabpanel';
import TabView from 'primevue/tabview';
import Toast from 'primevue/toast';
import Password from 'primevue/password';
import SplitButton from 'primevue/splitbutton';
 

import FileUpload from 'primevue/fileupload';

import ToastService from 'primevue/toastservice';


import App from './App.vue'
import router from './router'

const app = createApp(App)
app.component('InputGroup', InputGroup);
app.component('InputGroupAddon', InputGroupAddon);
app.component("Button", Button);
app.component("Calendar", Calendar);
app.component("CascadeSelect", CascadeSelect);
app.component("Checkbox", Checkbox);
app.component("Column", Column);
app.component("DataTable", DataTable);
app.component("Dialog", Dialog);
app.component("Divider", Divider);
app.component("Dropdown", Dropdown);
app.component("InputNumber", InputNumber);
app.component("InputText", InputText);
app.component("Message", Message);
app.component("MultiSelect", MultiSelect);
app.component("Password", Password);
app.component("Panel", Panel);
app.component("PanelMenu", PanelMenu);
app.component("PickList", PickList);
app.component("ProgressBar", ProgressBar);
app.component("RadioButton", RadioButton);
app.component("Skeleton", Skeleton);
app.component("Slider", Slider);
app.component("TabMenu", TabMenu);
app.component("TabPanel", TabPanel);
app.component("TabView", TabView);
app.component("Tag", Tag);
app.component("TriStateCheckbox", TriStateCheckbox);
app.component("FileUpload", FileUpload); 
app.component("SplitButton", SplitButton);
app.directive('ripple', Ripple); 
app.component("Toast", Toast); 
app.use(ToastService); 
app.use( VueSignaturePad);

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    unstyled: true,
    pt: Lara                            //apply preset        
});
app.mount('#app')
    