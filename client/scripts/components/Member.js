/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var Member = React.createClass({
  select: function(event) {
    this.props.selected.onChange(this.props.id);
  },
  render: function() {
    return (
    	<tr onClick={this.select}>
    		<td>{this.props.member.refine('name').value}</td>
    		<td>{this.props.member.refine('tax_id').value}</td>
    	</tr>);
  }
});
module.exports = Member; 