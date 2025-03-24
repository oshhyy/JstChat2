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
      if (json.room.mod_urls != undefined) mod_badge = `https://cdn.frankerfacez.com/room-badge/mod/${channel}/2/rounded`

      console.log(json.vip_badge)
      let vip_badge = undefined
      if (json.room.vip_badge != undefined) vip_badge = `https://cdn.frankerfacez.com/room-badge/vip/${channel}/2`
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
  async getFfzBadges(channel) {
    let badges = []
    const response = await fetch(`https://api.frankerfacez.com/v1/badges`)
    if (response.ok) {
      const json = await response.json()
      for (const b of json.badges) {
        badges.push({id: b.id, name:b.name, url:`https://cdn.frankerfacez.com/badge/${b.id}/2/rounded`, users:json.users[b.id]})
      }
      const channelResponse = await fetch(`https://api.frankerfacez.com/v1/_room/${channel}`)
      if(channelResponse.ok) {
        const channelJson = await channelResponse.json()
        if(channelJson.room.user_badges['2']) {
          for (const b of badges) {
            if (b.id == 2) {
              b.users.push(...channelJson.room.user_badges['2'])
            }
          }
        }
      }
      return badges
    }
    if (response.status != 404) {
      throw 'not loaded'
    }
  }
}
