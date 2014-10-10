/** @jsx React.DOM */
'use strict';

var React = require('react/addons'),
    Router = require('react-router');

var Link = Router.Link;

var ajax = require('./ajax');

var Dashboard = React.createClass({
    getInitialState: function() {
        return {
            groups: [],
        };
    },
    haveMembers: function(req, resp) {
        if(resp && resp.status !== 'ok') {
            console.log(resp);
            return;
        }

        this.setState({groups: resp.groups});
    },
    componentWillMount: function() {
        ajax('/api/1/group/', this.haveMembers);
    },

    render: function() {
        var can_admin;
        var groups = [], group;
        var idx, key;
        for(idx=0; idx<this.state.groups.length; idx++) {
            group = this.state.groups[idx];
            key = "li_group_" + group.group_id;
            if(group.can_admin) {
                can_admin = (<span>*</span>);
            }
            groups.push(<li key={key} ><Link to="group_ctx" params={{groupId: group.group_id}}>{group.name}</Link> {can_admin}</li>);
        }

        return (<div>
			        <ul>
                      <li><Link to="dashboard">Dash</Link></li>
			          <li><Link to="group_create">Создать группу</Link></li>
                      {groups}
			        </ul>
		     	 </div>);
    }
});

module.exports = Dashboard;
