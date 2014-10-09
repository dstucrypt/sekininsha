/** @jsx React.DOM */
'use strict';
var _ = require("underscore");
var React = require('react/addons');
var Cursor = require('react-cursor/src/Cursor');
var ajax = require('./ajax');
var validate = require('./validate');

var Button = require('react-bootstrap/Button');

var MembersList = require('./components/MembersList');

var GroupEdit = React.createClass({
    getInitialState: function() {
        return {
            members: [],
            pending_members: [],
        };
    },
    setMemberKeys: function(members) {
        var idx, member;
        for(idx=0; idx < members.length; idx++) {
            member = members[idx];
            member.key = 'member-' + idx.toString() + (member.user_id || Number(new Date()));
        }
        return members;
    },
    haveMembers: function(req, resp) {
        if(!resp || (resp && resp.status !== 'ok')) {
            return;
        }

        this.setMemberKeys(resp.members);
        this.setState({members: resp.members});
    },
    changedMembers: function(req, resp) {
        if(resp && resp.status === 'fail' && resp.members) {
            this.setState({pending_members: this.setMemberKeys(resp.members)});
        }
        if(!resp || (resp && resp.status !== 'ok')) {
            console.log("append fail");
            return;
        }

        this.setMemberKeys(resp.members);
        this.setState({members: resp.members, pending_members: []});
    },
    componentWillMount: function() {
        ajax('/api/1/group/' + this.props.params.groupId + '/members', this.haveMembers);
    },
    makeMemberData: function() {
        return {
            key: "member" + Number(new Date()).toString(),
            editing: true,
        };
    },
    addMember: function(members) {
        // XXX: DRY refactor out
        var nu = members.pendingValue();
        nu.push(this.makeMemberData());
        members.onChange(nu);
    },
    submit: function(members) {
        var errors;
        var ml = members.pendingValue().length;
        var ready = true;
        var idx;
        for(idx = 0; idx < ml; idx++) {
            errors = validate.member(members.refine(idx).value, true);
            members.refine(idx, 'errors').set(errors);
            ready = ready && Object.keys(errors).length === 0;
        }
        if(!ready) {
            return;
        }

        ajax('/api/1/group/' + this.props.params.groupId + '/members', this.changedMembers, {members: this.state.pending_members});
    },
	render: function() {
        var cursor = Cursor.build(this);
        var members = cursor.refine('members');
        var pending_members = cursor.refine('pending_members');
        var mlen = members.pendingValue().length;
        var buttons = [
           <Button bsStyle="primary" style={{"margin-right":"5px"}} onClick={this.addMember.bind(null, pending_members)} key="badd">Добавить</Button>
        ];

        if(pending_members.pendingValue().length > 0) {
           buttons.push( <Button bsStyle="primary" style={{"margin-right":"5px"}} onClick={this.submit.bind(null, pending_members)} key="bsave">Сохранить</Button>);
        }

		return (
            <div>
                {buttons}
                <MembersList members={members}></MembersList>
                <MembersList members={pending_members} from_id={mlen}></MembersList>
                {buttons}
            </div>
        );

	}
})

module.exports = GroupEdit;
