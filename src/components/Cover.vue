<template>
  <div class="cover" :style="coverUrl">
      <i v-if="!coverUrl" class="fa fa-music"></i>
      <div class="links">
        <a href="">
        <i class="fab fa-github"></i>
        </a>
        <a href="">
        <i class="fab fa-itunes-note"></i>
        </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import { TrackType } from '@/store/types'

const tracks = namespace('Tracks')

@Component({})
export default class Cover extends Vue {
    @tracks.Getter
    private getCurrentTrack!: TrackType | null

    get coverUrl () {
      const track: TrackType | null = this.getCurrentTrack
      if (!track) return null

      return {
        backgroundImage: `url(${track.picture})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%'
      }
    }
}
</script>
<style lang="stylus">
@import '../styles/variables.styl'

.cover
    position: sticky;
    top 5rem
    left 0
    width 80%
    background-color white
    border-radius 10px
    display flex
    justify-content center
    align-items center
    text-align center
    box-shadow 0px 0px 15px rgba(0, 0, 0, 0.25);

    i
        font-size 3.5rem

    &:after
        content ""
        display block
        padding-bottom 100%

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
</style>
