const webpack = require('webpack')

const paths = require('./paths')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: paths.outputPath,
    chunkFilename: '[name].js',
    pathinfo: false
  },
  watchOptions: {
    ignored: /node_modules/
  },
  performance: {
    hints: 'warning',
    maxAssetSize: 20000000,
    maxEntrypointSize: 8500000,
    assetFilter: assetFilename => {
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js')
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  devServer: {
    contentBase: paths.outputPath,
    compress: true,
    hot: true,
    historyApiFallback: true,
    port: process.env.PORT || 8082,
    disableHostCheck: true
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
}
