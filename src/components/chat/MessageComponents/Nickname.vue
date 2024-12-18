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
    Color() {
      let color = this.color
      if (!this.color) {
        color = this.defaultColors[Math.floor(Math.random() * this.defaultColors.length)]
        return color
      }
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
  },
}
</script>

<template>
  <span class="nickname"> {{ nick }}: </span>
</template>

<style>
.nickname {
  color: v-bind('Color');
  vertical-align: middle;
  margin-left: 4px;
  font-weight: 700;
}
</style>
