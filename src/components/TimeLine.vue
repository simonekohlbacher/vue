<script setup>
import { useCategories } from '@/useCategories.js'
const { categories } = useCategories()

function getStateIcon(state) {
  switch (state) {
    case 'in_progress':
      return 'hourglass-half';
    case 'done':
      return 'circle-check';
    case 'not_started':
      return 'ban';
    default:
      return 'ban';
  }
}


</script>

<template>
  <ul class="timeline timeline-vertical">

      <li v-for="(category, index) in categories" :key="category.id" class="flex flex-col items-center">
        <div class="timeline-start timeline-box hover:text-accent">{{  category.title }}</div>
          <font-awesome-icon :icon="['fas', getStateIcon(category.state)]" class="h-5 w-5" />
        <hr class="w-px flex-grow m-0 border-none" />

      </li>
    </ul>
</template>
