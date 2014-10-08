/** @jsx React.DOM */
'use strict';
var _ = require("underscore");
var React = require('react/addons');
var Cursor = require('react-cursor/src/Cursor');
var MembersList = require('./components/MembersList');
var ajax = require('./ajax');
var validate = require('./validate');
/*
1. account
2. who am I
3. lohged in
5. add group
	desc
	- group name
    - parent group (optional)
    - group visibility
    - initial members list
*/

var App = React.createClass({
	getInitialState: function () {
    return {
      form_data: {
        "title": "",
        "description": "",
        "members" : [{}]
      },
      error: null,
      login_url: null,
      selected: null
     };
  },
  addMember: function(members) {
      var nu = members.pendingValue();
      nu.push({});
      members.onChange(nu);
  },
  removeMember: function(members) {
      var nu = members.pendingValue();
      if (this.state.selected !== null) {
        nu.splice(this.state.selected, 1);
      } else {
        nu.splice(nu.length - 1, 1);
      }
      // XXX: we don't have "selected" element
      // remove last element from list
      members.set(nu);
      this.setState({selected: null});

  },
  updateTextField: function(cursor, event) {
      cursor.onChange(event.target.value);
  },
  submit: function(data) {
      if(!this.validate(data)) {
          return;
      }
      ajax('/api/1/group/', this.submitCB, this.state.form_data);
  },
  submitError: function(req, resp) {
      if(resp && resp.login_url) {
          window.open(resp.login_url, '_blank');
          this.setState({login_url: resp.login_url});
      }

      if(resp && resp.message) {
          this.setState({error: resp.message});
      }
  },
  submitCB: function(req, resp) {
      if(resp.status !== 'ok') {
          return this.submitError(req, resp);
      }

      location.assign('/group/' + resp.group_id);
  },
  setSelectedMember: function(member) {
      console.log(member);
      this.setState({selected: member});
  },
  validate: function(form_data) {
      var idx;
      var members = form_data.refine('members').pendingValue();
      var form = form_data.pendingValue();

      if(members.length === 0) {
          this.setState({error: "Добавьте в группу людей"});
          return false;
      }

      if(form.title.length === 0) {
          this.setState({error: "Укажите название группы"});
          return false;
      }

      var ready = true;
      var errors;
      for(idx = 0; idx < members.length; idx++) {
          errors = validate.member(members[idx]);
          form_data.refine('members', idx, 'errors').set(errors);
          ready = ready && Object.keys(errors).length === 0;
      }
      if(!ready) {
          this.setState({error: "Исправьте проблемы в списке"});
          return false;;
      }

      return true;
  },
  render: function() {
      var cursor = Cursor.build(this);
      var data = cursor.refine("form_data");
      var title = data.refine("title");
      var desc = data.refine("description");
      var members = data.refine('members');
      var buttons = (
        <div className="row" style={{"padding-bottom":"9px"}}>
        <div className="col-md-12">
            <button type="button" style={{"margin-right":"5px"}} className="btn btn-primary" onClick={this.addMember.bind(null, members)}>Добавить</button>
            <button type="button" style={{"margin-right":"5px"}} className="btn btn-primary" onClick={this.removeMember.bind(null, members)}>Удалить</button>
            <button type="button" className="btn btn-primary" onClick={this.submit.bind(null, data)}>Создать группу</button>
        </div>
        </div>
      );
      var loginLink = this.state.login_url ? (
        <a href={this.state.login_url}>Login here</a>
      ) : undefined;
      var error = this.state.error ? (
        <div className="alert alert-danger" role="alert">{this.state.error} {loginLink}</div>
      ) : undefined;
      return (
      	<div className="container-fluid">
          {error}
          <div className="row">
            <div className="col-md-12">
              <h3>Название группы</h3>
              <input type="text" id="title" className="form-control" value={title.value} onChange={this.updateTextField.bind(this, title)}></input>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <h3>Описание группы</h3>
              <textarea rows="5" id="description" className="form-control"  value={desc.value} onChange={this.updateTextField.bind(this, desc)}></textarea>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <h3>Список членов группы</h3>
              {buttons}
              <div>{this.state.selected}</div>
              <MembersList onMemberSelect={this.setSelectedMember} members={members}></MembersList>
              {buttons}
            </div>
          </div>
      	</div>
    	);
  	}
});

module.exports = App;