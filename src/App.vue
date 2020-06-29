<template>
  <div class="container">
    <div class="tracks-view">
      <div class="track-info" :style="{height: heightElement}">
        <Cover />
      </div>
      <div class="track-list">
        <TrackList />
      </div>
    </div>
    <Player/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import Player from '@/components/Player.vue'
import TrackList from '@/components/TrackList.vue'
import Cover from '@/components/Cover.vue'

const tracks = namespace('Tracks')

@Component({
  components: {
    Player,
    TrackList,
    Cover
  }
})
export default class App extends Vue {
  @tracks.Getter
  private getTracksLength!: number

  private get heightElement (): string {
    if (this.getTracksLength === 0) return 'auto'
    return `${115 * this.getTracksLength}px`
  }
}
</script>

<style lang="stylus">

@import './styles/variables.styl'
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

body
  margin 0
  padding 0
  font-family 'Montserrat', sans-serif

  .container
    width 100%
    height 100vh
    background linear-gradient(linear-gradient)

    .tracks-view
      padding 3rem 6rem
      height calc(100vh - 6rem)
      display flex
      overflow-y auto

      .track-info
        width 30%
        position relative
        // height parent

      .track-list
        width 70%

</style>
