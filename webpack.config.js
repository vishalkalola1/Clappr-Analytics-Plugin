const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

var NPM_RUN = process.env.npm_lifecycle_event

const webpackConfig = (config) => {
  return {
    devServer: {
      host: '0.0.0.0',
      port: 3000,
      historyApiFallback: true
    },
    mode: config.mode,
    devtool: 'source-maps',
    entry: path.resolve(__dirname, 'src/index.js'),
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [
            path.resolve(__dirname, 'src')
          ]
        },
      ],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      filename: config.filename,
      library: 'ClapprAnalyticsPlugin',
      libraryTarget: 'umd',
    },
    plugins: config.plugins,
  }
}

var configurations = []

if (NPM_RUN === 'build' || NPM_RUN === 'start') {
  configurations.push(webpackConfig({
    filename: 'Clappr-Analytics-Plugin.js',
    plugins: [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['dist']
      })
    ],
    mode: 'development'
  }))

  configurations.push(webpackConfig({
    filename: 'Clappr-Analytics-Plugin.external.js',
    plugins: [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['dist']
      })
    ],
    mode: 'development'
  }))
}

if (NPM_RUN === 'release') {
  configurations.push(webpackConfig({
    filename: 'Clappr-Analytics-Plugin.min.js',
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: true
        }),
      ]
    },
    mode: 'production'
  }))

  configurations.push(webpackConfig({
    filename: 'Clappr-Analytics-Plugin.external.min.js',
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: true
        }),
      ]
    },
    mode: 'production'
  }))
}

module.exports = configurations