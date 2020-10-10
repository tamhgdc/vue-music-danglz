<template>
  <div class="container">
    <div class="wrapper">
      <div class="tracks-view">
        <div class="track-info" :style="{height: heightElement}">
          <Cover />
        </div>
        <div class="track-list">
          <Input
            placeholder="Type your search and press enter"
            :isLoading="isFetchingTracks"
            :onKeyPress="onKeyPress"
            v-model="searchWord"
          />
          <TrackList />
        </div>
      </div>
    </div>
    <Player/>

    <a class="github" href="https://github.com/danlgz/vue-music-player" target="_blank">
      <i class="fab fa-github"></i>
    </a>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import Player from '@/components/Player.vue'
import TrackList from '@/components/TrackList.vue'
import Cover from '@/components/Cover.vue'
import Input from '@/components/ui/Input.vue'

import { StatusType } from '@/store/types'

const tracks = namespace('Tracks')

@Component({
  components: {
    Player,
    TrackList,
    Cover,
    Input
  }
})
export default class App extends Vue {
  private searchWord = ''

  @tracks.Getter
  private getTracksLength!: number

  @tracks.Getter
  private isFetchingTracks!: boolean

  @tracks.Action
  private fetchTracks!: (search: string) => void

  @tracks.Action
  private changeStatus!: (status: StatusType) => void

  @tracks.Action
  private selectTrack!: (id: number) => void

  private get heightElement (): string {
    if (this.getTracksLength < 6) return 'auto'
    return `${95 * this.getTracksLength}px`
  }

  private onKeyPress (event: KeyboardEvent) {
    if (event.key === 'Enter' && !!this.searchWord) {
      this.changeStatus(StatusType.PAUSED)
      this.fetchTracks(this.searchWord)
      setTimeout(() => this.changeStatus(StatusType.INACTIVE))
    }
  }
}
</script>

<style lang="stylus">

@import './styles/variables.styl'
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap');

body
  margin 0
  padding 0
  font-family 'Montserrat', sans-serif

  .github
    position fixed
    bottom 1.5rem
    right 2.2rem
    font-size 2.2rem
    color #3c3c3c
    opacity 0.7
    transition 200ms ease-in-out
    &:hover
      opacity 1
      transform scale(1.1)

  .container
    width 100%
    height 100vh
    background linear-gradient(linear-gradient)
    overflow-y auto

    .wrapper
      max-width 1700px
      margin 0 auto

    .tracks-view
      padding 3rem 6rem
      height calc(100vh - 6rem)
      display flex
      // overflow-y auto

      .track-info
        width 30%
        position relative
        // height parent

      .track-list
        width 70%

</style>
