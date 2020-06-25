<template>
  <div class="container">
    <Player/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Player from './components/Player.vue'
import { namespace } from 'vuex-class'

const tracks = namespace('Tracks')

@Component({
  components: {
    Player
  }
})
export default class App extends Vue {
  beforeMount () {
    this.getTracks()
  }

  @tracks.Action
  public getTracks!: () => void
}
</script>

<style lang="stylus">

@import './styles/variables.styl';

body
  margin 0
  padding 0

  .container
    width 100%
    height 100vh
    background linear-gradient(linear-gradient)

</style>
