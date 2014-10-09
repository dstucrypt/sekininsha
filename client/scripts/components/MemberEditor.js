/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var validate = require('../validate');
var _ = require("underscore");


var EditField = React.createClass({
  updateField: function(event) {
     this.props.data.set(event.target.value);
     this.props.validate(event.target.value);
  },
  render: function() {
    var err = this.props.error;
    var errState = err ? 'has-error' : '';
    var errSpan = err ? <span>{err}</span> : undefined;

    return (
    <td className={errState}>
        <input onFocus={this.props.onSelect} type="text" className="form-control" value={this.props.data.pendingValue()} onChange={this.updateField}></input>
        {errSpan}
    </td>);
  }
});


var MemberEditor = React.createClass({
  getInitialState: function() {
      return {error: false};
  },
  validate: function(field, value) {
    var member = this.props.member;
    var newErrors = validate.member(member.pendingValue());
    member.refine('errors').set(newErrors);
  },
  render: function() {
    var mm = this.props.member;
    var err = mm.refine('errors').value || {};

    return (
      <tr>
        <td>{this.props.mid + 1}</td>
        <EditField onSelect={this.props.onSelect} data={mm.refine('name')} error={err.name} validate={this.validate.bind(this, 'name')} />
        <EditField onSelect={this.props.onSelect} data={mm.refine('email')} error={err.email} validate={this.validate.bind(this, 'email')} />
        <EditField onSelect={this.props.onSelect} data={mm.refine('tax_id')} error={err.tax_id} validate={this.validate.bind(this, 'tax_id')} />
      </tr>
      )
  }
});
module.exports = MemberEditor;
