/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var validate = require('../validate');


var EditField = React.createClass({
  updateField: function(event) {
      this.props.data.set(event.target.value);
  },
  render: function() {
    var err = this.props.error;
    var errState = err ? 'has-error' : '';
    var errSpan = err ? <span>{err}</span> : undefined;

    return (
    <td className={errState}>
        <input onFocus={this.props.onSelect} type="text" className="form-control" value={this.props.data.pendingValue()} onChange={this.updateField} onKeyUp={this.props.keyUp}></input>
        {errSpan}
    </td>);
  }
});


var MemberEditor = React.createClass({
  getInitialState: function() {
      return {error: false};
  },
  updateField: function(field, event) {
      this.props.member.refine(field).onChange(event.target.value);
  },
  keyUp: function(event) {
    if(event.key !== 'Enter') {
        return;
    }
    var member = this.props.member;
    var errors = validate.member(member.pendingValue());

    member.refine('errors').set(errors);
    if(Object.keys(errors).length === 0) {
        this.props.onBlur();
    }
  },
  render: function() {
    var mm = this.props.member;
    var err = mm.refine('errors').value || {};

    return (
      <tr>
        <td>{this.props.mid}</td>
        <EditField onSelect={this.props.onSelect} data={mm.refine('name')} error={err.name} keyUp={this.keyUp} />
        <EditField onSelect={this.props.onSelect} data={mm.refine('email')} error={err.email} keyUp={this.keyUp} />
        <EditField onSelect={this.props.onSelect} data={mm.refine('tax_id')} error={err.tax_id} keyUp={this.keyUp} />
      </tr>
      )
  }
});
module.exports = MemberEditor;