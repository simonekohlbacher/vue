<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { pb } from '@/pocketbase'

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
  updateDiff()
})

function updateDiff() {
  diff.value = localTask.costs - (localTask.costs_estimate ?? 0)
}

watch(() => localTask.costs, () => updateDiff())

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

async function save(field) {
  if (field === 'deadline') {
    localTask.deadline = editState.deadline.value
      ? formatInputToDate(editState.deadline.value)
      : ''
  } else {
    localTask[field] = editState[field].value
  }

  const payload = {}
  payload[field] = localTask[field] || ''

  console.log('Payload:', payload)

  editState[field].editing = false

  try {
    await pb.collection('tasks').update(props.task.id, payload)
    if (field === 'costs') updateDiff()
  } catch (error) {
    console.error(`Fehler beim Speichern von ${field}:`, error)
  }
}

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


async function updateStatus() {
  try {
    await pb.collection('tasks').update(props.task.id, {
      state: localTask.state
    })
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Status:', error)
  }
}

function handleDeleteTask(taskId) {
  if (confirm('Möchtest du diese Aufgabe wirklich löschen?')) {
    pb.collection('tasks').delete(taskId)
      .then(() => {
        window.location.reload()
      })
      .catch(error => {
        console.error('Fehler beim Löschen der Aufgabe:', error)
      })
  }
}
</script>

<template>
  <div
    class="relative rounded-2xl shadow-md p-6 flex flex-col gap-4 transition duration-200 hover:shadow-xl">

    <!-- Deadline -->
    <div class="absolute top-8 right-2 flex items-center gap-1 text-sm text-gray-600">
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
        @blur="() => save('deadline')"
        @keyup.enter="() => save('deadline')"
        class="border rounded px-2 py-1 font-medium ml-2"
        autofocus
      />
    </div>

    <!-- Löschen -->
    <button
      @click="handleDeleteTask(props.task.id)"
      class="absolute top-1 right-2 hover:text-accent">
      <font-awesome-icon :icon="['fas', 'trash']" />
    </button>

    <!-- Titel -->
    <h2 class="text-xl font-bold">
      <span
        v-if="!editState.title.editing"
        class="cursor-pointer select-none"
        @click="startEditing('title')"
      >
        {{ localTask.title }}
      </span>
      <input
        v-else
        v-model="editState.title.value"
        @blur="() => save('title')"
        @keyup.enter="() => save('title')"
        class="border rounded px-2 py-1 w-full text-xl font-bold"
        autofocus
      />
    </h2>

    <!-- Beschreibung -->
    <div>
      <p
        v-if="!editState.description.editing"
        class="cursor-pointer select-none"
        @click="startEditing('description')"
      >
        {{ localTask.description || 'Keine Beschreibung' }}
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

    <!-- Status -->
    <div>
      <label class="block text-sm font-semibold mb-1">Status:</label>
      <select
        v-model="localTask.state"
        @change="updateStatus"
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
        {{ localTask.costs_estimate ?? '—' }} €
      </div>

      <div class="flex items-center flex-wrap gap-2">
        <label class="font-semibold whitespace-nowrap">Tatsächliche Kosten:</label>
        <span v-if="!editState.costs.editing" class="cursor-pointer select-none" @click="startEditing('costs')">
          {{ localTask.costs }} €
        </span>
        <input
          v-else
          v-model.number="editState.costs.value"
          @blur="() => save('costs')"
          @keyup.enter="() => save('costs')"
          type="number"
          min="0"
          step="0.01"
          class="border border-gray-300 rounded px-2 py-1 w-28 text-sm focus:outline-none focus:ring"
          autofocus
        />
      </div>

      <div v-if="diff !== null && diff > 0">
        <span class="font-semibold">Differenz:</span>
        <span :class="diff >= 0 ? 'text-red-600' : 'text-green-600'">
          {{ diff }} €
        </span>
      </div>
    </div>
  </div>
</template>
