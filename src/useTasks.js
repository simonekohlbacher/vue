import { onMounted, readonly, ref, computed } from "vue";
import { pb } from './pocketbase.js';
import { useAuth } from "@/useAuth.js";
import { useCategories } from '@/useCategories.js'

const { currentUser } = useAuth();
const {  fetchCategories, currentCategory  } = useCategories();



export function useTasks() {
  const tasks = ref([])



  // ---------------------------------------------
  // task erstellen
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


  // ---------------------------------------------
  // task löschen
  const deleteTask = async (id) => {
    try {
      await pb.collection('tasks').delete(id)
      await fetchCategories()
      return true
    } catch (error) {
      console.error('Fehler beim Löschen:', JSON.stringify(error, null, 2))
      return false
    }
  }



  return {
    tasks: readonly(tasks),
    currentCategory: currentCategory,
    createTask,
    deleteTask,


  }
}


