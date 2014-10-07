/** @jsx React.DOM */
'use strict';
var React = require('react/addons');


var EditField = React.createClass({
  updateField: function(event) {
      this.props.data.onChange(event.target.value);
  },
  render: function() {
    var err = this.props.error;
    var errState = err ? 'has-error' : '';
    var errSpan = err ? <span>{err}</span> : undefined;

    return (
    <td className={errState}>
        <input type="text" className="form-control" value={this.props.data.value} onChange={this.updateField} onKeyUp={this.props.keyUp}></input>
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

    if(this.validate() === true) {
        this.props.onBlur();
    }
  },
  validate: function() {
    var mm = this.props.member.value;
    var name = mm.name || "";
    var email = mm.email || "";
    var tax_id = mm.tax_id || "";
    var err = {};

    if(tax_id.length === 0 || tax_id.length === 10) {
        true;
    } else {
        err.tax_id = 'Налоговый номер неправильной длины';
    }

    if(email.length === 0 || email.indexOf('@') > 0) {
        true;
    } else {
        err.email = 'Неправильный формат адреса';
    }

    if(email.length === 0 && tax_id.length === 0) {
        err.email = 'Укажите что-нибудь';
        err.tax_id = err.email;
    }

    if(name.length === 0) {
        err.name = 'Введите имя';
    }

    if(Object.keys(err).length === 0) {
        this.error(false);
        return true;
    }

    this.error(err);

    return false;
  },
  error: function(val) {
    this.setState({error: val});
  },
  render: function() {
    var err = this.state.error || {};
    var mm = this.props.member;

    return (
      <tr>
        <EditField data={mm.refine('name')} error={err.name} keyUp={this.keyUp} />
        <EditField data={mm.refine('email')} error={err.email} keyUp={this.keyUp} />
        <EditField data={mm.refine('tax_id')} error={err.tax_id} keyUp={this.keyUp} />
      </tr>
      )
  }
});
module.exports = MemberEditor;