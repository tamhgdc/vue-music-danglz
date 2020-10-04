import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { TrackType, PicturePayloadType, TracksType } from '../types'
import axios from 'axios'

@Module({ namespaced: true })
class Tracks extends VuexModule {
    public tracks: TracksType = {}
    public currentTrackId = 0
    public isFetching = false

    get trackList (): Array<TrackType> {
      return Object.values(this.tracks).sort((track: TrackType) => track.id)
    }

    get currentTrack (): TrackType | null {
      if (this.currentTrackId in this.tracks) return this.tracks[this.currentTrackId]
      return null
    }

    get getTracksLength (): number {
      return Object.keys(this.tracks).length
    }

    @Mutation
    public setTracks (tracks: TracksType) {
      this.tracks = tracks
    }

    @Mutation
    public setCurrentTrackId (trackId: number | null) {
      if (trackId == null) return
      this.currentTrackId = trackId
    }

    @Mutation
    public setPictureBlob (payload: PicturePayloadType) {
      // this.tracks[payload.trackId].pictureBlob = payload.picture
      const track = this.tracks[payload.trackId]
      track.pictureBlob = payload.picture
      this.tracks[payload.trackId] = { ...track }
    }

    @Mutation
    public setMinPictureBlob (payload: PicturePayloadType) {
      // this.tracks[payload.trackId].minPictureBlob = payload.picture
      const track = this.tracks[payload.trackId]
      track.minPictureBlob = payload.picture
      this.tracks[payload.trackId] = { ...track }
    }

    @Mutation
    public setIsFetching (isFetching: boolean) {
      this.isFetching = isFetching
    }

    @Action({ commit: 'setTracks' })
    public async fetchTracks () {
      this.context.commit('setIsFetching', true)

      const tracks: TracksType = {}
      const response = await axios.post('https://itunes.apple.com/search?term=jesse+baez&media=music')

      this.context.commit('setIsFetching', false)
      response.data.results.forEach((element: any) => {
        const picture = element.artworkUrl100.replace('100x100bb', '1200x1200bb')
        const minPicture = element.artworkUrl100.replace('100x100bb', '30x30bb')

        const track: TrackType = {
          id: element.trackId,
          artistName: element.artistName,
          trackName: element.trackName,
          url: element.trackViewUrl,
          album: element.collectionName,
          time: element.trackTimeMillis,
          artist: element.artistName,
          picture,
          minPicture
        }

        tracks[track.id] = track
      })

      return tracks
    }

    @Action({ commit: 'setCurrentTrackId' })
    public selectTrack (trackId: number) {
      if (trackId in this.tracks) return trackId
      return null
    }

    @Action({ commit: 'setPictureBlob' })
    public async fetchPictureBlob (trackId: number) {
      if (!(trackId in this.tracks)) return null
      const picture = await fetch(this.tracks[trackId].picture).then((response: any) => response.blob())
      return { picture, trackId }
    }

    @Action({ commit: 'setMinPictureBlob' })
    public async fetchMinPictureBlob (trackId: number) {
      if (!(trackId in this.tracks)) return null
      const picture = await fetch(this.tracks[trackId].minPicture).then((response: any) => response.blob())
      return { picture, trackId }
    }
}

export default Tracks
