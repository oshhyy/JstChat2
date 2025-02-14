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

      if (this.api.stvbadges) {
        for (const value of this.api.stvbadges) {
          if (value.Users.includes(this.payload.tags.user_id)) {
            badges.push(value.Url)
          }
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
    Border() {
      return `${this.pageConfig.border}px solid black`
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
      :Paints="api.paints"
      :userid="payload.tags.user_id"
    />
    <span
      id="content"
      v-twitch-emotes="TwitchEmotes"
      v-emoji
      v-emotes="api.emotes"
      v-personal-emotes="api.personalEmotes[payload.source.nick]"
      >{{ payload.parameters }}</span
    >
  </div>
</template>

<style>
.emoji {
  vertical-align: middle;
  filter: unset;
  width: auto;
  max-height: 1.5em;
}
#content img {
  width: auto;
  height: 2.5em;
  max-width: 400px;
  vertical-align: middle;
    filter: drop-shadow(0 0 .1em rgba(0, 0, 0, 1));
} #content img[zerowidth="true"] {
    margin-left: calc(-3em);
}
#content {
  vertical-align: middle;
}
#message {
  border-top: v-bind(Border);

  min-height: v-bind('MessageSize');

  width: 100%;
  color: white;
  background-color: v-bind('Background');

  display: inline-block;
}
</style>
