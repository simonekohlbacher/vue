import { readonly, ref, computed } from 'vue'
import { pb } from './pocketbase.js';
import { useAuth } from "@/useAuth.js";
const { currentUser } = useAuth();

// tasks als singleton variable damit es bei berechnung der totals nicht immer neu geladen wird
const tasks = ref([])

// Berechnete variablen für die Gesamtkosten und -schätzungen
const totalEstimate = computed(() => {
  // geht alle tasks durch und summiert wert des costs_estimate property
  return tasks.value.reduce((sum, task) => {
    return sum + (task.costs_estimate ?? 0)
  }, 0)
})

const totalCosts = computed(() => {
  return tasks.value.reduce((sum, task) => {
    return sum + (task.costs ?? 0)
  }, 0)
})

const totalDiff = computed(() => {
  return tasks.value.reduce((sum, task) => {
    const actual = task.costs ?? 0
    const estimate = task.costs_estimate ?? 0
    const diff = actual > 0 ? actual - estimate : 0
    return sum + diff
  }, 0)
})

export function useTasks() {

  // ---------------------------------------------
  // tasks laden
  const fetchTasks = async (categoryId = null) => {
    const filterParts = [`user = "${currentUser.value.id}"`];
    if (categoryId) {
      filterParts.push(`category = "${categoryId}"`);
    }
    tasks.value = await pb.collection('tasks').getFullList({
      filter: filterParts.join(' && '),
    });
  }


  // ---------------------------------------------
  // task erstellen
  const createTask = async (title, description, costs_estimate, comment, deadline, categoryId) => {
    const newTask = {
      title: title,
      description: description,
      costs_estimate: costs_estimate,
      comment: comment,
      deadline: deadline,
      state: 'not_started',
      user : currentUser.value.id,
      category: categoryId,
    };
    await pb.collection('tasks').create(newTask);
    await fetchTasks();
  }


  // ---------------------------------------------
  // task löschen
  const deleteTask = async (id) => {
    try {
      await pb.collection('tasks').delete(id)
      // Tasks neu laden, um die Liste zu aktualisieren
      await fetchTasks()
      return true
    } catch (error) {
      console.error('Fehler beim Löschen:', JSON.stringify(error, null, 2))
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
    }).format(value ?? 0);
  };


  // ---------------------------------------------
  // task felder bearbeiten
  const updateTaskField = async (taskId, field, value) => {
    return pb.collection('tasks').update(taskId, {
      [field]: value
    })
  }

  // ---------------------------------------------
  // rückgabe des composables
  return {
    tasks: readonly(tasks),
    createTask,
    deleteTask,
    fetchTasks,
    totalDiff: readonly(totalDiff),
    totalEstimate: readonly(totalEstimate),
    totalCosts: readonly(totalCosts),
    formatCurrency,
    updateTaskField,
  }
}


