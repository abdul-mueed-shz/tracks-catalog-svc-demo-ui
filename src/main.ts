import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify, Dialog, Loading, Dark } from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'
import './css/app.scss'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(Quasar, {
  plugins: {
    Notify,
    Dialog,
    Loading,
    Dark
  },
  config: {
    dark: true,
    notify: {
      position: 'top-right',
      timeout: 3000
    }
  }
})

// Ensure dark mode is active by default for streaming aesthetic
Dark.set(true)

app.mount('#app')
