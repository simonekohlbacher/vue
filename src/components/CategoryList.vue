<script setup>
import { useCategories } from '@/useCategories.js'
import { getFileUrl } from '@/pocketbase.js'
import { useWebNotification } from '@vueuse/core'
import { watch } from 'vue'
const { categories, getStateIcon } = useCategories()

// notification für heutig fällige Kategorien
const { show, permissionGranted } = useWebNotification({
  title: 'Deadline heute',
  body: 'Eine Kategorie ist heute fällig!',
  tag: 'deadline-alert',
  renotify: true,
})

// immer wenn sich die Kategorien ändern, prüfe ob eine heute fällig ist
watch(
  categories,
  (newCats) => {
    if (!newCats.length) return
    const today = new Date().toISOString().split('T')[0]
    // mind 1 Kategorie mit heutigem Fälligkeitsdatum?
    const hasTodayDeadline = newCats.some((cat) => {
      if (!cat.deadline) return false
      const catDate = new Date(cat.deadline).toISOString().split('T')[0]
      return catDate === today
    })
    // dann zeige warnung an
    if (hasTodayDeadline && permissionGranted.value) {
      show()
    }
  },
  { immediate: true },
)

</script>

<template>
  <div v-if="categories && categories.length">
    <!-- https://daisyui.com/components/accordion/ -->
    <div v-for="cat in categories" :key="cat.id" class="collapse collapse-arrow bg-base-100 border border-base-300">
      <input type="radio" name="my-accordion-2" />
      <div class="collapse-title font-semibold flex justify-between items-center gap-2">
        <div class="flex items-center gap-2">
          <font-awesome-icon :icon="getStateIcon(cat.state)" />
          {{ cat.title }}
        </div>
        <div class="text-sm">Fällig am: {{ new Date(cat.deadline).toLocaleDateString() }}</div>
      </div>
      <div class="collapse-content text-sm">
        <div class="flex flex-col md:flex-row gap-4 items-start">
          <img v-if="cat.img" class="w-full md:w-1/3 h-40 object-cover rounded-lg shadow" :src="getFileUrl('categories', cat.id, cat.img)" alt="Category Image" />
          <div class="flex-1">
            <p class="text-base leading-relaxed">{{ cat.description }}</p>
          </div>
        </div>
        <RouterLink :to="`/categories/${cat.id}`" class="btn btn-success btn-sm mt-4">Details</RouterLink>
      </div>
    </div>
  </div>
  <div v-else class="p-4 text-gray-400">Noch keine Kategorien vorhanden.</div>
</template>
