<script setup>
import { ref } from 'vue';
import { useCategories } from '@/useCategories.js';
import { getFileUrl } from "@/pocketbase.js";

const { categories } = useCategories();

function getStateIcon(state) {
  switch (state) {
    case 'in_progress':
      return ['fas', 'hourglass-half'];
    case 'done':
      return ['fas', 'circle-check'];
    case 'not_started':
      return ['fas', 'ban'];
    default:
      return ['fas', 'ban'];
  }
}


// 1) Status & Titel pro Kategorie speichern
const editingStates = ref({});
const editingTitles = ref({});

function startEditing(cat) {
  console.log('Start editing:');
  editingStates.value[cat.id] = true;
  editingTitles.value[cat.id] = cat.title;

}

</script>

<template>
  <div v-if="categories && categories.length">
    <div
      v-for="cat in categories"
      :key="cat.id"
      class="collapse collapse-arrow bg-base-100 border border-base-300"
    >
      <input type="radio" name="my-accordion-2" />

      <div class="collapse-title font-semibold flex justify-between items-center gap-2">
        <!-- Links: Icon + Titel -->
        <div class="flex items-center gap-2">
          <font-awesome-icon :icon="getStateIcon(cat.state)" />

          <div @click.stop="startEditing(cat)">
            {{ cat.title }}
          </div>


        </div>

        <!-- Rechts: Fälligkeitsdatum -->
        <div class="text-sm">
          Fällig am: {{ new Date(cat.deadline).toLocaleDateString() }}
        </div>
      </div>

      <div class="collapse-content text-sm">
        <div class="flex flex-col md:flex-row gap-4 items-start">
          <!-- Bild links -->
          <img
            v-if="cat.img"
            class="w-full md:w-1/3 h-40 object-cover rounded-lg shadow"
            :src="getFileUrl('categories', cat.id, cat.img)"
            alt="Category Image"
          />
          <!-- Text rechts -->
          <div class="flex-1">
            <p class="text-base leading-relaxed">
              {{ cat.description }}
            </p>
          </div>
        </div>
        <RouterLink :to="`/categories/${cat.id}`" class="btn btn-success btn-sm mt-4">Details</RouterLink>
      </div>
    </div>
  </div>
  <div v-else class="p-4 text-gray-400">Noch keine Kategorien vorhanden.</div>
</template>
