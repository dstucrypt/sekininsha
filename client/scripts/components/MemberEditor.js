/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var MemberEditor = React.createClass({
  updateName: function(event) {
      this.props.group.refine('name').onChange(event.target.value);
  },
  updateTaxID: function(event) {
      this.props.group.refine('tax_id').onChange(event.target.value);
  },
  render: function() {
    if (this.props.group === null) {return null;}
    else
    return (
      <div>
        <input type="text" value={this.props.group.refine('name').value} onChange={this.updateName}></input>
        <input type="text" value={this.props.group.refine('tax_id').value} onChange={this.updateTaxID}></input>
      </div>
      )
  }
});
module.exports = MemberEditor;