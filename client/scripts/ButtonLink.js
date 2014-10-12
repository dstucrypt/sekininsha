/** @jsx React.DOM */
'use strict';
var ActiveState = require('react-router').ActiveState;
var Navigation = require('react-router').Navigation;
var Button = require('react-bootstrap').Button;
var merge = require('react/lib/merge');

var React = require('react');

var ButtonLink = React.createClass({
  displayName: 'ButtonLink',
  mixins: [ActiveState, Navigation],
  propTypes: {
    to: React.PropTypes.string.isRequired,
    params: React.PropTypes.object,
    query: React.PropTypes.object,
    onClick: React.PropTypes.func
  },
  getDefaultProps: function () {
    return {
      activeClassName: 'active'
    };
  },
  handleClick: function (event) {
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
      className: this.getClassName(),
      onClick: this.handleClick
    });
    return Button(props, this.props.children);
  }
});

module.exports = ButtonLink;
