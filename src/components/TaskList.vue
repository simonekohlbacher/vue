<script setup>
import { useCategories } from "@/useCategories.js";
import TaskItem from "@/components/TaskItem.vue";
import Modal from "@/components/Modal.vue";
import { ref } from "vue";

const { tasks, createTask, currentCategory } = useCategories();

// Form-Daten
const newTaskTitle = ref('')
const newTaskDescription = ref('')
const newTaskCostsEstimated = ref(0)
const newTaskComment = ref('')
const newTaskDeadline = ref(null)

const modalRef = ref(null) // Ref für das Modal

const handleCreateTask = () => {
  if (!newTaskTitle.value || !newTaskCostsEstimated.value) {
    alert('Bitte Titel und geschätzte Kosten eingeben')
    return
  }

  createTask(
    newTaskTitle.value,
    newTaskDescription.value,
    newTaskCostsEstimated.value,
    newTaskComment.value,
    newTaskDeadline.value
  )

  // Felder leeren
  newTaskTitle.value = ''
  newTaskDescription.value = ''
  newTaskCostsEstimated.value = 0
  newTaskComment.value = ''
  newTaskDeadline.value = null

  // 👉 Modal schließen
  if (modalRef.value) {
    modalRef.value.close()
  }
}

function formatDateForInput(dateStr) {
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
</script>

<template>
  <!-- Modal -->
  <Modal
    ref="modalRef"
    btnClass="btn btn-success"
    btnText="Neue Aufgabe"
  >
    <div class="flex flex-col gap-5">
      <h2 class="text-lg font-bold">Neue Aufgabe</h2>

      <label class="floating-label w-full">
        <span>Titel*</span>
        <input v-model="newTaskTitle" type="text" placeholder="Titel" class="input input-sm w-full"/>
      </label>

      <label class="floating-label w-full">
        <span>Beschreibung</span>
        <textarea v-model="newTaskDescription" placeholder="Beschreibung" class="textarea textarea-sm w-full"></textarea>
      </label>

      <label class="floating-label w-full">
        <span>Geschätzte Kosten*</span>
        <input v-model="newTaskCostsEstimated" type="number" placeholder="0" class="input input-sm w-full"/>
      </label>

      <label class="floating-label w-full">
        <span>Kommentar</span>
        <textarea v-model="newTaskComment" placeholder="Kommentar" class="textarea textarea-xs w-full"></textarea>
      </label>

      <label class="floating-label w-full">
        <span>Deadline*</span>
        <input
          v-model="newTaskDeadline"
          type="date"
          class="input input-sm w-full"
          :max="currentCategory?.deadline ? formatDateForInput(currentCategory.deadline) : null"
        />
      </label>

      <button class="btn btn-success" @click="handleCreateTask">Speichern</button>
    </div>
  </Modal>

  <div v-if="tasks && tasks.length">
    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      <TaskItem v-for="task in tasks" :key="task.id" :task="task" />
    </div>
  </div>

  <div v-else class="text-gray-400 mt-8">Noch keine Aufgaben vorhanden.</div>
</template>


