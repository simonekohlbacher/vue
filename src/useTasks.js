import { onMounted, readonly, ref, computed } from "vue";
import { pb } from './pocketbase.js';
import { useAuth } from "@/useAuth.js";
import { useWebNotification } from '@vueuse/core'


export function useTasks() {

  const { currentUser } = useAuth();



  return {

  }
}


