/** @jsx React.DOM */
'use strict';
var _ = require("underscore");
var React = require('react/addons');
var Cursor = require('react-cursor/src/Cursor');
var MembersList = require('./components/MembersList');
var ajax = require('./ajax');
var validate = require('./validate');
var Grid = require('react-bootstrap/Grid');
var Row = require('react-bootstrap/Row');
var Col = require('react-bootstrap/Col');
var Button = require('react-bootstrap/Button');

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
  makeMemberData: function() {
    return {
        key: "member" + Number(new Date()).toString(),
        editing: true,
    };
  },
	getInitialState: function () {
    return {
      form_data: {
        "title": "",
        "description": "",
        "members" : [this.makeMemberData()]
      },
      error: null,
      login_url: null,
      selected: null
     };
  },
  addMember: function(members) {
      var nu = members.pendingValue();
      nu.push(this.makeMemberData());
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
          errors = validate.member(members[idx], true);
          form_data.refine('members', idx, 'errors').set(errors);
          ready = ready && Object.keys(errors).length === 0;
      }
      if(!ready) {
          this.setState({error: "Исправьте проблемы в списке"});
          return false;
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
        <Row style={{"padding-bottom":"9px"}}>
          <Col md={12}>
              <Button bsStyle="primary" style={{"margin-right":"5px"}} onClick={this.addMember.bind(null, members)}>Добавить</Button>
              <Button bsStyle="primary" style={{"margin-right":"5px"}} onClick={this.removeMember.bind(null, members)}>Удалить</Button>
              <Button bsStyle="primary" onClick={this.submit.bind(null, data)}>Создать группу</Button>
          </Col>
        </Row>
      );
      var loginLink = this.state.login_url ? (
        <a href={this.state.login_url}>Login here</a>
      ) : undefined;
      var error = this.state.error ? (
        <div className="alert alert-danger" role="alert">{this.state.error} {loginLink}</div>
      ) : undefined;
      return (
      	<Row>
          {error}
          <Row>
            <Col md={12}>
              <h3>Название группы</h3>
              <input type="text" id="title" className="form-control" value={title.value} onChange={this.updateTextField.bind(this, title)}></input>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <h3>Описание группы</h3>
              <textarea rows="5" id="description" className="form-control"  value={desc.value} onChange={this.updateTextField.bind(this, desc)}></textarea>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <h3>Список членов группы</h3>
              {buttons}
              <MembersList onMemberSelect={this.setSelectedMember} members={members}></MembersList>
            </Col>
          </Row>
          {buttons}
      	</Row>
    	);
  	}
});

module.exports = App;