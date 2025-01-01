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

      pageConfig: {
        maxMes: 50,
        fontSizeI: parseInt(this.$route.query.font_size || '18'),
        channel: this.$route.query.channel,

        backgrounds: [this.$route.query.background || '#2b2b2b'],
        calcSecondBackgrounds: parseInt(this.$route.query.sb || '5'),
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

      this.messages.push(message)
    },
    createSystemMessage(message) {
      if (this.messages.length >= this.pageConfig.maxMes) {
        this.messages.shift()
      }
      let mes = {
        parameters: message,
        tags: { display_name: 'CHAT', id: '0' },
        source: { nick: 'chat' },
      }
      mes.type = 'system'

      mes.background = this.useBG
      if (this.useBG + 1 > this.pageConfig.backgrounds.length - 1) {
        this.useBG = 0
      } else {
        this.useBG += 1
      }

      this.messages.push(mes)
    },
  },
  created: async function () {
    this.createSystemMessage('loading')

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
    this.client.OnUserId = (id) => {
      if (this.userID == null) {
        this.userID = id
      }
    }
    this.client.OnClearMessage = () => {}
    this.client.OnClearChat = () => {}
    this.client.connect()
  },
  computed: {
    fontSize() {
      return `${this.pageConfig.fontSizeI}px`
    },
    mlen() {
      return `${this.messages.length - 1}`
    },
  },
}
</script>

<template>
  <div id="chat">
    <Message
      v-for="(item, i) in messages"
      :key="item.tags.id"
      :payload="item"
      :api="api"
      :pageConfig="pageConfig"
      :pos="i"
    />
  </div>
</template>

<style>
#chat {
  position: absolute;
  width: 100%;

  bottom: 0;

  left: 0;

  font-size: v-bind('fontSize');
  border-radius: 30px;
}
#message[pos='v-bind(mlen)'] {
  border: 10px solid red;
}
</style>
