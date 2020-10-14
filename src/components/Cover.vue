<template>
  <div class="cover">
    <div class="cover-image" :style="coverUrl">
        <i v-if="!coverUrl" class="fa fa-music"></i>
    </div>
    <div v-if="currentTrack" class="name">{{ currentTrack.trackName }}</div>
    <div v-if="currentTrack && currentTrack.artistName && currentTrack.album" class="artist-and-album">
        {{ currentTrack.artistName }} | {{ currentTrack.album }}
    </div>
    <div v-else-if="currentTrack && currentTrack.artistName" class="artist-and-album">{{ currentTrack.artistName }}</div>
        <!-- <div class="links">
            <a href="https://github.com/danlgz/vue-music-player" target="_blank">
                <i class="fab fa-github"></i>
            </a>
            <a href="https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/" target="_blank">
                <i class="fab fa-itunes-note"></i>
            </a>
        </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import { TrackType } from '@/store/types'

import Loader from '@/components/ui/Loader.vue'

const tracks = namespace('Tracks')

@Component({
  components: {
    Loader
  }
})
export default class Cover extends Vue {
    lastTrackId = 0
    isLoading = true

    @tracks.Getter
    currentTrack!: TrackType | null

    @tracks.Action
    fetchPictureBlob!: (id: number) => void

    @tracks.Action
    fetchMinPictureBlob!: (id: number) => void

    get coverUrl () {
      if (!this.currentTrack) return null

      if (this.currentTrack.pictureBlob) return this.buildStyleObject(this.currentTrack.pictureBlob)
      if (this.currentTrack.minPictureBlob) return this.buildStyleObject(this.currentTrack.minPictureBlob, true)

      this.fetchMinPictureBlob(this.currentTrack.id)
      this.fetchPictureBlob(this.currentTrack.id)

      return null
    }

    buildStyleObject (pictureBlob: Blob, withBlur = false) {
      return {
        backgroundImage: `url(${URL.createObjectURL(pictureBlob)})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%',
        filter: withBlur ? 'blur(3px)' : 'none'
      }
    }
}
</script>
<style lang="stylus">
@import '../styles/variables.styl'

.cover
    position: sticky
    top 5rem
    // left 0
    width 80%
    margin 0 auto
    margin-bottom 5rem

    .name
        text-align: center;
        font-weight: 900;
        text-transform: uppercase;
        color: white;
        padding: 2rem 0 1rem 0;

    .artist-and-album
        text-align center
        text-transform uppercase
        color white
        font-size .75rem

    .cover-image
        background-color white
        background-image linear-gradient(white, white)
        border-radius 10px
        display flex
        justify-content center
        align-items center
        text-align center
        box-shadow 0px 0px 15px rgba(0, 0, 0, 0.25)
        transition 200ms ease-in-out
        transition-delay 200ms

        &:after
            content ""
            display block
            padding-bottom 100%

        i
            font-size 3.5rem
            transition 200ms ease-in-out

    svg
        position absolute
        transform scale(.5)
        transition 200ms ease-in-out
        opacity 0

        &.loading
            transform scale(1)
            opacity 1

    .links
        position absolute
        top 30rem
        width 7rem
        display flex
        justify-content space-between
        a
            opacity 0.5
            transition 100ms ease-in-out
            &:hover
                opacity 0.7
            i
                font-size 2.5rem
                color white

@media only screen and (max-width: 64em)
    .cover
        position initial
    .track-info
        height auto !important
</style>
