/** @jsx React.DOM */
'use strict';
require("bootstrap/dist/css/bootstrap.min.css");

var React = require('react/addons'),
    GroupCreate = require('./GroupCreate'),
    GroupEdit = require('./GroupEdit'),
    GroupCtx = require('./GroupCtx'),
    Vote = require('./Vote'),
    VoteCreate = require('./VoteCreate'),
    Dashboard = require('./Dashboard'),
    Navbar = require('react-bootstrap/Navbar'),
    Nav = require('react-bootstrap/Nav'),
    NavItem = require('react-bootstrap/NavItem'),
    NavItemLink = require('./NavItemLink'),
    Grid = require('react-bootstrap/Grid'),
    Row = require('react-bootstrap/Row'),
    PageHeader = require('react-bootstrap/PageHeader');


var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;

var App = React.createClass({
	render: function() {

        var user = window.current_user;
        return  (
      <div style={{"margin-top":20}}>
      <Grid>
        <Row>
        <Navbar>
          <Nav>
            <NavItemLink to="dashboard" key={1}>Дэшборд</NavItemLink>
            <NavItemLink to="group_create" key={2}>Создать группу</NavItemLink>
          </Nav>
          <Nav pullRight={true} >
            <NavItem key="current_user">{user.name}</NavItem>
          </Nav>
        </Navbar>
        </Row>
        <this.props.activeRouteHandler />
      </Grid>
      </div>
      );
    }
})

var routes = (
  <Routes location="history">
    <Route handler={App}>
      <Route name="dashboard" path="/" handler={Dashboard} />
      <Route name="group_create" path="/group/create" handler={GroupCreate}/>
      <Route name="group_ctx" path="/group/:groupId/" handler={GroupCtx}/>
      <Route name="group_edit" path="/group/:groupId/members" handler={GroupEdit}/>
      <Route name="vote_create" path="/group/:groupId/vote/create" handler={VoteCreate}/>
      <Route name="vote" path="/vote/:voteId/" handler={Vote} />
    </Route>
  </Routes>
);
    
if ('production' !== process.env.NODE_ENV) {
  // Enable React devtools
  window['React'] = React;
}

React.renderComponent(routes, document.body);
