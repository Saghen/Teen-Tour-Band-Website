const path = require('path')

const { EnvironmentPlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const paths = require('./paths')
const rules = require('./rules')

module.exports = {
  entry: paths.entryPath,
  output: {
    publicPath: '/'
  },
  module: {
    rules
  },
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['*', '.js', '.jsx', '.json', '.ts', '.tsx', '.scss', '.css'],
    symlinks: false,
    cacheWithContext: false,
    alias: {
      Components: path.resolve('src/components/'),
      Views: path.resolve('src/views/'),
      Styles: path.resolve('src/styles/'),
      Config: path.resolve('src/config.ts'),
      Constants: path.resolve('src/constants.ts'),
      Helpers: path.resolve('src/helpers/'),
      Images: path.resolve('src/images/'),
      Libs: path.resolve('src/libs/'),
      Store: path.resolve('src/store/'),
      Icons: path.resolve('src/icons/'),
      Services: path.resolve('src/services/'),
      Request: path.resolve('src/request.ts'),
      Root: path.resolve('src/'),
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: paths.templatePath,
      minify: {
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        preserveLineBreaks: true,
        minifyURLs: true,
        removeComments: true,
        removeAttributeQuotes: true
      }
    }),
    new CopyPlugin([{ from: paths.publicPath, to: paths.outputPath }]),
    new EnvironmentPlugin({ NODE_ENV: 'development' })
  ]
}
