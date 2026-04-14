module.exports = {
  publicPath: './',
  configureWebpack: {
    output: {
      // 确保异步 chunk 也使用相对路径
      publicPath: './'
    }
  },
  chainWebpack: config => {
    // 强制所有资源使用相对路径
    config.output.publicPath('./');
  }
}