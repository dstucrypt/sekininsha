/** @jsx React.DOM */
'use strict';
require("bootstrap/dist/css/bootstrap.css");

var React = require('react/addons'),
    App = require('./App');
    
if ('production' !== process.env.NODE_ENV) {
  // Enable React devtools
  window['React'] = React;
}

React.renderComponent(<App />, document.body);