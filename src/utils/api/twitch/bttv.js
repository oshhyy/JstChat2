export default {
  async getBttvEmotes(user_id) {
    let emotes = {}
    const response = await fetch(`https://api.betterttv.net/3/cached/users/twitch/${user_id}`)
    if (response.ok) {
      const json = await response.json()
      if (json['sharedEmotes']) {
        for (const value of json['sharedEmotes']) {
          emotes[value.code] = { ID: value.id, Type: 'BTTV' }
        }
      }
      if (json['channelEmotes']) {
        for (const value of json['channelEmotes']) {
          emotes[value.code] = { ID: value.id, Type: 'BTTV' }
        }
      }
      return emotes
    }
    if (response.status != 404) {
      throw 'not loaded'
    }
    return {}
  },
  async getBttvGlobalEmotes() {
    let emotes = {}

    const response = await fetch(`https://api.betterttv.net/3/cached/emotes/global`)
    if (response.ok) {
      const json = await response.json()
      for (const value of json) {
        emotes[value.code] = { ID: value.id, Type: 'BTTV', ZeroWidth: value.code == 'cvHazmat' || value.code == 'cvMask' }
      }
      return emotes
    }
    if (response.status != 404) {
      throw 'not loaded'
    }
    return {}
  },
}
