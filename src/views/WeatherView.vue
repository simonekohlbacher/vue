<script setup>
import { ref, onMounted } from 'vue'
import AppNavigation from '@/components/layouts/AppNavigation.vue'
import WeatherChart from '@/components/WeatherChart.vue'
import { useAuth } from "@/useAuth.js";

const weatherData = ref([])
const { currentUser } = useAuth();
const cityName = ref('');

onMounted(async () => {
  // Meteomatics API Zugangsdaten und Parameter
  // https://www.meteomatics.com/en/api/getting-started/
  const username = 'fhooe_kohlbacher_simone'
  const password = '5kIdMj0L3s'
  const parameters = 't_2m:C,precip_1h:mm,wind_speed_10m:ms'
  const proxyUrl = 'https://proxy-c1wt.onrender.com';
  const url = `${proxyUrl}?start=${start}&end=${end}&interval=${interval}&parameters=${parameters}&lat=${lat}&long=${long}`;

  const response = await fetch(url);
  const data = await response.json();
  const lat = currentUser.value.lat || 48.2082 // Default to Vienna if not set
  const long = currentUser.value.long || 16.3738 // Default to Vienna if not set
  const start = new Date().toISOString()
  const end = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const interval = "PT3H"
  cityName.value = await getCityFromCoords(lat, long);

  //const url = `https://api.meteomatics.com/${start}--${end}:${interval}/${parameters}/${lat},${long}/json`

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: 'Basic ' + btoa(`${username}:${password}`)
      }
    })
    const data = await response.json()

    weatherData.value = data.data[0].coordinates[0].dates.map((_, i) => ({
      date: data.data[0].coordinates[0].dates[i].date,
      t_2m: data.data[0].coordinates[0].dates[i].value,
      precip_1h: data.data[1].coordinates[0].dates[i].value,
      wind_speed_10m: data.data[2].coordinates[0].dates[i].value
    }))

  } catch (error) {
    console.error('Fehler beim Laden:', error)
  }
})


async function getCityFromCoords(lat, long) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    if (!data.address) {
      console.warn('Keine Adresse gefunden für diese Koordinaten.');
      return 'Unbekannter Ort';
    }

    return (
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.hamlet || // fallback für ganz kleine Orte
      'Unbekannter Ort'
    );
  } catch (err) {
    console.error('Fehler beim Geocoding:', err);
    return 'Unbekannter Ort';
  }
}


</script>

<template>
  <AppNavigation>
    <div class="p-4">
      <h1 class="text-3xl text-center font-bold mb-8">Wetter für {{cityName}}</h1>

      <WeatherChart v-if="weatherData.length" :weatherData="weatherData" />

      <p v-else>Lade Wetterdaten...</p>
    </div>
  </AppNavigation>
</template>
