/** @jsx React.DOM */
'use strict';

var React = require('react/addons'),
    Router = require('react-router'),
    ListGroup = require('react-bootstrap').ListGroup,
    ListGroupLink = require('./ListGroupLink'),
    Row = require('react-bootstrap/Row');

var ButtonLink = require('./ButtonLink');

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
            groups.push(<ListGroupLink key={key} to="group_ctx" params={{groupId: group.group_id}}>{group.name} <span>{can_admin}</span></ListGroupLink>);
        }

        return (
            <Row>
                <ListGroup>{groups}</ListGroup>
                <ButtonLink to="group_create">Создать группу</ButtonLink>
            </Row>
                );
    }
});

module.exports = Dashboard;
