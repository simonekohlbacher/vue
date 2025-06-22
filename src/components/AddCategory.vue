<script setup>
import { ref } from 'vue'
import Modal from '@/components/Modal.vue'
import { useCategories } from '@/useCategories.js'

const { createCategory } = useCategories()

// Form-Daten
const newCategoryTitle = ref('')
const newCategoryImage = ref(null)
const newCategoryDescription = ref('')
const newCategoryDeadline = ref(null)
const modalRef = ref(null) // Zugriff auf das Modal

const handleCreateCategory = () => {
  if (!newCategoryTitle.value || !newCategoryDeadline.value) {
    alert('Bitte Titel und Fälligkeitsdatum eingeben')
    return
  }
  const img = newCategoryImage.value?.files?.[0]
  createCategory(newCategoryTitle.value, newCategoryDescription.value, img, newCategoryDeadline.value)
  // Felder leeren & Modal schließen
  newCategoryTitle.value = ''
  newCategoryDescription.value = ''
  newCategoryDeadline.value = null
  if (newCategoryImage.value) {
    newCategoryImage.value.value = ''
  }
  if (modalRef.value) {
    modalRef.value.close()
  }
}
</script>


<template>
  <!-- Modal -->
  <Modal btnClass="btn btn-success" btnText="Neue Kategorie" ref="modalRef">
      <div class="flex flex-col gap-5">
        <h2 class="text-lg font-bold">Neue Kategorie</h2>

        <label class="floating-label w-full">
          <span>Titel*</span>
          <input v-model="newCategoryTitle" type="text" placeholder="Titel" class="input input-sm w-full"/>
        </label>

        <label class="floating-label w-full">
          <span>Beschreibung</span>
          <textarea v-model="newCategoryDescription" placeholder="Beschreibung" class="textarea textarea-sm w-full"
          ></textarea>
        </label>

        <label class="floating-label w-full">
          <span>Fällig am*</span>
          <input v-model="newCategoryDeadline" type="date" class="input input-sm w-full"/>
        </label>

        <label class="floating-label w-full">
          <span>Bild</span>
          <input ref="newCategoryImage" type="file" class="file-input file-input-sm file-input-ghost w-full"/>
        </label>

        <button class="btn btn-success" @click="handleCreateCategory">Speichern</button>
      </div>
  </Modal>
</template>
