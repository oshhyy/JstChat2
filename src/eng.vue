<template>
  <div id="main">
    <div id="index">
      <div id="title">Just Chat 2</div>
      <span id="git">github: <a href="http://github.com/justririll">justririll</a></span> <br />
    </div>
    <div id="params">
      <div id="param">
        <span id="href" @click="$router.push('ru')" style="text-decoration: underline">RU</span>
      </div>
      <div id="param">
        <span id="info">channel:</span> <br />
        <input type="text" placeholder="channel" v-model="channel" />
      </div>

      <div id="param">
        <span id="info">style:</span> <br />
        <select @change="changeStyle">
          <option value="1">with background</option>
          <option value="2">without background</option>
        </select>
      </div>

      <div id="param">
        <span id="info">chat example:</span> <br />
        @todo
      </div>

      <div id="param">
        <span id="info">your url:</span> <br />
        <input
          type="text"
          placeholder="фон"
          v-model="url"
          onclick="this.select(); navigator.clipboard.writeText(this.value);"
          readonly
        />
      </div>
      <br />
      <br />
      <br />

      <div id="param">
        <span id="info"> more options: </span>
      </div>

      <div id="param">
        <span id="info">background (HEX):</span> <br />
        <input type="text" placeholder="background" v-model="background" />
      </div>
      <div id="param">
        <span id="info">num backgrounds:</span> <br />
        <input type="number" placeholder="num backgrounds" v-model="num_backgrounds" />
      </div>
      <div id="param">
        <span id="info">border:</span>
        <input checked type="checkbox" placeholder="border" v-model="border" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainView',
  data: () => {
    return {
      channel: '',
      num_backgrounds: 4,
      background: '#2b2b2b',
      border: 'on',
    }
  },
  computed: {
    url() {
      let border = 0
      if (this.border == 'on') {
        border = 2
      }
      return `https://justririll.github.io/JstChat2/#/chat?channel=${this.channel}&background=${this.background}&sb=${this.num_backgrounds}&border=${border}`
    },
  },
  methods: {
    changeStyle(event) {
      switch (event.target.value.trim()) {
        case '1':
          this.border = 'on'
          this.background = '#2b2b2b'
          this.num_backgrounds = 4
          break

        case '2':
          this.border = 'off'
          this.background = 'transparent'
          this.num_backgrounds = '0'
          break
      }
    },
  },
}
</script>

<style>
#main {
  overflow: auto;
  left: 0;
  top: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  background: linear-gradient(#3e3e3e, #2b2b2b);
  background-attachment: fixed;
  color: white;
}
#title {
  max-width: fit-content;
  margin-inline: auto;
  font-size: 3em;
}
#index {
  max-width: fit-content;
  margin-inline: auto;
}
input {
  border: none;
  background: #232323;
  color: white;
  width: 14em;
  font-size: 2em;
}
#params {
  max-width: fit-content;
  margin-inline: auto;
  margin-top: 1em;
}
#param {
  margin-top: 1em;
}
#info {
  font-size: 2em;
  font-family: 'Roboto', sans-serif;
  /* margin-right: 2em; */
}
a {
  text-decoration: none;
  color: rgb(142, 136, 151);
}
</style>
