<template>
  <div id="main">
    <div id="index">
      <div id="title">Just Chat 2</div>
      <span id="git">github: <a href="http://github.com/justririll">justririll</a> ● fork by oshgay</span> <br />
    </div>
    <div id="params">
      <div id="param">
        <span id="href" @click="$router.push('ru')" style="text-decoration: underline">RU</span>
      </div>
      <div id="param">
        <span id="info">channel:</span>
        <input type="text" placeholder="channel" v-model="channel" />
      </div>


      <div id="param">
        <span id="info">style:</span>
        <select id="selector" @change="changeStyle">
          <option value="1">transparent</option>
          <option value="2">with background</option>
        </select>
      </div>

      <div id="param">
        <span id="info">font:</span>
        <select id="selector" v-bind:style="{ fontFamily: font, fontWeight: 700}" v-model="font">
          <option value="Open Sans">Open Sans</option>
          <option value="Lato">Lato</option>
          <option value="Noto Sans">Noto Sans</option>
          <option value="Roboto">Roboto</option>
          <option value="Poppins">Poppins</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
          <option value="Impact">Impact</option>
        </select>
      </div>

      <div id="param">
        <span id="info">font size:</span>
        <input type="number" min="10" step="1" placeholder="36" v-model="fontSize" />
        <span id="info">px</span>
      </div>

      <div id="param">
        <span id="backgrounds"> background options: </span>
      </div>

      <div id="param">
        <span id="backgrounds">background (HEX):</span>
        <input id="backgrounds" type="text" placeholder="background" v-model="background" />
      </div>
      <div id="param">
        <span id="backgrounds">number of backgrounds:</span>
        <input id="backgrounds" type="number" placeholder="num" v-model="num_backgrounds" />
      </div>
      <div id="param">
        <label id="backgrounds" for="backgrounds">border:</label>
        <input id="backgrounds" type="checkbox" v-model="border" value="true" checked/>
      </div>

      <br />
      <br />
      <div id="param">
        <span id="info">chat example:</span>
        @todo
      </div>
      <br />
      <br />

      <div id="param">
        <span id="info">fade messages (0 = permanent)</span>
        <input type="number" min="0" step="5" placeholder="seconds" v-model="fade" />
        <span id="info"> seconds</span>
      </div>

      <div id="param">
        <label for="hide_commands">hide commands:</label>
        <input id="hide_commands" type="checkbox" v-model="hide_commands" value="true" checked/>
      </div>
      <div id="param">
        <span id="info">bot ignore list:</span>
        <input id="ignore" type="text" placeholder="comma separated list of usernames" v-model="ignore" />
      </div>

      <br />
      <br />
      <br />

      <div id="param">
        <span id="info">your url: (click to copy)</span> <br />
        <input
          type="url"
          placeholder="url"
          v-model="url"
          onclick="this.select(); navigator.clipboard.writeText(this.value);"
          readonly
        />
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
      num_backgrounds: 0,
      background: 'transparent',
      fade: '0',
      hide_commands: 'false',
      border: 'false',
      ignore: '',
      font: 'Open Sans',
      fontSize: '36',
      show_bg_options: 'false'
    }
  },
  computed: {
    url() {
      if (this.channel == '') {return}
      let border = 0
      if (this.border == true) {
        border = 2
      }
      let ignore = ''
      if (this.ignore != '') {
        ignore = '&hide=' + this.ignore.replace(/\s+/g, '');
      }

      return `https://oshhyy.github.io/JstChat2/#/chat?channel=${this.channel}&background=${this.background}&sb=${this.num_backgrounds}&border=${border}&font=${encodeURIComponent(this.font)}&font_size=${this.fontSize}&fade_after=${this.fade}&hide_commands=${this.hide_commands}${ignore}`
    },
    showOptions() {
      if(this.show_bg_options == 'true') {
        return `block`
      }
      else {
        return `none`
      }
    }
  },
  methods: {
    changeStyle(event) {
      switch (event.target.value.trim()) {
        case '1':
          this.border = false
          this.background = 'transparent'
          this.num_backgrounds = '0'
          this.show_bg_options = 'false'
          break;
        case '2':
          this.border = true
          this.background = '#2b2b2b'
          this.num_backgrounds = 4
          this.show_bg_options = 'true'
          break;
      }
    },
  },
}
</script>

<style>
html {
    color-scheme: dark !important;
}
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
  font-family: 'Roboto', sans-serif;
  text-shadow: 2px 2px 0.1rem black;
}
#title {
  max-width: fit-content;
  margin-inline: auto;
  font-size: 3em;
  font-weight: 700;
}
#index {
  max-width: fit-content;
  margin-inline: auto;
}
input {
  border: none;
  background: #232323;
  color: white;
  width: 7em;
  font-size: 2em;
}
label {
  font-size: 2em;
  width: 14em;
}
input[type=url] {
  width: 28em;
}
input[type=number] {
  width: 2em;
  background-color:#232323

}
input[type=checkbox] {
  width: 2em;
  transform: scale(2);
  vertical-align: super;
  accent-color: #2196F3
}

#params {
  max-width: fit-content;
  margin-inline: auto;
}
#param {
  margin-top: 1em;
  display: block;
}
#info {
  font-size: 2em;
  /* margin-right: 2em; */
}
#selector {
  border: none;
  background: #232323;
  color: white;
  width: 10em;
  font-size: 2em;
}
#param>#backgrounds {
  display:v-bind('showOptions');
  font-size: 2em;
  color: #aaaaaa;
}
#ignore {
  font-size: 2em;
  width: 20em
}
a {
  text-decoration: none;
  color: rgb(142, 136, 151);
}
</style>
