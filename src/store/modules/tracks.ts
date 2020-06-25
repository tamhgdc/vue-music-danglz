import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { TrackType } from '../types'
import axios from 'axios'

@Module({ namespaced: true })
class Tracks extends VuexModule {
    public tracks: Array<TrackType> = []

    @Mutation
    public setTracks (tracks: Array<TrackType>) {
      this.tracks = tracks
    }

    @Action({ rawError: true, commit: 'setTracks' })
    public async getTracks () {
      const tracks: Array<TrackType> = []
      const response = await axios.post('https://itunes.apple.com/search?term=jesse+baez&media=music')

      response.data.results.forEach((element: any) => {
        const picture = element.artworkUrl100.replace('100x100bb', '1000x1000bb')
        const track: TrackType = {
          artistName: element.artistName,
          trackName: element.trackName,
          url: element.trackViewUrl,
          picture
        }

        tracks.push(track)
      })

      return tracks
    }
}

export default Tracks
