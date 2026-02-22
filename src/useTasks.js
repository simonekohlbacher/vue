import { readonly, ref, computed, watch } from 'vue'
import { pb } from './pocketbase.js'
import { useAuth } from '@/useAuth.js'

// Singleton-Variablen (behalten ihren Status über alle Komponenten hinweg)
const allTasks = ref([])
const categoryTasks = ref([])

// Berechnete Variablen für die Gesamtkosten
const totalEstimate = computed(() => {
  return allTasks.value.reduce((sum, task) => sum + (task.costs_estimate ?? 0), 0)
})

const totalCosts = computed(() => {
  return allTasks.value.reduce((sum, task) => sum + (task.costs ?? 0), 0)
})

const totalDiff = computed(() => {
  return allTasks.value.reduce((sum, task) => {
    const actual = task.costs ?? 0
    const estimate = task.costs_estimate ?? 0
    const diff = actual > 0 ? actual - estimate : 0
    return sum + diff
  }, 0)
})

// FLAG: Damit wir den Watcher nur ein einziges Mal global registrieren
let isWatcherSet = false

export function useTasks() {
  const { currentUser } = useAuth()

  // ---------------------------------------------
  // tasks laden
  const fetchAllTasks = async () => {
    if (!currentUser.value?.id) {
      allTasks.value = [] // Leeren, falls kein User eingeloggt ist
      return
    }
    allTasks.value = await pb.collection('tasks').getFullList({
      filter: `user = "${currentUser.value.id}"`,
    })
  }

  const fetchCategoryTasks = async (categoryId) => {
    if (!currentUser.value?.id) return
    categoryTasks.value = await pb.collection('tasks').getFullList({
      filter: `user = "${currentUser.value.id}" && category = "${categoryId}"`,
    })
  }

  // ---------------------------------------------
  // DIE LÖSUNG: Der Singleton-Watcher
  // Registriert sich nur einmal und lädt automatisch alle Tasks,
  // sobald die User-ID verfügbar ist.
  if (!isWatcherSet) {
    watch(
      () => currentUser.value?.id,
      (id) => {
        if (id) fetchAllTasks()
      },
      { immediate: true },
    )
    isWatcherSet = true
  }

  // ---------------------------------------------
  // task erstellen
  const createTask = async (title, description, costs_estimate, comment, deadline, categoryId) => {
    const newTask = {
      title,
      description,
      costs_estimate,
      comment,
      deadline,
      state: 'not_started',
      user: currentUser.value.id,
      category: categoryId,
    }
    await pb.collection('tasks').create(newTask)
    await fetchAllTasks()
    await fetchCategoryTasks(categoryId)
  }

  // ---------------------------------------------
  // task löschen
  const deleteTask = async (id, categoryId) => {
    try {
      await pb.collection('tasks').delete(id)
      await fetchAllTasks()
      if (categoryId) await fetchCategoryTasks(categoryId)
      return true
    } catch (error) {
      console.error('Fehler beim Löschen:', error)
      return false
    }
  }

  // ----------------------------------------------
  // Währungsformatierung
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(value ?? 0)
  }

  // ---------------------------------------------
  // task felder bearbeiten
  const updateTaskField = async (taskId, field, value) => {
    return pb.collection('tasks').update(taskId, {
      [field]: value,
    })
  }

  // ---------------------------------------------
  return {
    allTasks: readonly(allTasks),
    categoryTasks: readonly(categoryTasks),
    fetchAllTasks,
    fetchCategoryTasks,
    totalDiff,
    totalEstimate,
    totalCosts,
    createTask,
    deleteTask,
    updateTaskField,
    formatCurrency,
  }
}
