<script setup>
import { useCategories } from '@/useCategories.js'
const { categories, getStateIcon } = useCategories()
</script>

<template>
  <ul class="timeline timeline-vertical">
      <li v-for="(category) in categories" :key="category.id" class="flex flex-col items-center">
        <div class="timeline-start timeline-box hover:text-accent">{{ category.title }}</div>
        <font-awesome-icon :icon="getStateIcon(category.state)" class="h-5 w-5" />
        <hr class="w-px flex-grow m-0 border-none" />
      </li>
    </ul>
</template>
