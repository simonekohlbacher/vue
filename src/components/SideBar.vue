
<script setup>
import { ref } from 'vue'
const sidebarOpen = ref(false)
</script>

<template>
  <div class="flex">
    <aside class="w-20 sm:w-60 h-screen bg-base-200 pt-0 sm:p-4 fixed top-0 left-0">

    <!-- Logo -->
      <div class="flex items-center gap-3 m-4">
        <font-awesome-icon :icon="['fas', 'helmet-safety']" class="text-2xl " />
        <span class="text-xl font-bold hidden sm:inline">Baumanagerin</span>
      </div>

      <!-- Menü -->
      <ul class="menu text-base-content text-2xl mt-12">
        <li>
          <RouterLink to="/home" class="flex items-center gap-2 hover:text-accent mb-2">
            <font-awesome-icon :icon="['fas', 'house']" />
            <span class="hidden sm:inline">Projekt</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/weather" class="flex items-center gap-2 hover:text-accent mb-2">
            <font-awesome-icon :icon="['fas', 'cloud-sun-rain']" />
            <span class="hidden sm:inline">Wetter</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/calendar" class="flex items-center gap-2 hover:text-accent mb-2">
            <font-awesome-icon :icon="['fas', 'calendar-days']" />
            <span class="hidden sm:inline">Kalender</span>
          </RouterLink>
        </li>
      </ul>
    </aside>

  </div>
</template>
