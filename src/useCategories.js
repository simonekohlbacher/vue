import { onMounted, readonly, ref } from 'vue'
import { pb } from './pocketbase.js'
import { useAuth } from '@/useAuth.js'
import { useWebNotification } from '@vueuse/core'
import { useTasks } from '@/useTasks.js'

// singleton variablen
const categories = ref([])
const currentCategory = ref(null)
const { fetchTasks } = useTasks()

export function useCategories() {
  const { currentUser } = useAuth()

  onMounted(() => {
    fetchCategories()
  })

  // ---------------------------------------------
  // fetch categories von DB
  const fetchCategories = async () => {
    try {
      const catList = await pb.collection('categories').getFullList({
        filter: `user = "${currentUser.value.id}"`,
        expand: 'user',
      })

      for (const cat of catList) {
        const tasks = await pb.collection('tasks').getFullList({
          filter: `category = "${cat.id}" && user = "${currentUser.value.id}"`,
        })
        const newState = checkCategoryState(tasks)
        // nur updaten, wenn sich was geändert hat
        if (cat.state !== newState) {
          await pb.collection('categories').update(cat.id, { state: newState })
          cat.state = newState // lokal auch aktualisieren
        }
      }
      categories.value = catList
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

      // Tasks neu laden, wenn Kategorie wechselt
      await fetchTasks(foundCategory.id)
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
      const categoryTasks = await pb.collection('tasks').getFullList({
        filter: `category="${id}"`,
      })
      if (categoryTasks.length > 0) {
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
      default:return ['fas', 'ban']
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
  // checkt den Status der Kategorie basierend auf den jeweiligen Tasks-Stati
  function checkCategoryState(tasks) {
    if (!tasks || tasks.length === 0) return 'not_started'

    const hasInProgress = tasks.some(task => task.state === 'in_progress')
    const allDone = tasks.every(task => task.state === 'done')

    if (allDone) return 'done'
    if (hasInProgress) return 'in_progress'
    return 'not_started'
  }



  // ---------------------------------------------
  // gibt funktionen zurück
  return {
    categories: readonly(categories),
    currentCategory: currentCategory,
    fetchCategories,
    setCategory,
    createCategory,
    deleteCategory,
    getStateIcon,
    formatDateToInput,
    formatInputToDate,
    updateCategoryField,
    checkCategoryState
  }
}
