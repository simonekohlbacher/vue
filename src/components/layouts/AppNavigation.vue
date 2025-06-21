<script setup>
import SideBar from '@/components/SideBar.vue'
import { RouterLink } from 'vue-router'
import { useIdle } from '@vueuse/core'
import { watch, ref, onMounted, onUnmounted } from 'vue'

const { idle } = useIdle(60 * 1000)
const showScreensaver = ref(false)

watch(idle, (isIdle) => {
  showScreensaver.value = isIdle
})
const wisdoms = [
  "Gut geplant ist halb gebaut.",
  "Billig kann teuer werden.",
  "Baustellen sind Chaos, das ist normal.",
  "Kommunikation ist deine beste Bauhelferin.",
  "Ein Haus baut man nicht allein.",
  "Der erste Entwurf ist nie der letzte.",
]

const currentIndex = ref(0)
const currentWisdom = ref(wisdoms[currentIndex.value])

let intervalId = null

onMounted(() => {
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % wisdoms.length
    currentWisdom.value = wisdoms[currentIndex.value]
  }, 5000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})

</script>



<template>

  <!-- Screensaver wird eingeblendet, wenn idle -->
  <div v-if="showScreensaver" class="screensaver">
    <p class="text-lg italic mt-2">{{ currentWisdom }}</p>
  </div>

  <div class="flex min-h-screen overflow-hidden">
    <SideBar />
    <!-- Hauptbereich -->
    <div class="flex flex-col flex-grow">
      <header class="sticky top-0 z-10 bg-base-100 shadow p-4 flex justify-between items-center">
        <RouterLink to="/home">
          <img src="/public/logo.png" alt="Logo" class="h-8 mr-2 inline-block" />
        </RouterLink>

        <!-- Logout & Theme Switch -->
        <div class="flex items-center gap-4">
          <RouterLink to="/" class="text-xl mr-4">
            <font-awesome-icon :icon="['fas', 'right-from-bracket']" />
          </RouterLink>

          <label class="toggle text-base-content">
            <input type="checkbox" value="forest" class="theme-controller" />
            <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></g></svg>
            <svg aria-label="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></g></svg>
          </label>
        </div>

      </header>

      <main class="flex-grow overflow-y-auto p-6">
        <!-- Page-Content -->
        <slot />
      </main>

      <!--https://daisyui.com/components/footer/ -->
        <footer class="footer sm:footer-horizontal bg-neutral text-neutral-content items-center p-4">
          <aside class="grid-flow-col items-center">
            <img src="/src/assets/logo-inverted.png" alt="Logo" class="h-8 mr-2 inline-block" />
            <p>Copyright © Simone Kohlbacher {{new Date().getFullYear()}} - All right reserved</p>
          </aside>
        </footer>
    </div>
  </div>
</template>
