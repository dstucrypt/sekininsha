/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var MemberEditor = React.createClass({
  updateField: function(field, event) {
      this.props.member.refine(field).onChange(event.target.value);
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
            <input type="text" className="form-control" value={this.props.member.refine('name').value} onChange={this.updateField.bind(null, 'name')} onKeyUp={this.keyUp}></input>
        </td>
        <td>
            <input type="text" className="form-control" value={this.props.member.refine('email').value} onChange={this.updateField.bind(null, 'email')} onKeyUp={this.keyUp}></input>
        </td>
        <td>
            <input type="text" className="form-control" value={this.props.member.refine('tax_id').value} onChange={this.updateField.bind(null, 'tax_id')} onKeyUp={this.keyUp}></input>
        </td>
      </tr>
      )
  }
});
module.exports = MemberEditor;