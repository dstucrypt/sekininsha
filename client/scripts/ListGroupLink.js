/** @jsx React.DOM */
'use strict';
var ActiveState = require('react-router').ActiveState;
var Navigation = require('react-router').Navigation;
var ListGroupItem = require('react-bootstrap/ListGroupItem');
var merge = require('react/lib/merge');

var React = require('react');

var ListGroupLink = React.createClass({
  displayName: 'ListGroupLink',
  mixins: [ActiveState, Navigation],
  propTypes: {
    to: React.PropTypes.string.isRequired,
    params: React.PropTypes.object,
    query: React.PropTypes.object,
    href: React.PropTypes.string,
    onClick: React.PropTypes.func
  },
  getDefaultProps: function () {
    return {
      activeClassName: 'active'
    };
  },
  handleClick: function () {
    this.transitionTo(this.props.to, this.props.params, this.props.query);
  },
  getClassName: function () {
    var className = this.props.className || '';

    if (this.isActive(this.props.to, this.props.params, this.props.query))
      className += ' ' + this.props.activeClassName;

    return className;
  },
  getHref: function () {
    return this.makeHref(this.props.to, this.props.params, this.props.query);
  },
  render: function() {
  	var isActive = this.isActive(this.props.to, this.props.params, this.props.query);
  	var props = merge(this.props, {
    	href: this.getHref(),
      className: this.getClassName(),
      onClick: this.handleClick
    });
    return ListGroupItem(props, this.props.children);
  }
});

module.exports = ListGroupLink;
