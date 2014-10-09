var webpack = require('webpack');

var port = JSON.parse(process.env.npm_package_config_port || 3000),
    subdomain = JSON.parse(process.env.npm_package_config_subdomain || null),
    url = subdomain ?
      'https://' + subdomain + '.localtunnel.me' :
      'http://localhost:' + port;

var plugins = [
    new webpack.NoErrorsPlugin()
  ];

module.exports = {
  entry: {
    "bundle":'./scripts/index'
  },
  output: {
    path: __dirname,
    filename: '[name].js',
    publicPath: '/scripts/'
  },
  plugins: plugins,
  resolve: {
    alias: {
      },
    root: "/",
    target: "web",
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.js$/, loaders: ['jsx'] },
      { test: /\.woff$/,   loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.ttf$/,    loader: "file-loader" },
      { test: /\.eot$/,    loader: "file-loader" },
      { test: /\.svg$/,    loader: "file-loader" }
    ],
    noParse: [ /\.min\.js/, /\.dev\.js/ ]
  }
};
