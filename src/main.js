import { createApp } from 'vue'
import App from './App.vue'
import emotes from './utils/emotes'
import twemoji from './utils/tweemoji'

const app = createApp(App)

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

app.mount('#app')
