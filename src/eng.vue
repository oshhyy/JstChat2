<template>
  <div id="main">
    <div id="index">
      <div id="title">Just Chat 2</div>
      <span id="git"
        >github: <a href="http://github.com/justririll">justririll</a> ● fork by oshhyy</span
      >
      <br />
    </div>
    <div id="params">

      <div id="param">
        <span id="info">channel:</span>
        <input type="text" placeholder="twitch username" v-model="channel" />
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
        <select id="selector" v-bind:style="{ fontWeight: 700 }" v-model="font">
          <option value="Open Sans">Open Sans</option>
          <option value="Lato">Lato</option>
          <option value="Noto Sans">Noto Sans</option>
          <option value="Roboto">Roboto</option>
          <option value="Poppins">Poppins</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
          <option value="Impact">Impact</option>
          <option value="Minecraftia">Minecraft</option>
        </select>

        <span id="info">font size:</span>
        <input type="number" min="10" step="1" max="128" placeholder="36" v-model="font_size" />
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
        <input id="backgrounds" type="checkbox" v-model="border" value="true" checked />
      </div>

      <br />
      <br />
      <div
        id="example"
        v-bind:style="{ fontFamily: font, fontWeight: 700, fontSize: font_size + 'px', backgroundColor: Background }"
      >
        <img
          id="badges"
          src="https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/2"
        />
        <img
          id="badges"
          src="https://static-cdn.jtvnw.net/badges/v1/ba2a2b1c-8231-433c-b887-08684293b68f/2"
        />
        <img
        id="badges"
        src="https://static-cdn.jtvnw.net/badges/v1/1687873b-cf38-412c-aad3-f9a4ce17f8b6/2"
        />
        <img
          id="badges"
          src="https://cdn.frankerfacez.com/badge/4/2/rounded"
        />
        <img id="badges" src="https://cdn.7tv.app/badge/01JJJ74CRHZBRMCM8F4Y2WBN6R/2x.webp" />
        <span id="nickname">oshy: </span>
        <span id="msg"><img src="https://cdn.7tv.app/emote/01FKX5H3G00004X8QJ9S80KD4F/2x.webp"/> This is an example message. <img src="https://cdn.7tv.app/emote/01GRKPZCJ80004NWC6YE8DQMV2/2x.webp"/> <img src="https://cdn.7tv.app/emote/01FECNYCHG000CZZNZB30AN3SE/2x.webp" zerowidth="true"/></span>

      </div>
      <br />
      <br />

      <div id="param">
        <span id="info">fade messages (0 = permanent)</span>
        <input type="number" min="0" step="5" placeholder="seconds" v-model="fade" />
        <span id="info"> seconds</span>
        <br />
        <br />
        <label for="hide_animation">hide animation:</label>
        <input id="hide_animation" type="checkbox" v-model="dont_animate" value="true" checked />
      </div>

      <br />
      <br />
      <div id="param">
        <label for="hide_commands">hide commands:</label>
        <input id="hide_commands" type="checkbox" v-model="hide_commands" value="true" checked />
      </div>
      <div id="param">
        <span id="info">bot ignore list:</span>
        <input
          id="ignore"
          type="text"
          placeholder="comma separated list of usernames"
          v-model="ignore"
        />
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
      <div id="index">
        <br />
        <span id="disclaimer" style="margin-inline: auto; max-width: fit-content;">not affiliated with twitch</span>
      </div>
    </div>
  </div>
</template>

<script>
import Common from '@/utils/common'
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
      font_size: '36',
      show_bg_options: 'false',
      dont_animate: 'false',

      paint_shadows: [{
        "x_offset": 0,
        "y_offset": 0,
        "radius": 0.1,
        "color": -545143041
      },
      {
        "x_offset": 1,
        "y_offset": 1,
        "radius": 0.1,
        "color": 1879074815
      }]
    }
  },
  computed: {
    url() {
      if (this.channel == '') {
        return
      }
      let border = 0
      if (this.border == true) {
        border = 2
      }
      let ignore = ''
      if (this.ignore != '') {
        ignore = '&hide=' + this.ignore.replace(/\s+/g, '')
      }

      return `https://oshhyy.github.io/JstChat2/#/chat?channel=${this.channel}&background=${this.background}&sb=${this.num_backgrounds}&border=${border}&font=${encodeURIComponent(this.font)}&font_size=${this.font_size}&fade_after=${this.fade}&hide_commands=${this.hide_commands}&dont_animate=${this.dont_animate}${ignore}`
    },
    showOptions() {
      if (this.show_bg_options == 'true') {
        return `block`
      } else {
        return `none`
      }
    },
    badgeSize() {
      return `${Math.round(0.8 * this.font_size + 4.4)}px`
    },
    filter() {
      try {
        return this.paint_shadows
          .map(
            (v) =>
              `drop-shadow(${v.x_offset*2}px ${v.y_offset*2}px ${v.radius}px ${Common.DecimalToStringRGBA(v.color)})`,
          )
          .join(' ')
      } catch {
        return ''
      }
    },
    MessageSize() {
      return `${Math.round(1.33 * this.font_size + 7)}px`
    },
    Background() {
      if(this.show_bg_options) {
        return this.background
      }
      return '#000000'
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
          this.dont_animate = 'false'
          break
        case '2':
          this.border = true
          this.background = '#2b2b2b'
          this.num_backgrounds = 4
          this.show_bg_options = 'true'
          this.dont_animate = 'true'
          break
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
  width: 15em;
  font-size: 2em;
}
label {
  font-size: 2em;
  width: 14em;
}
input[type='url'] {
  width: 28em;
}
input[type='number'] {
  width: 2em;
  background-color: #232323;
}
input[type='checkbox'] {
  width: 2em;
  transform: scale(2);
  vertical-align: super;
  accent-color: #2196f3;
}

#params {
  max-width: max-content;
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
  margin-right: 2em;
}
#example {

  display: inline-block;
  max-width: 900px;
  min-height: v-bind(MessageSize);
  text-shadow: none !important;
  filter: drop-shadow(2px 2px 0.1rem black);
  vertical-align: middle;
}
#badges {
  height: v-bind('badgeSize');
  margin-left: 4px;
  vertical-align: middle;
}
#nickname{
  filter: v-bind('filter');
  margin-left: 4px;
  background-size: cover;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text !important;
  background-color: currentcolor;
  color: transparent !important;
  background-image: url("https://cdn.7tv.app/paint/01J5EKNQS80000V182Y1H9Z6Y8/layer/01JAMR36JC0HBZQ4ZQVJJTPEJM/1x.webp");
}
#msg img {
  max-width: 7.5em;
  max-height: 2.5em;
  width: auto;
  height: 2.5em;
  vertical-align: middle;
}
#msg img[zerowidth='true'] {
  position: absolute;
  transform: translateX(-100%);
}
#param > #backgrounds {
  display: v-bind('showOptions');
  font-size:  2em;
  color: #aaaaaa;
}
#ignore {
  font-size: 2em;
  width: 20em;
}
a {
  text-decoration: none;
  color: rgb(142, 136, 151);
}
</style>
