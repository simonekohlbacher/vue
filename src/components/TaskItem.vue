<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { useTasks } from '@/useTasks.js'
import { useCategories } from '@/useCategories.js'

const { deleteTask, formatCurrency, updateTaskField } = useTasks()
const { formatInputToDate, currentCategory } = useCategories()

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const localTask = reactive({
  title: '',
  description: '',
  state: '',
  costs_estimate: 0,
  costs: 0,
  deadline: null
})

const diff = ref(null)

const editState = reactive({
  title: { editing: false, value: '' },
  description: { editing: false, value: '' },
  costs: { editing: false, value: 0 },
  deadline: { editing: false, value: null }
})


onMounted(() => {
  Object.assign(localTask, {
    title: props.task.title,
    description: props.task.description,
    state: props.task.state,
    costs_estimate: props.task.costs_estimate ?? 0,
    costs: props.task.costs ?? 0,
    deadline: props.task.deadline ?? null
  })
})

function updateDiff() {
  diff.value = localTask.costs - (localTask.costs_estimate ?? 0)
}

watch(() => localTask.costs, () => updateDiff())

const formattedEstimate = computed(() => formatCurrency(localTask.costs_estimate));
const formattedCosts = computed(() => formatCurrency(localTask.costs));
const formattedDiff = computed(() => formatCurrency(diff.value, ''));

function startEditing(field) {
  if (field === 'deadline') {
    editState.deadline.value = localTask.deadline
      ? localTask.deadline.substring(0, 10)
      : ''
  } else if (field === 'costs') {
    editState[field].value = localTask[field] ?? 0
  } else {
    editState[field].value = localTask[field] ?? ''
  }
  editState[field].editing = true
}


function handleEdit(field) {
  if (field === 'deadline') {
    localTask.deadline = editState.deadline.value
      ? formatInputToDate(editState.deadline.value)
      : ''
  } else if (field === 'state') {
    // Kein Zugriff auf editState.state.value, sondern direkt localTask.state nehmen
    // localTask.state ist ja schon v-model gebunden, daher brauchst du hier nix machen
  } else {
    // Für alle anderen Felder aus editState
    localTask[field] = editState[field].value
  }
  const payloadValue = localTask[field] || ''
  updateTaskField(props.task.id, field, payloadValue)

  if (editState[field]) {
    editState[field].editing = false
  }
}


function handleDeleteTask(taskId) {
  if (confirm('Möchtest du diese Aufgabe wirklich löschen?')) {
    deleteTask(taskId);
  }
}


</script>

<template>
  <div class="relative rounded-2xl border border-base-300 p-6 flex flex-col gap-4 transition duration-200 hover:shadow-xl">

    <div class="flex flex-row justify-between">

      <!-- Titel -->
      <h2 class="text-xl font-bold">
      <span v-if="!editState.title.editing" class="cursor-pointer select-none" @click="startEditing('title')">
        {{ localTask.title }}
      </span>
        <input v-else v-model="editState.title.value" @blur="() => handleEdit('title')" @keyup.enter="() => handleEdit('title')" class="border rounded px-2 py-1 w-full text-xl font-bold" autofocus />
      </h2>

      <div class="flex flex-row gap-4">
    <!-- Deadline -->
      <div class=" flex items-center gap-1 text-sm">
        <font-awesome-icon :icon="['fas', 'calendar-days']" />
        <span
          v-if="!editState.deadline.editing"
          class="cursor-pointer select-none hover:text-accent"
          @click="startEditing('deadline')"
        >
          {{ localTask.deadline ? new Date(localTask.deadline).toLocaleDateString() : 'Kein Datum' }}
        </span>
        <input
          v-else
          type="date"
          v-model="editState.deadline.value"
          :max="currentCategory.deadline.substring(0, 10)"
          @blur="() => handleEdit('deadline')"
          @keyup.enter="() => handleEdit('deadline')"
          class="border rounded px-2 py-1 font-medium ml-2"
          autofocus
        />
      </div>

    <!-- Löschen -->
    <button
      @click="handleDeleteTask(props.task.id)"
      class=" hover:text-accent">
      <font-awesome-icon :icon="['fas', 'trash']" />
    </button>

      </div>
    </div>

    <!-- Beschreibung -->
    <div v-if="localTask.description">
      <p v-if="!editState.description.editing" class="cursor-pointer select-none" @click="startEditing('description')">
        {{ localTask.description }}
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

    <!-- Status -->
    <div>
      <label class="block text-sm font-semibold mb-1">Status:</label>
      <select
        v-model="localTask.state"
        @change="handleEdit('state')"
        class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring"
      >
        <option value="not_started">Noch nicht begonnen</option>
        <option value="in_progress">In Bearbeitung</option>
        <option value="done">Abgeschlossen</option>
      </select>
    </div>

    <!-- Kosten -->
    <div class="mt-auto space-y-2 text-sm">
      <div>
        <span class="font-semibold">Geschätzte Kosten:</span>
        {{ formattedEstimate }}
      </div>

      <div class="flex items-center flex-wrap gap-2">
        <label class="font-semibold whitespace-nowrap">Tatsächliche Kosten:</label>
        <span v-if="!editState.costs.editing" class="cursor-pointer select-none" @click="startEditing('costs')">
          {{ formattedCosts }}
        </span>
        <input
          v-else
          v-model.number="editState.costs.value"
          @blur="() => handleEdit('costs')"
          @keyup.enter="() => handleEdit('costs')"
          type="number"
          min="0"
          step="0.01"
          class="border border-gray-300 rounded px-2 py-1 w-28 text-sm focus:outline-none focus:ring"
          autofocus
        />
      </div>

      <div v-if="diff !== null && diff > 0 || diff < 0">
        <span class="font-semibold">Differenz: </span>
        <span :class="diff >= 0 ? 'text-red-600' : 'text-green-600'">
           {{ formattedDiff }}
        </span>
      </div>
    </div>
  </div>
</template>
