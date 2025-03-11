export default {
  async get7tvEmoteSet(set_id) {
    const response = await fetch(`https://7tv.io/v3/emote-sets/${set_id}`)
    if (response.ok) {
      let emotes = []

      const json = await response.json()
      if (json.emotes != undefined) {
        for (const emote of json.emotes) {
          emotes.push({ Name: emote.name, ID: emote.id, Type: '7TV', ZeroWidth: emote.flags == 1 })
        }

        let owner = json.owner.username

        return [emotes, owner]
      } else {
        return [undefined, undefined]
      }
    }
    throw 'failed to fetch 7tv emote set'
  },

  async get7tvEmotes(user_id) {
    let emotes = {}

    const response = await fetch(`https://7tv.io/v3/users/twitch/${user_id}`)
    if (response.ok) {
      const json = await response.json()
      for (const value of json['emote_set']['emotes']) {
        emotes[value.name] = { ID: value.id, Type: '7TV', ZeroWidth: value.flags == 1 }
      }
      return [emotes, json['emote_set']['id']]
    }
    if (response.status != 404) {
      throw '7tv not loaded'
    }
    return {}
  },

  async get7tvEmoteSetObj(emoteSetID) {
    let emotes = {}

    const response = await fetch(`https://7tv.io/v3/emote-sets/${emoteSetID}`)
    if (response.ok) {
      const json = await response.json()
      for (const value of json['emotes']) {
        emotes[value.name] = { ID: value.id, Type: '7TV', ZeroWidth: value.flags == 1 }
      }
      return emotes
    }
    if (response.status != 404) {
      throw 'not loaded'
    }
    return {}
  },
}
