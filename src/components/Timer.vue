<!-- https://daisyui.com/components/countdown/ -->

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuth } from "@/useAuth.js";
const { currentUser } = useAuth();

const targetDate = new Date(currentUser.value.start);

// Werte für days/hours/minutes/seconds
const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

let interval;

const updateCountdown = () => {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    days.value = 0;
    hours.value = 0;
    minutes.value = 0;
    seconds.value = 0;
    clearInterval(interval);
    return;
  }

  days.value = Math.floor(diff / (1000 * 60 * 60 * 24));
  hours.value = Math.floor((diff / (1000 * 60 * 60)) % 24);
  minutes.value = Math.floor((diff / (1000 * 60)) % 60);
  seconds.value = Math.floor((diff / 1000) % 60);
};


onMounted(() => {
  updateCountdown();
  interval = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>


<template>

  <div class="grid auto-cols-max grid-flow-col gap-5 text-center">
    <div class="flex flex-col">
      <div class="flex flex-col">
        <span class="font-mono text-5xl">{{ days }}</span>
        days
      </div>
    </div>
    <div class="flex flex-col">
    <span class="countdown font-mono text-5xl">
      <span :style="`--value:${hours}`">{{ hours }}</span>
    </span>
      hours
    </div>
    <div class="flex flex-col">
    <span class="countdown font-mono text-5xl">
      <span :style="`--value:${minutes}`">{{ minutes }}</span>
    </span>
      min
    </div>
    <div class="flex flex-col">
    <span class="countdown font-mono text-5xl">
      <span :style="`--value:${seconds}`">{{ seconds }}</span>
    </span>
      sec
    </div>
  </div>


</template>

