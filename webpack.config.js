var path = require('path')

module.exports = {
  entry: './src/app/index.js',
  output: {
    path: path.resolve('.', 'public', 'js'),
    filename: 'application.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?+babelrc,+cacheDirectory'
      }
    ]
  },
  mode: 'development'
}
