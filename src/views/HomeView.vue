<script setup>
import CategoryList from "@/components/CategoryList.vue";
import TimeLine from "@/components/TimeLine.vue";
import AddCategory from "@/components/AddCategory.vue";
import AppNavigation from "@/components/layouts/AppNavigation.vue";
import Timer from "@/components/Timer.vue";
import { useAuth } from "@/useAuth.js";
const { currentUser } = useAuth();
import { useCategories } from '@/useCategories.js'
const { totalDiff, totalEstimate, totalCosts } = useCategories()

const budget = currentUser.value.budget;
const formatCurrency = (value) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value ?? 0);
};


</script>

<template>
  <AppNavigation>

    <h2 class="text-4xl font-bold">Servus {{ currentUser.name }}!</h2>
    <p class="text-xl font-bold mb-8">Heute ist ein schöner Tag zum Bauen.</p>

    <Timer/>




    <div class="p-20">
      <h2 class="text-4xl font-bold mb-8">Kategorien</h2>
      <p>sfgsdgdsgsdfdsf</p>
      <div class="my-6 ">
        <AddCategory />
      </div>
      <CategoryList />
    </div>

    <div v-if="useCategories.length" class="p-20">
      <h2 class="text-4xl font-bold mb-8">Zeit</h2>
      <TimeLine />
    </div>

    <div class="p-20">
      <h2 class="text-4xl font-bold mb-8">Money</h2>
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

<style>
.screensaver {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: black;
  color: white;
  font-size: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
