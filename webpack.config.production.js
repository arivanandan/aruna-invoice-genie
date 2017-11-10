var path = require("path");
var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: [
    "babel-polyfill",
    "./src/ui/index.jsx"
    // the entry point of our app
  ],

  output: {
    filename: "bundle.js",
    // the output bundle

    path: path.resolve(__dirname, "dist"),

    publicPath: "/"
    // necessary for HMR to know where to load the hot update chunks
  },

  devtool: "source-map",

  resolve: {
    extensions: [".js", ".jsx"]
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ["babel-loader"],
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates

    new webpack.NoEmitOnErrorsPlugin(),
    // do not emit compiled assets that include errors

    new CopyWebpackPlugin([{ from: "src/site", to: "." }], {
      // By default, we only copy modified files during
      // a watch or webpack-dev-server build. Setting this
      // to `true` copies all files.
      copyUnmodified: true
    })
  ]
};
