<script>
import ColourDistance from '@/utils/color'
import Common from '@/utils/common'

export default {
  name: 'NicknameComponent',
  props: {
    nick: String,
    color: String,
    pageConfig: Object,
    Background: String,
    Paints: Object,
    userid: String,
    action: String,
  },
  computed: {
    Color() {
      let color = this.color
      if (this.Background != 'transparent') {
        // если сообщение сливается с фоном:
        let userRGB = Common.hexToRgb(color)
        let backgroundRGB = Common.hexToRgb(this.Background)

        // схожесть цветов
        let userXYZ = ColourDistance.rgb2xyz(userRGB[0], userRGB[1], userRGB[2])
        let backgroundXYZ = ColourDistance.rgb2xyz(
          backgroundRGB[0],
          backgroundRGB[1],
          backgroundRGB[2],
        )

        let distance =
          ColourDistance.deltaE00(
            userXYZ[0],
            userXYZ[1],
            userXYZ[2],
            backgroundXYZ[0],
            backgroundXYZ[1],
            backgroundXYZ[2],
          ) * 10
        if (distance == 0) {
          distance = 0.0001
        }
        if (distance < 0.3) {
          // значит фон сливается, теперь мы добавляем/убавляем +40% яркость пользователю
          let newColor = Common.pSBC(0.25, color)
          return newColor
        }
      }
      return color
    },
    HavePaints() {
      if (this.Paint != undefined) {
        return true
      }
      return false
    },
    Paint() {
      for (const value of this.Paints) {
        if (value.users.includes(this.userid)) {
          return value
        }
      }
      return null
    },
    bgImage() {
      if (!this.Paint) {
        return ''
      }
      let cssFunc = ''

      const args = []
      switch (this.Paint.function) {
        case 'LINEAR_GRADIENT':
          cssFunc = 'linear-gradient'
          args.push(`${this.Paint.angle}deg`)
          break
        case 'RADIAL_GRADIENT':
          cssFunc = 'radial-gradient'
          args.push(this.Paint.shape ?? 'circle')
          break
        case 'URL':
          cssFunc = 'url'
          args.push(this.Paint.image_url ?? '')
          break
      }
      let funcPrefix = ''
      if (this.Paint.function !== 'URL') {
        funcPrefix = this.Paint.repeat ? 'repeating-' : ''
      }
      for (const stop of this.Paint.stops) {
        const color = Common.DecimalToStringRGBA(stop.color)
        args.push(`${color} ${stop.at * 100}%`)
      }
      return `${funcPrefix}${cssFunc}(${args.join(', ')})`
    },
    filter() {
      try {
        return this.Paint.shadows
          .map(
            (v) =>
              `drop-shadow(${v.x_offset*2}px ${v.y_offset*2}px ${v.radius}px ${Common.DecimalToStringRGBA(v.color)})`,
          )
          .join(' ')
      } catch {
        return ''
      }
    },
  },
}
</script>

<template>
  <span class="nickname" :HavePaints="HavePaints"> {{ nick }}{{ action }} </span>
</template>

<style>
.nickname {
  color: v-bind('Color');
  filter: v-bind('filter');
  vertical-align: middle;
  margin-left: 4px;
  background-size: cover;
}
.nickname[HavePaints='true'] {
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text !important;
  background-color: currentcolor;
  background-image: v-bind('bgImage');
  color: transparent !important;
  text-shadow: none !important;
}
</style>
