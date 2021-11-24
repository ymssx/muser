// eslint-disable-next-line no-undef
module.exports = {
  mode: 'development',
  entry: {
    index: './test/index.js',
    worker: './test/worker.js',
  },
  output: {
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: '/node_modules'
    }]
  },
  plugins: []
}
