import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { TrackType } from '../types'
import axios from 'axios'

@Module({ name: 'tracks', namespaced: true })
class Tracks extends VuexModule {
    public tracks: Array<TrackType> = []

    @Mutation
    public setTracks (tracks: Array<TrackType>) {
      this.tracks = tracks
    }

    @Action
    public getTracks () {
        axios.post('https://itunes.apple.com/search?term=jesse+baez&media=musicVideo')
    }
}

export default Tracks
