<template>
    <div>
        
        <ChooseAccountComponent v-if="lead_stage == 'Ordering_ChooseAccount'" />
        <ChooseAddressHogarComponent v-if="lead_stage == 'Ordering_ChooseAddressHogar'" />
        <FixedIdCardSubscriberComponent v-if="lead_stage == 'Ordering_FixedIdCardSubscriber'" />
        <MobileAddressSearchComponent v-if="lead_stage == 'Ordering_MobileAddressSearch'" />
        <MobileAddressSelectComponent v-if="lead_stage == 'Ordering_MobileAddressSelect'" />
        <MobileAddressTextComponent v-if="lead_stage == 'Ordering_MobileAddressText'" />
        <MobileLineServSuplComponent v-if="lead_stage == 'Ordering_MobileLineServSupl'" />
        <MobilePersonalDataComponent v-if="lead_stage == 'Ordering_MobilePersonalData'" />
        <Ordering_DigitalSigningComponent v-if="lead_stage == 'Ordering_DigitalSigning'" />
        <Ordering_EquipmentComponent v-if="lead_stage == 'Ordering_Equipment'" />
        <Ordering_MobileChooseAccountComponent v-if="lead_stage == 'Ordering_MobileChooseAccount'" />
        <Ordering_SRVSworkflowComponent v-if="lead_stage == 'Ordering_IfSRVSworkflow'" />
        <SimcardComponent v-if="lead_stage == 'Ordering_Simcard'" />
        <UploadIdComponent v-if="lead_stage == 'Ordering_UploadId'" />
         
    </div>
</template>


<script setup>

import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';  
import { LeadStore } from '@stores/LeadStore';   
import ChooseAccountComponent from './ordering/ChooseAccountComponent.vue';
import ChooseAddressHogarComponent from './ordering/ChooseAddressHogarComponent.vue';
import FixedIdCardSubscriberComponent from './ordering/FixedIdCardSubscriberComponent.vue';
import MobileAddressSearchComponent from './ordering/MobileAddressSearchComponent.vue'; 
import MobileAddressSelectComponent from './ordering/MobileAddressSelectComponent.vue';
import MobileAddressTextComponent from './ordering/MobileAddressTextComponent.vue';
import MobileLineServSuplComponent from './ordering/MobileLineServSuplComponent.vue';
import MobilePersonalDataComponent from './ordering/MobilePersonalDataComponent.vue'; 
import Ordering_DigitalSigningComponent from './ordering/Ordering_DigitalSigningComponent.vue';
import Ordering_EquipmentComponent from './ordering/Ordering_EquipmentComponent.vue';
import Ordering_MobileChooseAccountComponent from './ordering/Ordering_MobileChooseAccountComponent.vue';
import Ordering_SRVSworkflowComponent from './ordering/Ordering_SRVSworkflowComponent.vue';
import SimcardComponent from './ordering/SimcardComponent.vue'; 
import UploadIdComponent from './ordering/UploadIdComponent.vue'; 




const {lead_stage, lead_loading } =storeToRefs(LeadStore());
 
</script>