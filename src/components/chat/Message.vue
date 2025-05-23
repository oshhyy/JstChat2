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
  data() {
    return {
      defaultColors: [
        '#4242f7',
        '#ff7f50',
        '#1e90ff',
        '#00ff7f',
        '#9acd32',
        '#008000',
        '#ff4500',
        '#ff0000',
        '#daa520',
        '#ff69b4',
        '#5f9ea0',
        '#2e8b57',
        '#d2691e',
        '#a065d7',
        '#b22222',
      ],
    }
  },
  computed: {
    Badges() {
      let badges = []

      if (this.payload.tags.badges != null) {
        for (const [i, k] of Object.entries(this.payload.tags.badges)) {
          badges.push(this.api.twitch.badges[i][k])
        }
      }

      if(this.api.ffzbadges) {
        for (const value of this.api.ffzbadges) {
          if (value.users.includes(this.payload.source.nick)) {
            badges.push(value.url)
          }
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
    SlashMe() {
      if(this.payload.action == true) {
        return `${this.payload.tags.color}`
      }
      return `white`
    },
    ActionUsername() {
      if(this.payload.action == true) {
        return ` `
      }
      return `: `
    },
    UserColor() {
      if(this.payload.tags.color) {
        return this.payload.tags.color
      }
      return this.defaultColors[Math.floor(Math.random() * this.defaultColors.length)]
    }
  },
}
</script>

<template>
  <div id="message">
    <Badge v-for="(badge, pos) in Badges" :key="pos" :url="badge" :pageConfig="pageConfig" />

    <Nickname
      :nick="payload.tags.display_name"
      :color="UserColor"
      :pageConfig="pageConfig"
      :Background="Background"
      :Paints="api.paints"
      :userid="payload.tags.user_id"
      :action="ActionUsername"
    />
    <span
      id="content"
      v-twitch-emotes="TwitchEmotes"
      v-emoji
      v-personal-emotes="api.personalEmotes[payload.source.nick]"
      v-emotes="api.emotes"
      >{{ payload.parameters }}</span
    >
  </div>
</template>

<style>
#content img {
  max-width: 7.5em;
  max-height: 2.5em;
  width: auto;
  height: 2.5em;
  vertical-align: middle;
}
#content img[zerowidth="true"] {
  position: absolute;
  transform: translateX(calc(-100%));
}
#content .emoji {
  vertical-align: middle;
  filter: unset;
  width: auto;
  max-height: 1.5em;
}
#content {
  vertical-align: middle;
}
#message {
  border-top: v-bind(Border);

  min-height: v-bind('MessageSize');

  width: 100%;
  color: v-bind('SlashMe');
  background-color: v-bind('Background');

  display: inline-block;
}
</style>
