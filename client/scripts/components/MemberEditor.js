/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var MemberEditor = React.createClass({
  updateName: function(event) {
      this.props.member.refine('name').onChange(event.target.value);
  },
  updateTaxID: function(event) {
      this.props.member.refine('tax_id').onChange(event.target.value);
  },
  keyUp: function(event) {
    if(event.key === 'Enter') {
        this.props.onBlur();
    }
  },
  render: function() {
    return (
      <tr>
        <td>
            <input type="text" className="form-control" value={this.props.member.refine('name').value} onChange={this.updateName} onKeyUp={this.keyUp}></input>
        </td>
        <td>
            <input type="text" className="form-control" value={this.props.member.refine('tax_id').value} onChange={this.updateTaxID} onKeyUp={this.keyUp}></input>
        </td>
      </tr>
      )
  }
});
module.exports = MemberEditor;