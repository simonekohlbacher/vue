<script setup>
import { onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCategories } from '@/useCategories.js'
import { getFileUrl } from "@/pocketbase.js"
import TaskList from '@/components/TaskList.vue'
import AppNavigation from '@/components/layouts/AppNavigation.vue'

const router = useRouter()
const route = useRoute()
const { currentCategory, setCategory, deleteCategory, formatInputToDate, formatDateToInput, updateCategoryField } = useCategories()

// Wenn Seite lädt, setze die Kategorie basierend auf der ID in der URL
onMounted(() => {
  setCategory(route.params.id)
})


// task bearbeiten, hilfe von chat
// für jedes feld speichern, ob es gerade bearbeitet wird t/f
const editState = reactive({
  title: baseEditState(),
  description: baseEditState(),
  deadline: baseEditState(),
})

// Hilfsfunktion, um den Bearbeitungszustand zu initialisieren und nicht zu wiederholen
function baseEditState() {
  return { editing: false, value: '' }
}

// holt den aktuellen Wert des Feldes, wenn es nicht bearbeitet wird
// Feld zeigt dann den input feld mit wert statt normalen text
function startEditing(field) {
  const raw = currentCategory.value[field] ?? ''
  // wenn deadline dann formatiere datum für den Input, sonst direkt den wert
  editState[field].value = field === 'deadline'
    ? formatDateToInput(raw)
    : raw
  // setzt bearbeitungszustand auf true
  editState[field].editing = true
}

// neuen wert speichern
function handleEdit(field) {
  // datum wieder in das richtige Format bringen
  const newValue = field === 'deadline' ? formatInputToDate(editState[field].value) : editState[field].value
  // den aktuellen Wert der Kategorie aktualisieren und in db speichern
  currentCategory.value[field] = newValue
  updateCategoryField(field, newValue)
  editState[field].editing = false
}

// kategorie löschen
function handleDeleteCategory(categoryId) {
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
      <RouterLink to="/home" class="text-sm hover:underline inline-block mb-4">← Zurück zur Übersicht</RouterLink>
      <div v-if="currentCategory" class="rounded-xl shadow-md p-6 space-y-6 relative">
        <button @click="handleDeleteCategory(currentCategory.id)" class="absolute top-4 right-4 hover:text-accent">
          <font-awesome-icon :icon="['fas', 'trash']" />
        </button>
        <h1 class="text-2xl font-bold mb-4">
          <!-- zeigt den normalen Titel-Text, nur wenn nicht im Bearbeitungsmodus  -->
          <span v-if="!editState.title.editing" class="cursor-pointer select-none" @click="startEditing('title')">
            {{ currentCategory.title }}
          </span>
          <!-- zeigt den Input-Feld, wenn im Bearbeitungsmodus -->
          <input v-else v-model="editState.title.value"
                 @blur="() => handleEdit('title')"
                 @keyup.enter="() => handleEdit('title')"
            class="border rounded px-2 py-1 w-full text-2xl font-bold"
            autofocus
          />
        </h1>

        <p class="text-sm flex items-center gap-2">
          <font-awesome-icon :icon="['fas', 'calendar-days']" />
          <span
            v-if="!editState.deadline.editing"
            class="font-medium ml-2 cursor-pointer select-none hover:text-accent"
            @click="startEditing('deadline')">
            {{ currentCategory.deadline ? new Date(currentCategory.deadline).toLocaleDateString() : 'Kein Datum' }}
          </span>
          <input
            v-else
            type="date"
            v-model="editState.deadline.value"
            @blur="() => handleEdit('deadline')"
            @keyup.enter="() => handleEdit('deadline')"
            class="border rounded px-2 py-1 font-medium ml-2"
            autofocus
          />
        </p>

        <div>
          <p v-if="!editState.description.editing" class="leading-relaxed cursor-pointer select-none" @click="startEditing('description')">
            {{ currentCategory.description }}
          </p>
          <textarea
            v-else
            v-model="editState.description.value"
            @blur="() => handleEdit('description')"
            @keyup.enter="() => handleEdit('description')"
            class="border rounded w-full p-2"
            autofocus
          ></textarea>
        </div>
        <div v-if="currentCategory.img" class="mt-4">
          <img
            :src="getFileUrl('categories', currentCategory.id, currentCategory.img)"
            alt="Kategorie Bild"
            class="w-full max-w-lg rounded-lg shadow-lg mx-auto"
          />
        </div>
        <div class="pt-6 border-t border-gray-200">
          <h2 class="text-lg font-semibold mb-4">Aufgaben</h2>
          <TaskList/>
        </div>
      </div>

      <div v-else class="text-center mt-10">
        <p>Kategorie nicht gefunden</p>
      </div>
    </div>
  </AppNavigation>
</template>
