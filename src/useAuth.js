import { computed, readonly, ref } from 'vue'
import { pb } from '@/pocketbase.js'

// singleton für currentUser, damit nicht mehrere Instanzen erstellt werden
const currentUser = ref(null)

// Check if the user is still logged in through pb.authStore / token saved in localStorage
// If yes set the saved user to be the current user
if (!currentUser.value && pb.authStore.isValid && pb.authStore.record) {
  currentUser.value = pb.authStore.record
}

export function useAuth() {
  const login = async (email, password) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password, { autoCancel: false })
      currentUser.value = authData.record
      return true
    } catch (error) {
      console.error('Login fehlgeschlagen:', error)
      alert('Login failed: ' + error.message)
      currentUser.value = null
      pb.authStore.clear()
      return false
    }
  }

  const logout = () => {
    currentUser.value = null
    pb.authStore.clear()
    console.log('User logged out', currentUser.value)
  }

  const register = async (name, email, password, long, lat, budget, start) => {
    try {
      pb.authStore.clear()
      currentUser.value = null
      await pb.collection('users').create({
        name,
        email,
        password,
        passwordConfirm: password,
        long,
        lat,
        budget,
        start,
      })
      const authData = await pb.collection('users').authWithPassword(email, password)
      currentUser.value = authData.record
      return true
    } catch (error) {
      console.error('Registrierung fehlgeschlagen:', error)
      alert('Registrierung fehlgeschlagen: ' + error.message)

      currentUser.value = null
      pb.authStore.clear()
      return false
    }
  }

  // reaktive variable, true wenn user eingeloggt ist
  const isLoggedIn = computed(() => !!currentUser.value)

  return {
    isLoggedIn,
    currentUser: readonly(currentUser),
    login,
    logout,
    register,
  }
}
