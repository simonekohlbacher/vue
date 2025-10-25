<script setup>
import { computed, onMounted } from 'vue'
import CategoryList from "@/components/CategoryList.vue";
import TimeLine from "@/components/TimeLine.vue";
import AddCategory from "@/components/AddCategory.vue";
import AppNavigation from "@/components/layouts/AppNavigation.vue";
import Timer from "@/components/Timer.vue";
import { useAuth } from "@/useAuth.js";
import { useTasks } from '@/useTasks.js';
import { useCategories } from '@/useCategories.js'

const { currentUser } = useAuth();
const { totalDiff, totalEstimate, totalCosts, fetchTasks, formatCurrency } = useTasks();
const { categories } = useCategories();
const budget = currentUser.value.budget;

onMounted(() => {
  fetchTasks()
})

const showTimer = computed(() => {
  if (!currentUser.value?.start) return false
  return new Date(currentUser.value.start) > new Date()
})


</script>

<template>
  <AppNavigation>

    <div class="sm:m-12">
      <h2 class="text-3xl font-bold">Servus {{ currentUser.name }}!</h2>
      <p class="text-xl font-bold mb-8">Heute ist ein schöner Tag zum Bauen.</p>
      <hr>
    </div>

    <div v-if="showTimer" class="sm:ml-20 mb-20">
      <Timer />
    </div>

    <div class="sm:p-20">
      <h2 class="text-3xl font-bold mb-2">ToDos</h2>
      <p>Hier siehst du alle deine Projektkategorien auf einen Blick. Verwalte sie, füge neue hinzu und behalte deine Baustelle im Griff. Das Bearbeiten einer Kategorie kannst direkt in der jeweiligen Detail-Ansicht mit Klick auf das jeweilige Feld vornehmen. Der Status aktualisiert sich je nach Fortschritt der Aufgaben der jeweiligen Kategorie.</p>
      <div class="my-6 ">
        <AddCategory />
      </div>
      <CategoryList />
    </div>

    <div v-if="categories.length" class="p-20">
      <h2 class="text-3xl font-bold mb-12 text-center">Alles im Blick</h2>
      <TimeLine />
    </div>

    <div class="sm:p-20">
      <div class="mb-6 p-4  rounded-lg shadow-sm border ">
        <dl class="space-y-2">
          <div class="flex justify-between">
            <dt class="font-medium">Budget</dt>
            <dd class="font-semibold">{{ formatCurrency(budget) }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="font-medium">Gesamte geschätzte Kosten</dt>
            <dd class="font-semibold">{{ formatCurrency(totalEstimate) }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="font-medium">Bereits ausgegeben</dt>
            <dd class="font-semibold">{{ formatCurrency(totalCosts) }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="font-medium">Differenz</dt>
            <dd :class="totalDiff >= 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'">
              {{ formatCurrency(totalDiff) }}
            </dd>
          </div>
        </dl>
      </div>

    </div>
  </AppNavigation>
</template>

