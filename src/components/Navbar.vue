<script setup>
import { RouterLink } from 'vue-router';

</script>

<template>

  <div class="drawer">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" checked />

    <div class="drawer-content flex flex-col items-center justify-center">
      <!-- Page content here -->
      <!-- Öffnen Button -->
      <label for="my-drawer-2" class="btn btn-primary m-4 absolute top-4 left-4 transition-opacity duration-300 drawer-toggle-button">
        <font-awesome-icon :icon="['fas', 'bars']" />
      </label>


      <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">
        Open drawer
      </label>

    </div>
    <div class="drawer-side relative">
      <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>

      <!-- ✕ Button zum Schließen -->
      <label for="my-drawer-2" class="btn btn-sm btn-ghost absolute top-4 right-4 z-10">
        ✕
      </label>

      <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
        <RouterLink to="/about" class="flex items-center gap-2"><font-awesome-icon :icon="['fas', 'house']" /><span>Home</span></RouterLink>
        <RouterLink to="/weather" class="flex items-center gap-2"><font-awesome-icon :icon="['fas', 'cloud-sun-rain']" /><span>Kalender</span></RouterLink>
        <RouterLink to="/weather" class="flex items-center gap-2"><font-awesome-icon :icon="['fas', 'calendar-days']" /><span>Wetter</span></RouterLink>
      </ul>
    </div>
  </div>

</template>


<style scoped>
/*  Button ausblenden, wenn Drawer offen ist */
input#my-drawer-2:checked ~ .drawer-content .drawer-toggle-button {
  @apply hidden;
}
</style>
