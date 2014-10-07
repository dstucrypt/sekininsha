/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var MemberEditor = require('./MemberEditor');

var Member = React.createClass({
  getInitialState: function() {
    return {selected: false};
  },
  select: function(event) {
    this.setState({selected: true});
  },
  keyPress: function(event) {
    console.log(event);
  },
  unselect: function(event) {
    this.setState({selected: false});
  },
  render: function() {
    if(this.state.selected === true) {
        return <MemberEditor member={this.props.member} onBlur={this.unselect} />
    }
    return (
    	<tr onClick={this.select}>
            <td>{this.props.member.refine('name').value}</td>
            <td>{this.props.member.refine('email').value}</td>
            <td>{this.props.member.refine('tax_id').value}</td>
    	</tr>);
  }
});
module.exports = Member; 