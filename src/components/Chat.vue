<script>
import Message from './chat/Message.vue'
import TwitchClient from '@/utils/chat_clients/twitch/client'
import API from '@/utils/api/api'
import Common from '@/utils/common'

export default {
  name: 'ChatView',
  components: { Message },
  data: function () {
    return {
      client: null,
      api: null,
      messages: [],
      userID: null,
      useBG: 0,

      pageConfig: {
        maxMes: 50,
        fontSizeI: 18,
        channel: 'melharucos',

        backgrounds: ['#2b2b2b'],
        calcSecondBackgrounds: 3,
      },
    }
  },
  methods: {
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
      let mes = { parameters: message, tags: { display_name: 'CHAT', id: '0' } }
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
    this.createSystemMessage('Loading data')

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

        console.log(ind)

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
    this.api.fetchEmotes()

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
  },
}
</script>

<template>
  <div id="chat">
    <Message
      v-for="item in messages"
      :key="item.tags.id"
      :payload="item"
      :api="api"
      :pageConfig="pageConfig"
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
}
</style>
