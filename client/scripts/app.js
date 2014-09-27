/** @jsx React.DOM */
'use strict';
var _ = require("underscore/underscore");
var React = require('react/addons');
var Cursor = require('react-cursor/src/react-cursor').Cursor;
var MembersList = require('./components/MembersList');
var MemberEditor = require('./components/MemberEditor');
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
        "title": "ttt",
        "description": "desc",
        "members" : [{
          "name" : "Vasya",
          "tax_id" : "123",
          "email" : "" 
       }]
     },
       selected_member : null
     }
  },
  addMember: function(members) {
      var nu = members.value;
      nu.push({"name":"Grrr", "tax_id":"666"});
      members.onChange(nu);
  },
  removeMember: function(members, selected) {
      var nu = members.value;
      var s = selected.value;
      selected.onChange(null);
      nu.splice(selected.value, 1);
      members.onChange(nu);
  },
  updateTextField: function(cursor, event) {
      cursor.onChange(event.target.value);
  },
  render: function() {
  		var cursor = Cursor.build(this);
      var data = cursor.refine("form_data");
      var title = data.refine("title");
      var desc = data.refine("description");
      var members = data.refine('members');
      var selected = cursor.refine('selected_member');
      var editor = (selected.value !== null) ? <MemberEditor group={members.refine(selected.value)}/> : null;
    	var log = function() {
        console.log(cursor.refine("form_data").value);
      }
      return (
      	<div className="container-fluid">
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
              <div className="row" style={{"padding-bottom":"9px"}}>
                <div className="col-md-12">
                    <button type="button" style={{"margin-right":"5px"}} className="btn btn-primary" onClick={this.addMember.bind(null, members)}>Добавить</button>
                    <button type="button" className="btn btn-primary" onClick={this.removeMember.bind(null, members, selected)} disabled={selected.value === null}>Удалить</button>
                </div>
              </div>
              <MembersList members={members} selected={selected}></MembersList>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
            {editor}
            </div>
          </div>
      	</div>
    	);
  	}
});

module.exports = App;