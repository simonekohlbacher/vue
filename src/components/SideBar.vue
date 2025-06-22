<template>
  <div class="flex">
    <aside class="w-80 h-screen bg-base-200 p-4 fixed top-0 left-0">

      <div class="flex items-center gap-3 mb-6">
        <font-awesome-icon :icon="['fas', 'helmet-safety']" class="text-2xl" />
        <span class="text-xl font-bold">Baumanagerin</span>
      </div>

      <ul class="menu text-base-content text-2xl mt-12">
        <li>
          <RouterLink to="/home" class="flex items-center gap-2 hover:text-accent mb-2">
            <font-awesome-icon :icon="['fas', 'house']" />
            <span>Projekt</span>
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
