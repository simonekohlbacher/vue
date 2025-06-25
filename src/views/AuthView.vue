<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { useAuth } from "@/useAuth.js";

const router = useRouter();
const email = ref('');
const password = ref('');
const name = ref('');
const long = ref('');
const lat = ref('');
const budget = ref('');
const start = ref('');
const isRegister = ref(false); // Toggle: false = Login, true = Register
const { login, register } = useAuth();

async function handleSubmit() {
  let success = false;
  if (isRegister.value) {
    success = await register(name.value, email.value, password.value, long.value, lat.value, budget.value, start.value);
  } else {
    success = await login(email.value, password.value);
  }
  if (success) {
    await router.push('/home');
  }
}
</script>

<template>
  <div
    class="hero min-h-screen bg-cover bg-center"
    style="background-image: url('/planen.jpg');">
    <div class="hero-overlay min-h-screen"></div>
    <div class="hero-content text-neutral-content text-center">
      <div class="max-w-md w-full">

        <h1 class="mb-5 text-5xl font-bold">Willkommen</h1>
        <p class="mb-5">
          Logge dich ein oder registriere dich, um loszulegen.
        </p>
        <section class="flex justify-center items-center text-neutral w-full">
          <div class="card w-full bg-base-100 shadow-xl">
            <div class="card-body">

              <!-- Toggle -->
              <div class="flex justify-between items-center mb-4">
                <h2 class="card-title text-2xl font-bold">
                  {{ isRegister ? 'Registrieren' : 'Login' }}
                </h2>
                <label class="flex items-center cursor-pointer gap-2">
                  <span class="text-sm">{{ isRegister ? 'Registrieren' : 'Login' }}</span>
                  <input type="checkbox" v-model="isRegister" class="toggle toggle-sm" />
                </label>
              </div>

              <div class="flex flex-col gap-3 w-full">
                <label v-if="isRegister" class="input validator w-full">
                  <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zM4 20v-1c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4v1H4z" fill="currentColor"/>
                  </svg>
                  <input v-model="name" type="text" placeholder="Name" required minlength="2" />
                </label>

                <label class="input validator w-full">
                  <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </g>
                  </svg>
                  <input v-model="email" type="email" placeholder="E-Mail" required minlength="3" maxlength="50" />
                </label>

                <label class="input validator w-full">
                  <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
                      <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                    </g>
                  </svg>
                  <input v-model="password" @keydown.enter="handleSubmit" type="password" placeholder="Passwort" required minlength="8" />
                </label>
              </div>

              <label v-if="isRegister" class="input validator w-full">
                  <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                <input v-model="budget" type="number" placeholder="Budget" required />
              </label>

              <span v-if="isRegister" class="text-xs mt-2 text-left">Baustart</span>
              <label v-if="isRegister" class="input validator w-full">
                <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                </svg>
                <input v-model="start" type="date" placeholder="Baustart" required />
              </label>
              <p v-if="isRegister" class="text-xs mt-4">Für genaue Wettervorhersagen benötigen wir die Koordinaten deines Brauorts.</p>

              <label v-if="isRegister" class="input validator w-full">
                <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm3.94 6.06-1.88 5.66a1 1 0 0 1-.64.64l-5.66 1.88a.25.25 0 0 1-.32-.32l1.88-5.66a1 1 0 0 1 .64-.64l5.66-1.88a.25.25 0 0 1 .32.32z"/>
                </svg>
                <input v-model="long" type="number" placeholder="Längengrad" required minlength="-180" maxlength="180"/>
              </label>

              <label v-if="isRegister" class="input validator w-full">
                <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm3.94 6.06-1.88 5.66a1 1 0 0 1-.64.64l-5.66 1.88a.25.25 0 0 1-.32-.32l1.88-5.66a1 1 0 0 1 .64-.64l5.66-1.88a.25.25 0 0 1 .32.32z"/>
                </svg>
                <input v-model="lat" type="number" placeholder="Breitengrad" required minlength="-90" maxlength="90"/>
              </label>

              <button @click="handleSubmit" class="btn btn-neutral mt-6 w-full">
                {{ isRegister ? 'Registrieren' : 'Login' }}
              </button>
            </div>
          </div>
        </section>
        <a href="https://www.pexels.com/de-de/foto/helm-skizzen-sonnendurchflutete-papiere-7937319/" target="_blank" class="mt-10 block text-sm underline">Foto von Pavel Danilyuk von Pexels</a>
        <p class="text-xs mt-4">Copyright © Simone Kohlbacher {{new Date().getFullYear()}} - All right reserved <br>kohlbacher.simone@gmail.com</p>
      </div>
    </div>
  </div>
</template>


