// eslint-disable-next-line no-undef
module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.ts',
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
