
<!-- with Chart.js & vue-chartjs & chat -->
<script setup>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'
import { computed } from 'vue'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const props = defineProps({
  weatherData: {
    type: Array,
    required: true
  }
})

// Daten für das Chart aufbereiten
const chartData = computed(() => {
  const labels = props.weatherData.map(d => new Date(d.date).toLocaleString())
  return {
    labels,
    datasets: [
      {
        label: 'Temperatur (°C)',
        data: props.weatherData.map(d => d.t_2m),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3
      },
      {
        label: 'Niederschlag (mm)',
        data: props.weatherData.map(d => d.precip_1h),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        tension: 0.3
      },
      {
        label: 'Windgeschwindigkeit (m/s)',
        data: props.weatherData.map(d => d.wind_speed_10m),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: '3-Stündlicher Wetterverlauf (7 Tage)'
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}
</script>

<template>
  <div class="h-[500px]">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
