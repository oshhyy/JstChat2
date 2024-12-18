<script>
import Nickname from './MessageComponents/Nickname.vue'
import Badge from './MessageComponents/Badge.vue'
import Common from '@/utils/common'

export default {
  name: 'MessageView',
  components: { Nickname, Badge },
  props: {
    payload: Object,
    api: Object,
    pageConfig: Object,
  },
  computed: {
    Badges() {
      let badges = []

      if (this.payload.tags.badges != null) {
        for (const [i, k] of Object.entries(this.payload.tags.badges)) {
          badges.push(this.api.twitch.badges[i][k])
        }
      }

      return badges
    },
    MessageSize() {
      return `${Math.round(1.33 * this.pageConfig.fontSizeI + 7)}px`
    },
    Background() {
      return this.pageConfig.backgrounds[this.payload.background]
    },
    TwitchEmotes() {
      if (this.payload.tags.emotes != undefined) {
        return Common.parse_smiles(this.payload.parameters, this.payload.tags['emotes'])
      }
      return {}
    },
    EmoteSize() {
      return `${this.pageConfig.fontSizeI + 13}px`
    },
    EmojiSize() {
      return `${this.pageConfig.fontSizeI + 10}px`
    },
  },
}
</script>

<template>
  <div id="message">
    <Badge v-for="(badge, pos) in Badges" :key="pos" :url="badge" :pageConfig="pageConfig" />

    <Nickname
      :nick="payload.tags.display_name"
      :color="payload.tags.color"
      :pageConfig="pageConfig"
      :Background="Background"
    />
    <span id="content" v-twitch-emotes="TwitchEmotes" v-emoji v-emotes="api.emotes">{{
      payload.parameters
    }}</span>
  </div>
</template>

<style>
.emoji {
  height: v-bind('EmojiSize') !important;
}
#content img,
.emoji {
  height: v-bind('EmoteSize');
  vertical-align: middle;
  filter: unset;
  padding-right: 5px;
}
#content {
  vertical-align: middle;
}
#message {
  border-top: 2px solid black;

  min-height: v-bind('MessageSize');

  width: 100%;
  color: white;
  background-color: v-bind('Background');

  display: inline-block;
}
</style>
