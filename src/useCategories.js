import { onMounted, readonly, ref, computed } from 'vue'
import { pb } from './pocketbase.js'
import { useAuth } from '@/useAuth.js'
import { useWebNotification } from '@vueuse/core'


// singleton variablen
const categories = ref([])
const currentCategory = ref(null)
const tasks = ref([])

// Berechnete variablen für die Gesamtkosten und -schätzungen
const totalEstimate = computed(() => {
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

export function useCategories() {
  const { currentUser } = useAuth()

  onMounted(() => {
    fetchCategories()
  })

  // ---------------------------------------------
  // fetch categories von DB
  const fetchCategories = async () => {
    try {
      categories.value = await pb.collection('categories').getFullList({
        // nur die Kategorien des aktuellen Benutzers
        filter: `user = "${currentUser.value.id}"`,
        expand: 'user',
      })
      // lädt die aktuelle Kategorie aus dem localStorage, falls vorhanden, damit beim seitenreload die letzte Kategorie erhalten bleibt (user auf detailseite bleibt und kein error kommt)
      const savedCurrentCategory = JSON.parse(localStorage.currentCategory ?? 'null') ?? null
      if (savedCurrentCategory) {
        await setCategory(savedCurrentCategory.id)
      }
    } catch (e) {
      console.error('Fehler beim Laden der Kategorien:', e)
    }
  }

  // ---------------------------------------------
  // kategorie setzen
  const setCategory = async (categoryId) => {
    const foundCategory = categories.value.find((category) => category.id === categoryId)
    if (foundCategory) {
      currentCategory.value = foundCategory
      localStorage.currentCategory = JSON.stringify(foundCategory)

      // tasks laden
      tasks.value = await pb.collection('tasks').getFullList({
        filter: `category = "${categoryId}"`,
        expand: 'user'
      });
    }
  }

  // ---------------------------------------------
  // kategorie erstellen
  const createCategory = async (title, description, img, deadline) => {
    const newCategory = {
      title,
      description,
      img,
      state: 'not_started',
      deadline,
      user: currentUser.value.id,
    }
    await pb.collection('categories').create(newCategory)
    await fetchCategories() // zum aktualisieren der Kategorienliste

    // Notification
    const { permissionGranted, requestPermission, show } = useWebNotification({
      title: 'Kategorie erstellt!',
      body: `Die Kategorie "${title}" wurde erfolgreich angelegt.`,
      tag: 'category-created',
      renotify: true,
    })
    if (!permissionGranted.value) {
      await requestPermission()
    }
    if (permissionGranted.value) {
      show()
    }
  }

  // ---------------------------------------------
  // kategorie löschen
  const deleteCategory = async (id) => {
    try {
      // zuerst prüfen, ob es Tasks in dieser Kategorie gibt
      const tasks = await pb.collection('tasks').getFullList({
        filter: `category="${id}"`,
      })
      if (tasks.length > 0) {
        alert('Diese Kategorie kann nicht gelöscht werden, weil noch Tasks existieren.')
        return false
      }
      await pb.collection('categories').delete(id)
      await fetchCategories()
      currentCategory.value = null
      return true
    } catch (error) {
      console.error('Fehler beim Löschen:', JSON.stringify(error, null, 2))
      return false
    }
  }

  // ---------------------------------------------
  // font awesome icon je nach status
  const getStateIcon = (state) => {
    switch (state) {
      case 'in_progress': return ['fas', 'hourglass-half'];
      case 'done':return ['fas', 'circle-check']
      case 'not_started':return ['fas', 'ban']
      default:
        return ['fas', 'ban']
    }
  };


  // ---------------------------------------------
  // kategorie felder bearbeiten
  const updateCategoryField = async (field, value) => {
    return pb.collection('categories').update(currentCategory.value.id, {
      [field]: value,
    })
  }


  // ---------------------------------------------
  // Hilfsfunktionenen für Datum <-> input[type=date]
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


  // ---------------------------------------------
  // gibt funktionen zurück
  return {
    categories: readonly(categories),
    currentCategory: currentCategory,
    tasks: readonly(tasks),
    fetchCategories,
    setCategory,
    createCategory,
    deleteCategory,
    totalDiff: readonly(totalDiff),
    totalEstimate: readonly(totalEstimate),
    totalCosts: readonly(totalCosts),
    getStateIcon,
    formatDateToInput,
    formatInputToDate,
    updateCategoryField
  }
}
