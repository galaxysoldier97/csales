<template>
  <div class="flex flex-col min-h-screen bg-cover" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <div class="flex-grow">
      <router-view/>
    </div>

    <footer class="bg-[rgba(33,33,33,0.8)]">
      <div class="xl:container mx-auto">
        <div class="row text-white text-center">
          <span>Copyright © Tigo Panamá {{ currentYear }}</span>
        </div>
      </div>
    </footer>
  </div>
</template>


<script>
import moment from 'moment'
import backgroundImage from '@/assets/login-background.png'

export default {
  data() {
    return {
      currentYear: moment().year(),
      backgroundImage
    }
  }
}
</script>

<style scoped>
.flex {
  background-size: cover;
}
</style>