/** @jsx React.DOM */
'use strict';
require("bootstrap/dist/css/bootstrap.min.css");

var React = require('react/addons'),
    GroupCreate = require('./GroupCreate'),
    GroupEdit = require('./GroupEdit'),
    Dashboard = require('./Dashboard');


var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;

var App = React.createClass({
	render: function() {
		return <div>
            <this.props.activeRouteHandler />
        </div>
    }
})

var routes = (
  <Routes location="history">
    <Route handler={App}>
      <Route name="dashboard" path="/" handler={Dashboard} />
      <Route name="group_create" path="/group/create" handler={GroupCreate}/>
      <Route name="group_edit" path="/group/:groupId/" handler={GroupEdit}/>
    </Route>
  </Routes>
);
    
if ('production' !== process.env.NODE_ENV) {
  // Enable React devtools
  window['React'] = React;
}

React.renderComponent(routes, document.body);
