/** @jsx React.DOM */
'use strict';
var _ = require("underscore");
var React = require('react/addons');
var Cursor = require('react-cursor/src/Cursor');
var ajax = require('./ajax');

var MembersList = require('./components/MembersList');

var GroupEdit = React.createClass({
    getInitialState: function() {
        return {
            members: []
        };
    },
    haveMembers: function(req, resp) {
        if(resp && resp.status !== 'ok') {
            return;
        }

        var idx, member;
        for(idx=0; idx < resp.members.length; idx++) {
            member = resp.members[idx];
            member.key = 'member-' + (member.user_id || Number(new Date()));
        }
        this.setState({members: resp.members});
    },
    componentWillMount: function() {
        ajax('/api/1/group/' + this.props.params.groupId + '/members', this.haveMembers);
    },

	render: function() {
        var cursor = Cursor.build(this);
        var members = cursor.refine('members');

		return (
            <MembersList members={members}></MembersList>
        );

	}
})

module.exports = GroupEdit;
