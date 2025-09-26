<template>
<div> 
    <TableOffer />

    <TableOfferSelected />
    
</div>
</template>

<script setup>

import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';  
import { LeadStore } from '@stores/LeadStore';   
import TableOffer from './eligibility/TableOffer.vue'; 
import TableOfferSelected from './eligibility/TableOfferSelected.vue'; 
 
const { form_eligibility, list_eligibility, g_filteredEligibility, lead_loading } =storeToRefs(LeadStore());
 
</script>