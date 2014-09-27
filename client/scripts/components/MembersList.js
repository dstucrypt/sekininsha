/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var Member = require('./Member');
var MembersList = React.createClass({
  render: function() {
  	var cx = React.addons.classSet;
  	var classes = cx({
    	'table': true,
    	'table-striped': true,
    	'table-bordered': true,
    	'table-hover': true
  	});

    var MembersList = [];

    var members = this.props.members;
    var selected = this.props.selected;

    for (var i = 0; i < members.value.length; i ++) {
      MembersList.push(<Member key={i} selected={selected} member={members.refine(i)} id={i}/>);
    };

    return (<table className={classes}>
    			<thead><tr><th style={{width:"50%"}}>Имя</th><th style={{width:"50%"}}>ИН</th></tr></thead>
    			<tbody>{MembersList}</tbody>
    		</table>);
  }
});
module.exports = MembersList;