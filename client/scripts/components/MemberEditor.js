/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var validate = require('../validate');
var Input = require('react-bootstrap').Input;

var ajax = require('../ajax');


var EditField = React.createClass({
  updateField: function(event) {
     this.props.data.set(event.target.value);
     this.props.validate(event.target.value);
  },
  render: function() {
    var err = this.props.error;
    var title = this.props.title;
    var errState = '';
    var ok = undefined;

    if(this.props.resolved) {
        errState = 'success';
        ok = (<span className="glyphicon form-control-feedback glyphicon-ok" />);
    }
    if(err) {
        errState = 'error';
    }
    var errSpan = err ? <span>{err}</span> : undefined;

    return (<td>
        <Input bsStyle={errState} type="text" value={this.props.data.pendingValue()} onChange={this.updateField} onFocus={this.props.onSelect} label={err || title} hasFeedback />
    </td>);
  }
});


var MemberEditor = React.createClass({
  getInitialState: function() {
      return {error: false, verified: {}};
  },
  validate: function(field, value) {
    var member = this.props.member;
    var newErrors = validate.member(member.pendingValue());
    member.refine('errors').set(newErrors);
    if(newErrors[field] === undefined) {
        this.netValidate(field, value);
    }
  },
  netValidate: function(field, value) {
    ajax('/api/1/user/' + field + ":" + value, this.memberResolved.bind(null, field));
  },
  memberResolved: function(field, req, resp) {
    var ob = {};
    var mm = this.props.member;
    this.setState({verified: ob});

    if(req.status !== 200) {
        ob[field] = false;
    } else {
        ob[field] = true;
        mm.refine('name').set(resp.user.name);
    }
  },
  render: function() {
    var mm = this.props.member;
    var err = mm.refine('errors').value || {};
    var r = this.state.verified;

    return (
      <tr>
        <td>{this.props.mid + 1}</td>
        <EditField onSelect={this.props.onSelect} data={mm.refine('name')} error={err.name} validate={this.validate.bind(this, 'name')} title="Имя" />
        <EditField onSelect={this.props.onSelect} data={mm.refine('email')} error={err.email} validate={this.validate.bind(this, 'email')} resolved={r.email} title="E-mail" />
        <EditField onSelect={this.props.onSelect} data={mm.refine('tax_id')} error={err.tax_id} validate={this.validate.bind(this, 'tax_id')} resolved={r.tax_id} title="Налоговый номер" />
      </tr>
      )
  }
});
module.exports = MemberEditor;
