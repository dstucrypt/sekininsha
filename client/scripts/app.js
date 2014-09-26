/** @jsx React.DOM */
'use strict';

var _ = require("underscore/underscore");
var React = require('react/addons');
var Cursor = require('react-cursor/src/react-cursor').Cursor;

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

var Group = React.createClass({
  select: function(event) {
    this.props.selected.onChange(this.props.id);
  },
  render: function() {
    return (<li key={this.props.id} onClick={this.select}>{this.props.group.refine('name').value}</li>);
  }
});

var GroupsList = React.createClass({
  render: function() {
    var groupsList = [];

    var groups = this.props.cursor.refine("groups");
    var selected = this.props.cursor.refine("selected");

    for (var i = 0; i < groups.value.length; i ++) {
      groupsList.push(<Group selected={selected} group={groups.refine(i)} id={i}/>);
    };

    return (<ul>{groupsList}</ul>);
  }
});

var GroupEditor = React.createClass({
  updateName: function(event) {
      this.props.group.refine('name').onChange(event.target.value);
  },
  render: function() {
    if (this.props.group === null) {return null;}
    else
    return (
      <div>
        <input type="text" value={this.props.group.refine('name').value} onChange={this.updateName}></input>
      </div>
      )
  }
});

var App = React.createClass({
	getInitialState: function () {
    return {
      groups: [{name: "group 1"}, {name:"group 2"}],
      selected: null
  	}
  },
  addGroup: function(groups) {
      var nu = groups.value;
      nu.push({name:"Grrr"});
      groups.onChange(nu);
  },
  removeGroup: function(groups, selected) {
      var nu = groups.value;
      var s = selected.value;
      selected.onChange(null);
      nu.splice(selected.value, 1);
      groups.onChange(nu);
  },
  render: function() {
  		var cursor = Cursor.build(this);
      var groups = cursor.refine('groups');
      var selected = cursor.refine('selected');
      var editor = (selected.value !== null) ? <GroupEditor group={groups.refine(selected.value)}/> : null;
    	var log = function() {
        console.log(cursor.value);
      }
      return (
      	<div className="App">
          
          <button onClick={this.addGroup.bind(null, groups)}>Add Group</button>
          <button onClick={this.removeGroup.bind(null, groups, selected)} disabled={selected.value === null}>Remove Group</button>

          <GroupsList cursor={cursor}></GroupsList>
          {editor}
          <button onClick={log}></button>
      	</div>
    	);
  	}
});

module.exports = App;