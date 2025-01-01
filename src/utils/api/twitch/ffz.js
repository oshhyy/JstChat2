export default {
  async getFfzEmotes(channel) {
    // returns emotes, mod badge, vip badge
    let emotes = {}

    const response = await fetch(`https://api.frankerfacez.com/v1/room/${channel}`)
    if (response.ok) {
      const json = await response.json()
      for (const value of json['sets'][json['room']['set'].toString()]['emoticons']) {
        emotes[value.name] = { ID: value.id, Type: 'FFZ', animated: 'animated' in value }
      }

      // getting custom badges:
      console.log(json.room.mod_urls)
      let mod_badge = undefined
      if (json.room.mod_urls != undefined) mod_badge = json.room.mod_urls['2']

      console.log(json.vip_badge)
      let vip_badge = undefined
      if (json.room.vip_badge != undefined) vip_badge = json.room.vip_badge['2']
      return [emotes, mod_badge, vip_badge]
    }
    if (response.status != 404) {
      throw 'not loaded'
    }
    return []
  },
  async getFfzGlobalEmotes() {
    let emotes = {}

    const response = await fetch(`https://api.frankerfacez.com/v1/set/global`)
    if (response.ok) {
      const json = await response.json()
      for (const value of json['sets']['3']['emoticons']) {
        emotes[value.name] = { ID: value.id, Type: 'FFZ', animated: 'animated' in value }
      }
      return emotes
    }
    if (response.status != 404) {
      throw 'not loaded'
    }
    return {}
  },
}
