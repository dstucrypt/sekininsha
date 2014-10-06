var webpack = require('webpack');

var port = JSON.parse(process.env.npm_package_config_port || 3000),
    subdomain = JSON.parse(process.env.npm_package_config_subdomain || null),
    url = subdomain ?
      'https://' + subdomain + '.localtunnel.me' :
      'http://localhost:' + port;

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?' + url,
    'webpack/hot/only-dev-server',
    './scripts/index'
  ],
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: '/scripts/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.js$/, loaders: ['react-hot', 'jsx?harmony'] },
      { test: /\.woff$/,   loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.ttf$/,    loader: "file-loader" },
      { test: /\.eot$/,    loader: "file-loader" },
      { test: /\.svg$/,    loader: "file-loader" }
    ],
    noParse: /\.min\.js/
  }
};
