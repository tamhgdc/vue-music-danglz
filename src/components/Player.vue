<template>
  <div class="player">
      <div class="content">
        <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            class="time-line"
            v-model="progressSong"
        >
        <div class="progress"></div>
        <div
            class="background"
            :style="{ width: calcProgressBackground }"
        ></div>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class Player extends Vue {
    private progressSong = 0.0

    get calcProgressBackground () {
      return `${100.0 - this.progressSong}%`
    }
}
</script>

<style lang="stylus" scoped>
@import '../styles/variables.styl'

.player
    position fixed
    bottom 0
    width 100%
    height 5rem
    background-color white

    .content
        position relative

        .background
            position absolute
            top 0
            right 0
            z-index 2
            height 7px
            background-color #d3d3d3

        .progress
            position absolute
            top 0
            width 100%
            height 7px
            z-index 1
            background linear-gradient(linear-gradient-progress)

        .time-line
            position absolute
            top 0
            z-index 3
            width 100%
            height 7px
            appearance none
            background transparent
            outline none
            padding 0
            margin 0

            &::-webkit-slider-thumb
                appearance none
                width 15px
                height 15px
                border-radius 50%
                background white
                box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
                border .5px solid #e0e0e0
                cursor pointer
                transform scale(0)
                transition 100ms ease-in-out

            &:hover
                &::-webkit-slider-thumb
                    transform scale(1)

</style>
