module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue-music-player/'
    : '/',
  devServer: {
    proxy: 'https://itunes.apple.com/'
  }
}
