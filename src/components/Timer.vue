<script setup>
import { ref, onMounted } from 'vue';
import { useAuth } from "@/useAuth.js";

const { currentUser } = useAuth();
const targetDate = new Date(currentUser.value.start);

// Werte für days/hours/minutes/seconds
const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

let interval;

onMounted(() => {
  updateCountdown();
  // jede sekunden runter zählen
  interval = setInterval(updateCountdown, 1000);
});

// logic help from chat
const updateCountdown = () => {
  const now = new Date();
  // zeit die runtergezählt wird
  const diff = targetDate.getTime() - now.getTime();

  // wenn diff kleiner oder gleich 0 ist, Timer stoppen und auf 0 setzen
  if (diff <= 0) {
    days.value = 0;
    hours.value = 0;
    minutes.value = 0;
    seconds.value = 0;
    clearInterval(interval);
    return;
  }

  // rest zeit in Tage, Stunden, Minuten und Sekunden umrechnen
  days.value = Math.floor(diff / (1000 * 60 * 60 * 24));
  hours.value = Math.floor((diff / (1000 * 60 * 60)) % 24);
  minutes.value = Math.floor((diff / (1000 * 60)) % 60);
  seconds.value = Math.floor((diff / 1000) % 60);
};

</script>


<template>
  <!-- https://daisyui.com/components/countdown/ -->
  <h2 class="text-2xl mb-4">Zeit bis zum Baustart</h2>
  <div class="grid auto-cols-max grid-flow-col gap-5 text-center">
    <div class="flex flex-col">
      <div class="flex flex-col">
        <span class="font-mono text-3xl">{{ days }}</span>
        Tage
      </div>
    </div>
    <div class="flex flex-col">
    <span class="countdown font-mono text-3xl">
      <span :style="`--value:${hours}`">{{ hours }}</span>
    </span>
      Stunden
    </div>
    <div class="flex flex-col">
    <span class="countdown font-mono text-3xl">
      <span :style="`--value:${minutes}`">{{ minutes }}</span>
    </span>
      Minuten
    </div>
    <div class="flex flex-col">
    <span class="countdown font-mono text-3xl">
      <span :style="`--value:${seconds}`">{{ seconds }}</span>
    </span>
      Sekunden
    </div>
  </div>
</template>

