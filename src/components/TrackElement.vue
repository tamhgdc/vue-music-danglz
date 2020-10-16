<template>
    <div
      class="track"
      :class="{first: isFirst, last: isLast}"
      @click="trackControl()"
    >
        <div class="identity">
            <Button
                @mouseover.native="hoverPlay = true"
                @mouseleave.native="hoverPlay = false"
                :isHovered="currentTrack && currentTrack.id === id"
                :isLoading="true"
            >
                <template v-if="pauseValidator">
                    <i class="fa fa-pause"></i>
                </template>
                <template v-else>
                    <i v-if="playValidator" class="fa fa-play"></i>
                    <i v-else class="fa fa-music"></i>
                </template>
            </Button>
            <div class="title">
                <div class="name">{{ name }}</div>
                <div v-if="album && artist" class="album">{{ artist }} | {{ album }}</div>
                <div v-else-if="artist" class="album">{{ artist }}</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import Button from '@/components/ui/Button.vue'
import { StatusType, TrackType } from '@/store/types'

const tracks = namespace('Tracks')

@Component({
  components: {
    Button
  }
})
export default class TrackElement extends Vue {
    @Prop(String) readonly name!: string
    @Prop(String) readonly album!: string
    @Prop(String) readonly artist!: string
    @Prop(Number) readonly time!: number
    @Prop(Boolean) readonly isFirst!: boolean
    @Prop(Boolean) readonly isLast!: boolean

    @tracks.Action
    private selectTrack!: (key: string | number | undefined) => void

    @tracks.Action
    private changeStatus!: (status: StatusType) => void

    @tracks.Action
    private updateLiveCurrentTime!: (time: number) => void

    @tracks.Getter
    private currentTrack!: TrackType | null

    @tracks.Getter
    private currentStatus!: StatusType

    private hoverPlay = false

    get buttonIsLoading () {
      return this.currentTrack && this.currentTrack.id === this.id && this.currentStatus === StatusType.WAITING
    }

    get pauseValidator () {
      return this.currentTrack && this.currentTrack.id === this.id && (
        this.currentStatus === StatusType.PLAYING || this.currentStatus === StatusType.WAITING)
    }

    get playValidator () {
      return this.hoverPlay || (
        this.currentTrack && this.currentTrack.id === this.id && this.currentStatus === StatusType.PAUSED
      )
    }

    get id (): number | string | undefined {
      return this.$vnode.key
    }

    private trackControl () {
      if (this.currentTrack && this.currentTrack.id === this.id) {
        // toggle player
        this.changeStatus(
          this.currentStatus === StatusType.PLAYING
            ? StatusType.PAUSED
            : StatusType.PLAYING
        )
      } else {
        // set track
        this.changeStatus(StatusType.PAUSED)
        this.updateLiveCurrentTime(0)
        setTimeout(() => this.selectTrack(this.id))
      }
    }
}
</script>
<style lang="stylus" scoped>
.track
    padding 1.3rem 2rem
    border-bottom 1px solid #e3e3Ee
    color #434343
    display flex
    justify-content space-between
    align-items center
    text-transform uppercase
    transition 100ms ease-in-out
    cursor pointer
    text-align left

    &.first
        border-radius 10px 10px 0 0

    &.last
        border-radius 0 0 10px 10px

    &:hover
        background-color #f1f1f1

    .identity
        display flex
        align-items center
        i
            width 20px
            font-size 1.2rem
            &.fa-play
                transform translateX(2px)

        .title
            margin-left 1.3rem
            font-size .8rem
            .name
                font-weight 900
            .album
                margin-top 5px

@media only screen and (max-width: 48em)
  .track
    padding 1rem 1.2rem
    .identity
      font-size 1rem !important
      .title
        font-size .75rem !important
        margin-left 1rem !important
</style>
