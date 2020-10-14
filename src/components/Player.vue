<template>
  <div class="player" :class="{ 'is-playing': showPlayer }">
    <div class="content">
      <div class="progress-container">
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          class="time-line"
          v-model.lazy="progressSong"
          @change="updateTrackTimeline"
        >
        <div class="progress"></div>
        <div
            class="background"
            :style="{ width: calcProgressBackground }"
        ></div>
      </div>
      <div class="body">
        <div class="info">
          <div class="cover-mini" :style="coverStyles">
            <i v-if="!coverStyles" class="fa fa-music"></i>
          </div>
          <div class="properties">
            <div class="name" :title="currentTrack ? currentTrack.trackName : ''">
              {{ currentTrack ? currentTrack.trackName : '' }}
            </div>
            <div class="time">
              {{ currentPrettyTime }} / {{ fullPrettyTime }}
            </div>
          </div>
        </div>
        <div class="controls">
          <!-- controls -->
        </div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { TrackType, StatusType } from '@/store/types'
import { debounce, throttle } from 'lodash'

const tracks = namespace('Tracks')

@Component({})
export default class Player extends Vue {
    private progressSong = 0.0
    private sound: HTMLAudioElement | null = null
    private currentPrettyTime = ''
    private fullPrettyTime = ''
    private coverStyles: any | null = null
    private canSetProgressSongValue = true

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

    @tracks.Action
    private updateLiveFullTime!: (time: number) => void

    @tracks.Action
    private updateLiveCurrentTime!: (time: number) => void

    get calcProgressBackground () {
      return `${100.0 - this.progressSong}%`
    }

    get showPlayer () {
      return this.currentStatus !== StatusType.INACTIVE
    }

    private updateTrackTimeline (e: any) {
      if (!this.sound) return
      this.changeStatus(StatusType.PAUSED)
      this.canSetProgressSongValue = false
      setTimeout(() => {
        if (!this.sound) return
        console.log('set time!!!')
        this.sound.currentTime = (this.sound.duration * this.progressSong) / 100
        this.changeStatus(StatusType.PLAYING)
        this.canSetProgressSongValue = true
      }, 1000)
    }

    private prettyTime (time: number) {
      if (!time) return '00:00'

      const minutes: number = Math.floor(time / 60)
      const seconds: string = ((time % 60)).toFixed(0)
      return `${minutes < 10 ? '0' : ''}${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`
    }

    @Watch('currentTrack.url')
    onCurrentTrankChange () {
      if (this.currentTrack === null) return

      this.progressSong = 0

      this.sound = new Audio(this.currentTrack.url)

      this.sound.oncanplaythrough = () => {
        if (!this.sound || this.currentStatus === StatusType.PAUSED) return
        console.log('can play!!!', this.currentStatus)
        this.changeStatus(StatusType.PLAYING)
        this.updateLiveFullTime(this.sound.duration)
      }

      this.sound.onloadstart = () => {
        this.changeStatus(StatusType.WAITING)
      }

      this.sound.onwaiting = () => {
        this.changeStatus(StatusType.WAITING)
      }

      this.sound.onended = () => {
        this.updateLiveCurrentTime(0)
        this.changeStatus(StatusType.PAUSED)
        this.selectTrack(this.nextTrackId)
      }

      this.sound.ontimeupdate = throttle(() => {
        if (!this.sound) return
        this.updateLiveCurrentTime(this.sound.currentTime)
      }, 250)
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

    @Watch('currentTrack.liveCurrentTime')
    onLiveCurrentTimeChange (time: number) {
      if (!this.sound || !this.canSetProgressSongValue) return

      this.progressSong = (time / this.sound.duration) * 100
      this.currentPrettyTime = this.prettyTime(time)
    }

    @Watch('currentTrack.minPictureBlob')
    onPictureChange (image: Blob | null) {
      this.coverStyles = image ? {
        backgroundImage: `url(${URL.createObjectURL(image)})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%'
      } : null
    }

    @Watch('currentTrack.liveFullTime')
    onLiveFullTimeChange (time: number) {
      this.fullPrettyTime = this.prettyTime(time)
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

        case StatusType.INACTIVE:
          this.selectTrack(0)
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
    height 6.5rem
    background-color white
    transform translateY(100%)
    transition 200ms ease-in-out

    &.is-playing
      transform translateY(0)

    .content
        position relative
        height 100%

        .body
          width 100%
          height 100%
          display flex
          justify-content space-between
          align-items center
          padding 1.5rem
          box-sizing border-box

          .info
            display flex
            align-items center

            .cover-mini
              width 3.5rem
              height 3.5rem
              background white
              border-radius 8px
              text-align center
              display flex
              align-items center
              justify-content center
              box-shadow 0px 0px 5px 0px #b7b7b7

              i
                color #434343

            .properties
              display flex
              flex-direction column
              color #434343
              margin-left 15px

              .name
                font-weight 900
                text-transform uppercase
                font-size 1rem
                white-space nowrap
                overflow hidden
                text-overflow ellipsis
                max-width 300px

              .time
                font-weight normal
                font-family sans-serif
                font-size .8rem
                margin-top 3px
                color gray

        .background
            position absolute
            top 0
            right 0
            z-index 2
            background-color #d3d3d3

        .progress
            position absolute
            top 0
            width 100%
            z-index 1
            background linear-gradient(linear-gradient-progress)

        .time-line
          position absolute
          top 0
          z-index 3
          width 100%
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
              opacity 0

        .progress-container
          position absolute
          width 100%
          height 7px
          top 0
          transition 200ms ease-in-out

          .background, .progress, .time-line
            top 0
            height 3px

          &:hover
            // .background, .progress, .time-line
            // top -1px
            transform scaleY(1.4)
            .time-line
              &::-webkit-slider-thumb
                transform scaleX(1.1) scaleY(.8)
                opacity 1
@media only screen and (max-width: 48em)
  .name
    max-width 200px !important
</style>
