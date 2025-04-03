import SevenTVAPI from './twitch/7tv'
import bttv from './twitch/bttv'
import ffz from './twitch/ffz'
import TwitchAPI from './twitch/twitch'

// @todo: https://7tv.io/v3/emote-sets/global
const SevenTVGlobalEmoteSetID = '01HKQT8EWR000ESSWF3625XCS4'

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
    this.ffzbadges = []
    this.seventv_id = null
  }

  async fetchEmotes() {
    let em;
    try {
      let s = await this.SevenTV.get7tvEmotes(this.twitch.userID)
      this.emotes = Object.assign(this.emotes, s[0])
      this.seventv_id = s[1]
      console.log(this.seventv_id)

      em = await this.SevenTV.get7tvEmoteSetObj(SevenTVGlobalEmoteSetID)
      this.emotes = Object.assign(this.emotes, em)
    } catch (err) {
      console.log(err)
    }

    this.emotes = Object.assign(this.emotes, await this.BTTV.getBttvGlobalEmotes())
    this.emotes = Object.assign(this.emotes, await this.BTTV.getBttvEmotes(this.twitch.userID))
    em = await this.FFZ.getFfzEmotes(this.twitch.channel)
    if(em[1] != undefined) {
      this.twitch.badges["moderator"] = {'1': em[1]}
    }
    if(em[2] != undefined) {
      this.twitch.badges["vip"] = {'1': em[2]}
    }

    this.emotes = Object.assign(this.emotes, em[0])
    this.emotes = Object.assign(this.emotes, await this.FFZ.getFfzGlobalEmotes(this.twitch.userID))

    this.ffzbadges = await this.FFZ.getFfzBadges(this.twitch.channel)

    console.log("Fetched Third Party Emotes.")
  }
}
