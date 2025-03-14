import { createApp } from 'vue'
import App from './App.vue'
import emotes from './utils/emotes'
import twemoji from './utils/tweemoji'
import { createWebHashHistory, createRouter } from 'vue-router'
import Chat from './components/Chat.vue'
import Main from './main.vue'
import MainENG from './eng.vue'

const app = createApp(App)

const routes = [
  { path: '/chat', component: Chat },
  { path: '/ru', component: Main },
  { path: '/', component: MainENG },
]

const router = createRouter({
  history: createWebHashHistory(),
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
