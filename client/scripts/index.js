/** @jsx React.DOM */
'use strict';
require("bootstrap/dist/css/bootstrap.min.css");

var React = require('react/addons'),
    GroupCreate = require('./GroupCreate'),
    GroupEdit = require('./GroupEdit');


var Router = require('react-router');
var Locations = Router.Locations;
var Location = Router.Location;
var Route = Router.Route;
var Routes = Router.Routes;
var Link = Router.Link;

var App = React.createClass({
	render: function() {
		return (<div>
			        <ul>
			          <li><Link to="group_create">Создать группу</Link></li>
			          <li><Link to="group_edit" params={{groupId: "6"}}>Редактировать группу #6</Link></li>
			        </ul>
			        <this.props.activeRouteHandler />
		     	 </div>)
	}
})

var routes = (
  <Routes location="history">
    <Route handler={App}>
      <Route name="group_create" path="/group/create" handler={GroupCreate}/>
      <Route name="group_edit" path="/group/:groupId" handler={GroupEdit}/>
    </Route>
  </Routes>
);
    
if ('production' !== process.env.NODE_ENV) {
  // Enable React devtools
  window['React'] = React;
}

React.renderComponent(routes, document.body);