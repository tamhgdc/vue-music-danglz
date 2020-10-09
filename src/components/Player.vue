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
import { Component, Vue, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { TrackType, StatusType } from '@/store/types'

const tracks = namespace('Tracks')

@Component({})
export default class Player extends Vue {
    private progressSong = 0.0
    private sound: HTMLAudioElement | null = null

    @tracks.Getter
    private currentTrack!: TrackType | null

    @tracks.Getter
    private currentStatus!: StatusType

    @tracks.Getter
    private nextTrackId!: number

    @tracks.Action
    private changeStatus!: (status: StatusType) => void

    @tracks.Action
    private selectTrack!: (id: number) => void

    get calcProgressBackground () {
      return `${100.0 - this.progressSong}%`
    }

    @Watch('currentTrack.url')
    onCurrentTrankChange () {
      if (this.currentTrack === null) return

      this.progressSong = 0

      this.sound = new Audio(this.currentTrack.url)

      this.sound.oncanplaythrough = () => {
        this.changeStatus(StatusType.PLAYING)
      }

      this.sound.onloadstart = () => {
        this.changeStatus(StatusType.WAITING)
      }

      this.sound.onwaiting = () => {
        this.changeStatus(StatusType.WAITING)
      }

      this.sound.onended = () => {
        this.changeStatus(StatusType.PAUSED)
        this.changeStatus(StatusType.INACTIVE)
        setTimeout(() => this.selectTrack(this.nextTrackId))
      }

      this.sound.ontimeupdate = () => {
        if (!this.sound) return

        this.progressSong = (this.sound.currentTime / this.sound.duration) * 100
      }
      // this not work!!!
      // https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/821

    //   if ('mediaSession' in navigator && (navigator as NavigatorMediaSession).mediaSession) {
    //     (navigator as NavigatorMediaSession).mediaSession.metadata = new MediaMetadata({
    //       title: this.currentTrack.trackName,
    //       artist: this.currentTrack.artistName,
    //       album: this.currentTrack.album,
    //       artwork: [{ src: this.currentTrack.picture }]
    //     })
    //   }
    }

    @Watch('currentStatus')
    onStatusChange (status: StatusType) {
      if (this.sound === null) return

      switch (status) {
        case StatusType.PAUSED:
          this.sound.pause()
          break

        case StatusType.PLAYING:
          this.sound.play()
          break
      }
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
