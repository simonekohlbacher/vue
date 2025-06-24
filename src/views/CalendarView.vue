<script setup>
// https://date-fns.org/ & chat
import { ref, computed, onMounted } from 'vue'
import { useTasks } from '@/useTasks.js'
import AppNavigation from '@/components/layouts/AppNavigation.vue'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns'

const { tasks, fetchTasks } = useTasks()
const currentDate = ref(new Date())

onMounted(async () => {
  tasks.value = await fetchTasks()
})


// berechnet alle tage im aktuellen Monat
const daysInMonth = computed(() => {
  const start = startOfMonth(currentDate.value)
  const end = endOfMonth(currentDate.value)
  // baut ein array mit allen Tagen im Monat & formatiert sie im 'yyyy-MM-dd' Format
  return eachDayOfInterval({ start, end }).map(date => ({
    date: format(date, 'yyyy-MM-dd'),
    day: format(date, 'd')
  }))
})

// filtert die tasks nach gegebenen datum
const tasksForDay = date => {
  const targetDate = new Date(date)
  // filtert die tasks, die am gleichen Tag wie date liegen
  return tasks.value.filter(task => {
    const taskDate = new Date(task.deadline)
    return taskDate.toDateString() === targetDate.toDateString()
  })
}

// erhöht oder verringert den Monat um 1 beim weiter- oder zurückspringen
const nextMonth = () => {
  currentDate.value = addMonths(currentDate.value, 1)
}
const prevMonth = () => {
  currentDate.value = subMonths(currentDate.value, 1)
}

// zeigt den aktuellen, formatierten Monat und Jahr an
const currentMonthYear = computed(() =>
  format(currentDate.value, 'MMMM yyyy')
)
</script>

<template>
  <AppNavigation>
    <div class="max-w-4xl mx-auto p-4 text-center">
      <h1 class="text-3xl font-extrabold mb-2">Kalender</h1>
      <p class="text-sm mb-8">
        Behalte deine Deadlines für alle Aufgaben immer im Blick.
      </p>

      <div class="rounded-xl shadow-md p-4 mt-20">
        <div class="flex justify-between items-center mb-4">
          <button @click="prevMonth"
            class="bg-success text-white px-3 py-1 rounded-md hover:opacity-60 transition">
            ←
          </button>
          <span class="font-semibold text-lg">{{ currentMonthYear }}</span>
          <button @click="nextMonth"
            class="bg-success text-white px-3 py-1 rounded-md hover:opacity-60 transition">
            →
          </button>
        </div>

        <div class="grid grid-cols-7 gap-2">
          <div
            v-for="day in daysInMonth"
            :key="day.date"
            class="border border-gray-300 rounded-lg p-2 min-h-[80px] text-left ">
            <div class="font-bold">{{ day.day }}</div>
            <div class="mt-1 space-y-1">
              <div v-for="task in tasksForDay(day.date)" :key="task.id" class="bg-success  text-xs px-2 py-1 rounded">
                {{ task.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppNavigation>
</template>
