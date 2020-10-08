import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { TrackType, PicturePayloadType, TracksType, StatusType } from '../types'
import axios, { AxiosResponse } from 'axios'

@Module({ namespaced: true })
class Tracks extends VuexModule {
    public tracks: TracksType = {}
    public currentTrackId = 0
    public isFetching = false
    public status = StatusType.WAITING

    get trackList (): Array<TrackType> {
      return Object.values(this.tracks).sort((track: TrackType) => track.id)
    }

    get currentTrack (): TrackType | null {
      if (this.currentTrackId in this.tracks) return this.tracks[this.currentTrackId]
      return null
    }

    get nextTrackId (): number {
      if (!this.trackList.length) return 0

      const currentId = this.currentTrack ? this.currentTrack.id : 0
      const index = currentId !== 0 ? this.trackList.findIndex((track: TrackType) => track.id === currentId) : 0

      if (index === this.trackList.length - 1) return this.trackList[0].id

      return this.trackList[this.trackList.findIndex((track: TrackType) => track.id === currentId) + 1].id
    }

    get getTracksLength (): number {
      return Object.keys(this.tracks).length
    }

    get currentStatus (): StatusType {
      return this.status
    }

    @Mutation
    public setTracks (tracks: TracksType) {
      this.tracks = tracks
    }

    @Mutation
    public setStatus (status: StatusType) {
      this.status = status
    }

    @Mutation
    public setCurrentTrackId (trackId: number | null) {
      this.currentTrackId = trackId || 0
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
      const response = await axios.post('https://itunes.apple.com/search?term=kevin+kaarl&media=music')

      this.context.commit('setIsFetching', false)
      response.data.results.forEach((element: any) => {
        const picture = element.artworkUrl100.replace('100x100bb', '1200x1200bb')
        const minPicture = element.artworkUrl100.replace('100x100bb', '30x30bb')

        const track: TrackType = {
          id: element.trackId,
          artistName: element.artistName,
          trackName: element.trackName,
          url: element.previewUrl,
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

      const picture = await axios.get(this.tracks[trackId].picture, { responseType: 'blob' })
        .then((response: AxiosResponse) => response.data)
      return { picture: picture, trackId }
    }

    @Action({ commit: 'setMinPictureBlob' })
    public async fetchMinPictureBlob (trackId: number) {
      if (!(trackId in this.tracks)) return null

      const picture = await axios.get(this.tracks[trackId].minPicture, { responseType: 'blob' })
        .then((response: AxiosResponse) => response.data)
      return { picture: picture, trackId }
    }

    @Action({ commit: 'setStatus' })
    public changeStatus (status: StatusType) {
      return status
    }
}

export default Tracks
