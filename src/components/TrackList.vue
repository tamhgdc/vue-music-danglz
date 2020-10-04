<template>
  <div class="list" id="list-track">
      <TrackElement
        v-for="(track, i) in trackList"
        :key="track.id"
        :name="track.trackName"
        :album="track.album"
        :time="track.time"
        :artist="track.artist"
        :isFirst="i == 0"
        :isLast="i == trackList.length - 1"
      />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import { TrackType } from '@/store/types'
import TrackElement from '@/components/TrackElement.vue'

const tracks = namespace('Tracks')

@Component({
  components: {
    TrackElement
  }
})
export default class TrackList extends Vue {
  beforeMount () {
    this.fetchTracks()
  }

  @tracks.Action
  private fetchTracks!: () => void

  @tracks.Getter
  private trackList!: () => Array<TrackType>
}
</script>

<style lang="stylus" scoped>
.list
    background-color white
    width 100%
    border-radius 15px
    border 1px solid #e3e3e3
    margin-bottom 7rem
</style>
