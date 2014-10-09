/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var Member = require('./Member');
var Table = require('react-bootstrap/Table');
var MembersList = React.createClass({
  render: function() {
    var MembersList = [];

    var members = this.props.members;
    var ml = members.pendingValue().length;

    for (var i = 0; i < ml; i ++) {
      var member = members.refine(i);
      var k = member.value.key;
      MembersList.push(<Member onSelect={this.props.onMemberSelect} member={members.refine(i)} mid={i} key={k}/>);
    };

    return (<Table striped bordered hover>
               <thead><tr>
                    <th>#</th>
                    <th style={{width:"33%"}}>Имя</th>
                    <th style={{width:"33%"}}>Электронная почта</th>
                    <th style={{width:"33%"}}>Налоговый номер</th>
                </tr></thead>
    			<tbody>{MembersList}</tbody>
    		</Table>);
  }
});
module.exports = MembersList;