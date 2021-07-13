module.exports = {
  mode: "development",
  entry: "./test/index.js",
  output: {
    filename: "index.js",
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: '/node_modules',
    }]
  },
  plugins: []
}