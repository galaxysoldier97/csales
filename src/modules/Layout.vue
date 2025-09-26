 
<template> 
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-600 px-6 pb-4">
                <div class="flex h-16 shrink-0 items-center mx-auto mt-2"> 
                  <img  src="@/assets/csales_logo.png" alt="Csales" width="100" />
                </div>
                <PanelMenu :model="items" class="w-full md:w-[10rem] text-white">
              <template #item="{ item }">
                  <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                      <a v-ripple class="flex items-center cursor-pointer px-3 py-2" :href="href" @click="navigate">
                        <component class="h-5 w-5" :is="item.icon" />
                          <span class="ml-2 text-color">{{ item.label }}</span>
                      </a>
                  </router-link>
                  <a v-else v-ripple class="flex items-center cursor-pointer px-3 py-2 " :href="item.url" :target="item.target" @click="sidebarOpen = false">
                    <component class="h-5 w-5" :is="item.icon" />
                      <span class="ml-2">{{ item.label }}</span>
                      <span v-if="item.items" class="pi pi-angle-down  dark:text-primary-400 ml-auto" />
                  </a>
              </template>
          </PanelMenu>
          <!-- Botón de logout para mobile -->
<button
  @click="logoutUser"
  class="mt-auto flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
>
  <span class="pi pi-sign-out" /> Cerrar sesión
</button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <TransitionRoot as="template" :show="sidebarLGOpen">
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-600 px-6 pb-4">
        <div class="flex h-16 shrink-0 items-center mx-auto mt-2"> 
          <img  src="@/assets/csales_logo.png" alt="Csales" width="100" />
        </div>
        <div class="card flex justify-center">
          <PanelMenu :model="items" class="w-full md:w-[20rem] text-white">
              <template #item="{ item }">
                  <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                      <a v-ripple class="flex items-center cursor-pointer px-3 py-2" :href="href" @click="navigate">
                        <component class="h-5 w-5" :is="item.icon" />
                          <span class="ml-2 text-color">{{ item.label }}</span>
                      </a>
                  </router-link>
                  <a v-else v-ripple class="flex items-center cursor-pointer px-3 py-2 " :href="item.url" :target="item.target">
                      <component class="h-5 w-5" :is="item.icon" />
                      <span class="ml-2">{{ item.label }}</span>
                      <span v-if="item.items" class="pi pi-angle-down  dark:text-primary-400 ml-auto" />
                  </a>
              </template>
          </PanelMenu>
        </div>
      </div>
    </div>
    </TransitionRoot>

    <div :class="{ 'lg:pl-72': sidebarLGOpen }"> 
      <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-primary-700 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button type="button" class="-m-2.5 p-2.5 text-white lg:hidden" @click="sidebarOpen = !sidebarOpen">
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>

        <!-- Separator -->
        <div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div class="relative flex flex-1">
            <button type="button"  class="hidden lg:block -m-2.5 p-2.5 text-white"  @click="toggleSidebarLG()">
              <span class="sr-only">Open sidebar</span>
              <Bars3Icon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div class="flex items-center gap-x-4 lg:gap-x-6"> 
            <!-- Separator -->
            <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />

            <!-- Profile dropdown -->
            <Menu as="div" class="relative">
              <MenuButton class="-m-1.5 flex items-center p-1.5">
                <span class="sr-only">Open user menu</span>
                 <span class="hidden lg:flex lg:items-center">
                  <span class="ml-4 text-sm font-semibold leading-6 text-white" aria-hidden="true">{{ data_user.firstName }} {{ data_user.lastName }}</span>
                  <ChevronDownIcon class="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </MenuButton>
              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <MenuItems class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white  py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                    <button  @click="item.command" :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']">{{ item.name }}</button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <main class="py-4 lg:py-10 bg-gray-100 dark:bg-slate-800 dark:text-white"> 
        <div class="px-2 sm:px-6 lg:px-8">
          <!-- Your content -->
          <router-view/>
        </div>
      </main>
    </div>
    
    <FlashLogin />
  </div>
</template>

<script setup>
import { ref,onMounted,onUnmounted } from 'vue'
import { useRouter } from "vue-router";
import { storeToRefs } from 'pinia';
import {AuthStore} from '@stores/AuthStore';
import 'primeicons/primeicons.css';
import {
  Dialog,  DialogPanel,  Menu,  MenuButton,  MenuItem,  MenuItems,  TransitionChild,  TransitionRoot,} from '@headlessui/vue'
import {
  Bars3Icon,  
  ShoppingCartIcon,  ClipboardIcon,  ClipboardDocumentCheckIcon, 
  XMarkIcon} from '@heroicons/vue/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import FlashLogin from './auth/components/FlashLogin.vue';

const { a_checkFlashLogin, logout } = AuthStore();
const {data_user}=AuthStore()
const { flashlogin} = storeToRefs(AuthStore());

const router = useRouter();
const items = ref([
  
    {
        label: 'Gestión de Ventas',
        icon: ShoppingCartIcon,
        command: () => {
            router.push({ name: 'orders_create' });
        }
    },
    {
        label: 'Mis Ordenes',
        icon: ClipboardIcon,
        command: () => {
            router.push({ name: 'orders_index' });
        }
    },
    {
        label: 'Buscar Ordenes',
        icon: MagnifyingGlassIcon,
        command: () => {
            router.push({ name: 'orders_search' });
        }
    }, 
    {
        label: 'Contratos',
        icon: ClipboardDocumentCheckIcon,
        command: () => {
            router.push({ name: 'contracts' });
        }
    },
]);
 
const logoutUser = async() => {
  await logout()
  router.push({ name: 'login' })
}

const userNavigation = [ 
  { name: 'Cerrar Sesión',  command: logoutUser },
]

const sidebarOpen = ref(false)

const sidebarLGOpen = ref(localStorage.getItem("sidebarLGOpen") ? JSON.parse(localStorage.getItem("sidebarLGOpen")) : false);

// Cuando cambies el valor de sidebarLGOpen, también actualiza el valor en el almacenamiento local
function toggleSidebarLG() {
  sidebarLGOpen.value = !sidebarLGOpen.value;
  localStorage.setItem("sidebarLGOpen", JSON.stringify(sidebarLGOpen.value));
}
 
onMounted(() => {
  const interval = setInterval(() => {
    a_checkFlashLogin()
  }, 100000) // 5 minutes in milliseconds

  onUnmounted(() => {
    clearInterval(interval)
  })
})
 

</script> 