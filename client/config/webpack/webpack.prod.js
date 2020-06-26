const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const paths = require('./paths')

module.exports = {
  mode: 'production',
  output: {
    filename: `${paths.jsFolder}/[name].[hash].js`,
    path: paths.outputPath,
    chunkFilename: '[name].[chunkhash].js'
  },
  plugins: [
    new CleanWebpackPlugin(
      { cleanOnceBeforeBuildPatterns: [paths.outputPath.split('/').pop()] },
      {
        root: paths.root
      }
    ),
    new BundleAnalyzerPlugin()
  ],
  devtool: 'source-map'
}
