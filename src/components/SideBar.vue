<template>
  <div class="flex">
    <aside class="w-80 h-screen bg-base-200 p-4 fixed top-0 left-0">

      <h2 class="text-2xl">1 Haus bitte</h2>

      <ul class="menu text-base-content text-2xl mt-4">
        <li>
          <RouterLink to="/home" class="flex items-center gap-2 hover:text-accent mb-2">
            <font-awesome-icon :icon="['fas', 'house']" />
            <span>Home</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/weather" class="flex items-center gap-2 hover:text-accent mb-2">
            <font-awesome-icon :icon="['fas', 'cloud-sun-rain']" />
            <span>Wetter</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/calendar" class="flex items-center gap-2 hover:text-accent mb-2">
            <font-awesome-icon :icon="['fas', 'calendar-days']" />
            <span>Kalender</span>
          </RouterLink>
        </li>
      </ul>
    </aside>

    <div class="ml-80">
    </div>
  </div>
</template>
<script lang="ts">
</script>
