import { onMounted, readonly, ref, computed } from "vue";
import { pb } from './pocketbase.js';
import { useAuth } from "@/useAuth.js";
import { useWebNotification } from '@vueuse/core'


const categories = ref([]);
const currentCategory = ref(null);
const tasks = ref([]);


const totalDiff = computed(() => {
  return tasks.value.reduce((sum, task) => {
    const actual = task.costs ?? 0;
    const estimate = task.costs_estimate ?? 0;
    const diff = actual > 0 ? actual - estimate : 0;
    return sum + diff;
  }, 0);
});

const totalEstimate = computed(() => {
  return tasks.value.reduce((sum, task) => {
    return sum + (task.costs_estimate ?? 0);
  }, 0);
});

const totalCosts = computed(() => {
  return tasks.value.reduce((sum, task) => {
    return sum + (task.costs ?? 0);
  }, 0);
});


export function useCategories() {
  const { currentUser } = useAuth();


  const fetchCategories = async () => {
    try {
      categories.value = await pb.collection('categories').getFullList({
        filter: `user = "${currentUser.value.id}"`,
        expand: 'user'
      });

      const savedCurrentCategory = JSON.parse(localStorage.currentCategory ?? 'null') ?? null;
      if (savedCurrentCategory) {
        await setCategory(savedCurrentCategory.id);
      }


    } catch (e) {
      console.error('Fehler beim Laden der Kategorien:', e);
    }
  };



  const setCategory = async (categoryId) => {

    const foundCategory = categories.value.find(category => category.id === categoryId);
    if (foundCategory) {
      currentCategory.value = foundCategory;
      localStorage.currentCategory = JSON.stringify(foundCategory);

      // tasks laden
      tasks.value = await pb.collection('tasks').getFullList({
        filter: `category = "${categoryId}"`,
        expand: 'user'
      });
    }
  }


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
    await fetchCategories()

    // Notification Setup
    const { permissionGranted, requestPermission, show, } = useWebNotification({
      title: 'Kategorie erstellt!',
      body: `Die Kategorie "${title}" wurde erfolgreich angelegt.`,
      tag: 'category-created',
      renotify: true,
    })

    if (!permissionGranted.value) {
      await requestPermission() // Erlaubnis einholen
    }

    if (permissionGranted.value) {
      show()
    }
  }


  onMounted(() => {
    fetchCategories();
  });


  const createTask = async (title, description, costs_estimate, comment, deadline) => {
    const newTask = {
      title: title,
      description: description,
      costs_estimate: costs_estimate,
      comment: comment,
      deadline: deadline,
      state: 'not_started',
      user : currentUser.value.id,
      category: currentCategory.value.id,
    };
    await pb.collection('tasks').create(newTask);
    await fetchCategories();

  }

const deleteCategory = async (id) => {
    try {
      const tasks = await pb.collection('tasks').getFullList({
        filter: `category="${id}"`
      });

      if (tasks.length > 0) {
        alert('Diese Kategorie kann nicht gelöscht werden, weil noch Tasks existieren.');
        return false; // <= Wichtig: false zurückgeben
      }

      await pb.collection('categories').delete(id);
      await fetchCategories(); // <= Jetzt die Liste neu holen!
      currentCategory.value = null; // <= Oder setCategory(null)
      return true; // <= Erfolg zurückgeben
    } catch (error) {
      console.error('Fehler beim Löschen:', JSON.stringify(error, null, 2));
      return false;
    }
  };




  return {
    categories: readonly(categories),
    currentCategory: currentCategory,
    tasks: readonly(tasks),
    fetchCategories,
    setCategory,
    createCategory,
    deleteCategory,
    totalDiff: readonly(totalDiff),
    createTask,
    totalEstimate: readonly(totalEstimate),
    totalCosts: readonly(totalCosts),
  }
}
