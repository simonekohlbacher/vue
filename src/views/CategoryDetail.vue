<script setup>
import { onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCategories } from '@/useCategories.js'
import { getFileUrl } from "@/pocketbase.js"
import TaskList from '@/components/TaskList.vue'
import AppNavigation from '@/components/layouts/AppNavigation.vue'
import { pb } from '@/pocketbase.js'

const router = useRouter()
const route = useRoute()


const { currentCategory, setCategory, deleteCategory } = useCategories()

onMounted(() => {
  setCategory(route.params.id)
})

const editState = reactive({
  title: { editing: false, value: '' },
  description: { editing: false, value: '' },
  deadline: { editing: false, value: '' },
})

// Hilfsfunktionen für Datum <-> input[type=date]
function formatDateToInput(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatInputToDate(inputStr) {
  if (!inputStr) return null
  const d = new Date(inputStr)
  return d.toISOString()
}

function startEditing(field) {
  if (field === 'deadline') {
    editState.deadline.value = formatDateToInput(currentCategory.value.deadline)
  } else {
    editState[field].value = currentCategory.value[field] || ''
  }
  editState[field].editing = true
}

function save(field) {
  if (field === 'deadline') {
    currentCategory.value.deadline = formatInputToDate(editState.deadline.value)
  } else {
    currentCategory.value[field] = editState[field].value
  }
  editState[field].editing = false
  updateField(field)
}

function updateField(field) {
  try {
    pb.collection('categories').update(currentCategory.value.id, {
      [field]: currentCategory.value[field],
    })
  } catch (error) {
    console.error(`Fehler beim Aktualisieren von ${field}`, error)
  }
}

function handleDeleteCategory(categoryId) {
  if (!categoryId) {
    console.error('Keine Kategorie-ID angegeben.');
    return;
  }

  if (confirm('Bist du sicher, dass du diese Kategorie löschen möchtest?')) {
    const success = deleteCategory(categoryId);
    if (success) {
      router.push('/home');
    }
  }
}
</script>

<template>
  <AppNavigation>
    <div class="p-6 max-w-4xl mx-auto">
      <!-- Zurück-Button -->
      <RouterLink to="/home" class="text-sm hover:underline inline-block mb-4">
        ← Zurück zur Übersicht
      </RouterLink>

      <div v-if="currentCategory" class="rounded-xl shadow-md p-6 space-y-6 relative">

        <button
          @click="handleDeleteCategory(currentCategory.id)"
          class="absolute top-4 right-4 hover:text-accent">
          <font-awesome-icon :icon="['fas', 'trash']" />
        </button>

        <h1 class="text-2xl font-bold mb-4">
          <span
            v-if="!editState.title.editing"
            class="cursor-pointer select-none"
            @click="startEditing('title')"
          >
            {{ currentCategory.title }}
          </span>
          <input
            v-else
            v-model="editState.title.value"
            @blur="() => save('title')"
            @keyup.enter="() => save('title')"
            class="border rounded px-2 py-1 w-full text-2xl font-bold"
            autofocus
          />
        </h1>

        <!-- Deadline -->
        <p class="text-sm flex items-center gap-2">
          <font-awesome-icon :icon="['fas', 'calendar-days']" />
          <span
            v-if="!editState.deadline.editing"
            class="font-medium ml-2 cursor-pointer select-none hover:text-accent"
            @click="startEditing('deadline')"
          >
            {{ currentCategory.deadline ? new Date(currentCategory.deadline).toLocaleDateString() : 'Kein Datum' }}
          </span>
          <input
            v-else
            type="date"
            v-model="editState.deadline.value"
            @blur="() => save('deadline')"
            @keyup.enter="() => save('deadline')"
            class="border rounded px-2 py-1 font-medium ml-2"
            autofocus
          />
        </p>

        <!-- Description -->
        <div>
          <p
            v-if="!editState.description.editing"
            class="leading-relaxed cursor-pointer select-none"
            @click="startEditing('description')"
          >
            {{ currentCategory.description }}
          </p>

          <textarea
            v-else
            v-model="editState.description.value"
            @blur="() => save('description')"
            @keyup.enter="() => save('description')"
            class="border rounded w-full p-2"
            autofocus
          ></textarea>
        </div>

        <!-- Image -->
        <div v-if="currentCategory.img" class="mt-4">
          <img
            :src="getFileUrl('categories', currentCategory.id, currentCategory.img)"
            alt="Kategorie Bild"
            class="w-full max-w-lg rounded-lg shadow-lg mx-auto"
          />
        </div>

        <!-- Tasks -->
        <div class="pt-6 border-t border-gray-200">
          <h2 class="text-lg font-semibold mb-3">Aufgaben</h2>
          <TaskList :categoryId="currentCategory.id" />
        </div>
      </div>

      <div v-else class="text-center mt-10">
        <p>Kategorie nicht gefunden</p>
      </div>
    </div>
  </AppNavigation>
</template>
