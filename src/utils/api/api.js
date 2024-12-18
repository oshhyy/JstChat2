import SevenTVAPI from './twitch/7tv'
import bttv from './twitch/bttv'
import TwitchAPI from './twitch/twitch'

// @todo: нужно как то получать этот айди, а то эмоуты меняются по празникам
const SevenTVGlobalEmoteSetID = '01GG8F04Y000089195YKEP5CA3'

export default class API {
  constructor(channel) {
    this.SevenTV = SevenTVAPI
    this.BTTV = bttv
    this.twitch = new TwitchAPI(channel)
    this.emotes = {}
  }

  async fetchEmotes() {
    let em = await this.SevenTV.get7tvEmotes(this.twitch.userID)
    this.emotes = Object.assign(this.emotes, em[0])

    em = await this.SevenTV.get7tvEmoteSetObj(SevenTVGlobalEmoteSetID)
    this.emotes = Object.assign(this.emotes, em)

    this.emotes = Object.assign(this.emotes, await this.BTTV.getBttvGlobalEmotes())
    this.emotes = Object.assign(this.emotes, await this.BTTV.getBttvEmotes(this.twitch.userID))
  }
}
