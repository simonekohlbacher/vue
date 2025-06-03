<script setup>

import Navbar from '@/components/Navbar.vue';

</script>

<template>

  <header class="w-full flex items-start justify-between p-4 md:mb-5 md:absolute md:top-0">
    <slot name="header">
      <Navbar></Navbar>
    </slot>

    <RouterLink @click="logout" to="/">
      <font-awesome-icon :icon="['fas', 'right-from-bracket']" />
    </RouterLink>

  </header>

  <main class="">
    <div class="">
      <div class="p-5 h-full">
        <slot>
          Your content goes here
        </slot>
      </div>
    </div>
  </main>

  <footer>
    <slot name="footer">

    </slot>
  </footer>

</template>

<style>

</style>
