import { createApp } from 'vue'
import App from './App.vue'
import emotes from './utils/emotes'
import twemoji from './utils/tweemoji'
import { createWebHistory, createRouter } from 'vue-router'
import Chat from './components/Chat.vue'
import Main from './main.vue'

const app = createApp(App)

const routes = [
  { path: '/chat', component: Chat },
  { path: '/', component: Main },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

app.directive('emoji', {
  mounted(el) {
    el.innerHTML = twemoji.parse(el.innerHTML, {
      base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
    })
  },
})

app.directive('emotes', {
  mounted(el, binding) {
    el.innerHTML = emotes.ParseExtensions(el.innerHTML, binding.value)
  },
})

app.directive('twitch-emotes', {
  mounted(el, binding) {
    el.innerHTML = emotes.ParseTwitch(el.innerHTML, binding.value)
  },
})

app.directive('personal-emotes', {
  mounted(el, binding) {
    el.innerHTML = emotes.ParsePersonal(el.innerHTML, binding.value)
  },
})

app.use(router).mount('#app')
