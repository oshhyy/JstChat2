import SevenTVAPI from './twitch/7tv'
import bttv from './twitch/bttv'
import ffz from './twitch/ffz'
import TwitchAPI from './twitch/twitch'

// @todo: нужно как то получать этот айди, а то эмоуты меняются по празникам
const SevenTVGlobalEmoteSetID = '01GG8F04Y000089195YKEP5CA3'

export default class API {
  constructor(channel) {
    this.stvbadges = []
    this.paints = []
    this.SevenTV = SevenTVAPI
    this.BTTV = bttv
    this.FFZ = ffz
    this.twitch = new TwitchAPI(channel)
    this.emotes = {}
    this.personalEmotes = {}

    this.seventv_id = null
  }

  async fetchEmotes() {
    let s = await this.SevenTV.get7tvEmotes(this.twitch.userID)
    this.emotes = Object.assign(this.emotes, s[0])

    this.seventv_id = s[1]
    console.log(this.seventv_id)

    let em = await this.SevenTV.get7tvEmoteSetObj(SevenTVGlobalEmoteSetID)
    this.emotes = Object.assign(this.emotes, em)

    this.emotes = Object.assign(this.emotes, await this.BTTV.getBttvGlobalEmotes())
    this.emotes = Object.assign(this.emotes, await this.BTTV.getBttvEmotes(this.twitch.userID))
    em = await this.FFZ.getFfzEmotes(this.twitch.channel)
    this.emotes = Object.assign(this.emotes, em[0])
    this.emotes = Object.assign(this.emotes, await this.FFZ.getFfzGlobalEmotes(this.twitch.userID))
    console.log(this.emotes)
  }
}
