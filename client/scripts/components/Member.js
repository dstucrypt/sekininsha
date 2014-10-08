/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var MemberEditor = require('./MemberEditor');

var Member = React.createClass({
  getInitialState: function() {
    return {editing: this.isEmpty()};
  },
  beginEdit: function(event) {
    this.setState({editing: true});
  },
  endEdit: function(event) {
    this.setState({editing: false});
  },
  isEmpty: function() {
    var mm = this.props.member.pendingValue();
    return !(mm.name || mm.email || mm.tax_id);
  },
  onSelect: function() {
    this.props.onSelect(this.props.mid);
  },
  render: function() {
    if(this.state.editing === true) {
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