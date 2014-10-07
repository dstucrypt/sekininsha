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

    for (var i = 0; i < members.value.length; i ++) {
      MembersList.push(<Member key={i} member={members.refine(i)} id={i}/>);
    };

    return (<table className={classes}>
               <thead><tr>
                    <th style={{width:"33%"}}>Имя</th>
                    <th style={{width:"33%"}}>Электронная почта</th>
                    <th style={{width:"33%"}}>Налоговый номер</th>
                </tr></thead>
    			<tbody>{MembersList}</tbody>
    		</table>);
  }
});
module.exports = MembersList;