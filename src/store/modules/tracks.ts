import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { TrackType } from '../types'
import axios from 'axios'

@Module({ namespaced: true })
class Tracks extends VuexModule {
    public tracks: Array<TrackType> = []
    public currentTrack: TrackType | null = null
    public isFetching = false

    get getTracks (): Array<TrackType> {
      return this.tracks
    }

    get getCurrentTrack (): TrackType | null {
      return this.currentTrack
    }

    get getTracksLength (): number {
      return this.tracks.length
    }

    @Mutation
    public setTracks (tracks: Array<TrackType>) {
      this.tracks = tracks
    }

    @Mutation
    public setCurrentTrack (track: TrackType | null) {
      this.currentTrack = track
    }

    @Mutation
    public setIsFetching (isFetching: boolean) {
      this.isFetching = isFetching
    }

    @Action({ commit: 'setTracks' })
    public async fetchTracks () {
      this.context.commit('setIsFetching', true)

      const tracks: Array<TrackType> = []
      const response = await axios.post('https://itunes.apple.com/search?term=jesse+baez&media=music')

      this.context.commit('setIsFetching', false)
      response.data.results.forEach((element: any) => {
        const picture = element.artworkUrl100.replace('100x100bb', '1000x1000bb')
        const track: TrackType = {
          id: element.trackId,
          artistName: element.artistName,
          trackName: element.trackName,
          url: element.trackViewUrl,
          album: element.collectionName,
          time: element.trackTimeMillis,
          artist: element.artistName,
          picture
        }

        tracks.push(track)
      })

      return tracks
    }

    @Action({ commit: 'setCurrentTrack' })
    public selectTrack (trackId: number | string | undefined) {
      const index: number = this.tracks.findIndex((track: TrackType) => track.id === trackId)
      return index !== -1 ? this.tracks[index] : null
    }
}

export default Tracks
