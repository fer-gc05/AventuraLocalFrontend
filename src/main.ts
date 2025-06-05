import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import './style.css'
import translations from './i18n'

// Create i18n instance
const i18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'en',
  messages: translations
})

// Create Pinia store
const pinia = createPinia()

// Create and mount the app
const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(i18n)
app.mount('#app')