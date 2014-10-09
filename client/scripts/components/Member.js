/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var MemberEditor = require('./MemberEditor');

var Member = React.createClass({
  beginEdit: function(event) {
    this.props.member.refine('editing').set(true);
  },
  endEdit: function(event) {
    this.props.member.refine('editing').set(false);
  },
  onSelect: function() {
    if(this.props.onSelect === undefined) return;
    this.props.onSelect(this.props.mid);
  },
  render: function() {
    if(this.props.member.refine('editing').value === true) {
        return <MemberEditor mid={this.props.mid} onSelect={this.onSelect} member={this.props.member} onBlur={this.endEdit} />
    }
    return (
    	<tr onClick={this.beginEdit}>
            <td>{this.props.mid + 1}</td>
            <td>{this.props.member.refine('name').value}</td>
            <td>{this.props.member.refine('email').value}</td>
            <td>{this.props.member.refine('tax_id').value}</td>
    	</tr>);
  }
});
module.exports = Member; 