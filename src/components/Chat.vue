<script>
import Message from './chat/Message.vue'
import TwitchClient from '@/utils/chat_clients/twitch/client'
import API from '@/utils/api/api'
import Common from '@/utils/common'
import EventAPI from '@/utils/eventapi/seventv'

export default {
  name: 'ChatView',
  components: { Message },
  data: function () {
    return {
      EventAPI: null,
      client: null,
      api: null,
      messages: [],
      useBG: 0,
      sysmsgID: 0,

      pageConfig: {
        maxMes: 50,
        fontSizeI: parseInt(this.$route.query.font_size || '36'),
        channel: this.$route.query.channel,

        border: this.$route.query.border || '2',
        fade: parseInt(this.$route.query.fade_after || '0'),

        backgrounds: [this.$route.query.background || 'transparent'],
        calcSecondBackgrounds: parseInt(this.$route.query.sb || '5'),

        fontName: this.$route.query.font || 'Open Sans',
        fontWeight: parseInt(this.$route.query.font_weight || '800'),

        dontAnimate: this.$route.query.dont_animate || 'false',

        hideCommands: this.$route.query.hide_commands || 'false',
        hideList: this.$route.query.hide?.split(',') || ['false'],
      },
    }
  },
  methods: {
    async onEmoteAdd(e) {
      console.log(e)
      console.log(this.api.emotes)
      this.api.emotes[e.value.name] = { ID: e.value.id, Type: '7TV' }
    },
    async onEmoteDelete(e) {
      console.log(e)
      console.log(this.api.emotes)
      console.log(this.api.emotes[e.old_value.name])
      delete this.api.emotes[e.old_value.name]
    },
    async onEmoteRename(e) {
      console.log(e)
      console.log(this.api.emotes[e.value.name])
      this.api.emotes[e.value.name] = this.api.emotes[e.old_value.name]
      delete this.api.emotes[e.old_value.name]
    },
    async onBadgeCreate(e) {
      for (const i in this.api.stvbadges) {
        if (this.api.stvbadges[i] != undefined && this.api.stvbadges[i].id == e.data.id) {
          this.api.stvbadges[i].Users.push(e.user.id)
          return
        }
      }
      let pos = this.api.stvbadges.push({ Url: `https:${e.data.host.url}/2x`, id: e.data.id }) - 1
      this.api.stvbadges[pos].Users = [e.user.id]
    },
    async onBadgeDelete(e) {
      for (const i in this.api.stvbadges) {
        if (this.api.stvbadges[i].id == e.data.id) {
          this.api.stvbadges[i].Users = this.api.stvbadges[i].Users.filter(function (item) {
            return item !== e.user.id
          })
          break
        }
      }
    },
    async onPaintCreate(e) {
      for (const i of this.api.paints) {
        if (this.api.paints[i] != undefined && this.api.paints[i].name == e.data.name) {
          this.api.paints[i].users.push(e.user.id)
          return
        }
      }
      let pos = this.api.paints.push(e.data) - 1
      this.api.paints[pos].users = [e.user.id]
    },
    async onPaintDelete(e) {
      for (const i in this.api.paints) {
        if (this.api.paints[i].id == e.data.id) {
          this.api.paints[i].users = this.api.paints[i].users.filter(function (item) {
            return item != e.user.id
          })
          break
        }
      }
    },
    async onPersonalEmotes(e, user) {
      if (e != undefined && user != undefined) {
        this.api.personalEmotes[user] = e
      }
    },
    async OnFadeAfter(id) {
    if(this.pageConfig.fade != 0) {
      setTimeout(
            () => {
              const message = this.messages.find(
                (item) => item.tags['id'] == id,
              )
              if (message) {
                // Add fadeOut flag to the message
                message.fadeOut = true
              }
            },
            parseInt(this.pageConfig.fade) * 1000
          )
      }
    },
    createTwitchMessage(message) {
      if (this.messages.length >= this.pageConfig.maxMes) {
        this.messages.shift()
      }
      message.type = 'twitch'

      message.background = this.useBG
      if (this.useBG + 1 > this.pageConfig.backgrounds.length - 1) {
        this.useBG = 0
      } else {
        this.useBG += 1
      }

      if (this.pageConfig.hideCommands.toLowerCase() === 'true') {
        if (
          message.parameters.startsWith('!') ||
          message.parameters.startsWith('#') ||
          message.parameters.startsWith('+')
        ) {
          return
        }
      }

      if (this.pageConfig.hideList[0] !== 'false') {
        if (this.pageConfig.hideList.includes(message.source.nick)) {
          return
        }
      }

      this.messages.push(message)
      this.OnFadeAfter(message.tags.id)
    },
    async createSystemMessage(message) {
      if (this.messages.length >= this.pageConfig.maxMes) {
        this.messages.shift()
      }
      let mes = {
        parameters: message,
        tags: { display_name: '', id: this.sysmsgID, color: "#999999" },
        source: { nick: 'system' },
        action: true
      }
      mes.type = 'system'

      mes.background = this.useBG
      if (this.useBG + 1 > this.pageConfig.backgrounds.length - 1) {
        this.useBG = 0
      } else {
        this.useBG += 1
      }
      this.messages.push(mes)
      this.OnFadeAfter(mes.tags.id)
      this.sysmsgID++
    },
  },
  created: async function () {
    if (
      this.pageConfig.calcSecondBackgrounds > 0 &&
      this.pageConfig.backgrounds[0] != 'transparent'
    ) {
      for (let index = 0; index < this.pageConfig.calcSecondBackgrounds; index++) {
        let minus = 1
        let ind = index

        if (this.pageConfig.calcSecondBackgrounds / 2 <= index) {
          ind = this.pageConfig.calcSecondBackgrounds - index - 1
        }

        let gray = Common.toGray(this.pageConfig.backgrounds[ind])
        if (gray > 0.38) {
          minus = -30 / gray
        }

        this.pageConfig.backgrounds.push(
          Common.pSBC(0.01 * minus, this.pageConfig.backgrounds[ind]),
        )
      }
    }

    this.api = new API(this.pageConfig.channel)
    await this.api.twitch.fetchData(this.api.fetchEmotes)

    await this.api.fetchEmotes()

    // connecting to eventapi
    this.EventAPI = new EventAPI(this.api.seventv_id, this.api.twitch.userID)

    this.EventAPI.onDelete = this.onEmoteDelete
    this.EventAPI.onRename = this.onEmoteRename
    this.EventAPI.onAdd = this.onEmoteAdd

    this.EventAPI.onBadgeCreate = this.onBadgeCreate
    this.EventAPI.onBadgeDelete = this.onBadgeDelete
    this.EventAPI.onPaintCreate = this.onPaintCreate
    this.EventAPI.onPaintDelete = this.onPaintDelete

    this.EventAPI.onPersonalEmotes = this.onPersonalEmotes

    this.EventAPI.Connect()

    //

    this.client = new TwitchClient(this.pageConfig.channel)
    this.client.OnPrivateMessage = this.createTwitchMessage
    this.client.newSystemMessage = this.createSystemMessage
    this.client.OnUserId = (id) => {
      if (this.userID == null) {
        this.userID = id
      }
    }
    this.client.OnClearChat = async (payload) => {
      if (payload.parameters == null) {
        // if paramaters, its a timeout. if not, its a clear chat
        this.messages = []
      } else {
        this.messages = this.messages.filter((item) => item.source.nick !== payload.parameters)
      }
    }
    this.client.OnClearMessage = async (payload) => {
      this.messages = this.messages.filter((item) => item.parameters !== payload.parameters)
    }
    this.client.OnCommandExecution = async (payload) => {
        switch(payload?.command?.botCommand) {
          case "refreshoverlay":
          case "refreshemotes":
            this.api.fetchEmotes()
            this.createSystemMessage('Emotes have been reloaded.')
            break
      }
    }
    this.client.connect()
    this.createSystemMessage(`Connected to #${this.pageConfig.channel}!`)
  },
  computed: {
    fontSize() {
      return `${this.pageConfig.fontSizeI}px`
    },

    isTransparent() {
      return this.pageConfig.backgrounds[0] == 'transparent'
    },
    fontName() {
      return this.pageConfig.fontName
    },
    fontWeight() {
      return this.pageConfig.fontWeight
    },
    animation() {
      if(this.pageConfig.dontAnimate == 'true') {
        return `0s`
      }
      return `fadeInUp 0.3s ease forwards`
    }
  },
}
</script>

<template>
  <div id="chat" :transparent="isTransparent">
    <Message
      v-for="(item, i) in messages"
      :key="item.tags.id"
      :payload="item"
      :api="api"
      :pageConfig="pageConfig"
      :pos="i"
      :class="{ fadeOut: item.fadeOut }"
    />
  </div>
</template>

<style>
#chat {
  font-family: v-bind('fontName');
  font-weight: v-bind('fontWeight');
  position: absolute;
  width: 100%;

  bottom: 0;

  left: 0;

  font-size: v-bind('fontSize');
  overflow: hidden;
  overflow-wrap: break-word;
}

@keyframes fadeInUp {
  from {
    transform: translate3d(0, 1em, 0);
    opacity: 0.5;
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

#chat > div {
  animation: v-bind('animation');
  filter: drop-shadow(3px 3px 0.1rem black);
}

#chat > div.fadeOut {
  animation: fadeOut 0.5s forwards;
}
</style>
