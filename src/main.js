import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faCalendarDays,
  faCloudSunRain,
  faHouse,
  faBars,
  faRightFromBracket,
  faHourglassHalf,
  faCircleCheck,
  faBan,
  faPlus,
  faTrash,
  faHelmetSafety
} from '@fortawesome/free-solid-svg-icons'

// Icons in die Library laden
library.add(faHouse, faCloudSunRain, faCalendarDays, faBars, faRightFromBracket, faHourglassHalf, faCircleCheck, faBan, faPlus, faTrash, faHelmetSafety)

const app = createApp(App)
app.use(router)
// Komponente global registrieren
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')

