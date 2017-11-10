var path = require("path");
var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: [
    "babel-polyfill",

    "react-hot-loader/patch",
    // activate HMR for React

    "webpack-dev-server/client?http://localhost:3000",
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    "webpack/hot/only-dev-server",
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates

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
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

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
  ],

  devServer: {
    host: "localhost",
    port: 3000,

    historyApiFallback: true,
    // respond to 404s with index.html

    hot: true
    // enable HMR on the server
  },

  node: {
    fs: "empty"
  }
};
