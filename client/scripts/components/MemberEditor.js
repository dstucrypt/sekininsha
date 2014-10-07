/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
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
    } else {
        this.error(true);
    }
  },
  validate: function() {
    var mm = this.props.member.value;
    var name = mm.name || "";
    var email = mm.email || "";
    var tax_id = mm.tax_id || "";
    var err = [];

    if(tax_id.length === 0 || tax_id.length === 10) {
        true;
    } else {
        err.push("Tax id length");
    }

    if(email.length === 0 || email.indexOf('@') > 0) {
        true;
    } else {
        err.push("Email format invalid");
    }

    if( (email.length === 0 && tax_id.length === 0) || name.length == 0) {
        err.push("Empty form");
    }

    if(err.length === 0) {
        this.error(false);
        return true;
    }

    return err;
  },
  error: function(val) {
    this.setState({error: val});
  },
  render: function() {
    var fieldState = this.state.error ? 'has-error' : '';
    return (
      <tr>
        <td className={fieldState}>
            <input type="text" className="form-control" value={this.props.member.refine('name').value} onChange={this.updateField.bind(this, 'name')} onKeyUp={this.keyUp}></input>
        </td>
        <td className={fieldState}>
            <input type="text" className="form-control" value={this.props.member.refine('email').value} onChange={this.updateField.bind(null, 'email')} onKeyUp={this.keyUp}></input>
        </td>
        <td className={fieldState}>
            <input type="text" className="form-control" value={this.props.member.refine('tax_id').value} onChange={this.updateField.bind(null, 'tax_id')} onKeyUp={this.keyUp}></input>
        </td>
      </tr>
      )
  }
});
module.exports = MemberEditor;