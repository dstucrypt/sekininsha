/** @jsx React.DOM */
'use strict';
var React = require('react/addons'),
    Router = require('react-router');

var ajax = require('./ajax');

var Link = Router.Link;

var GroupCtx = React.createClass({
    getInitialState: function() {
        return {
            group: {}
        };
    },
    haveGroup: function(req, resp) {
        if(!resp || (resp && resp.status !== 'ok')) {
            return;
        }

        delete resp.status;
        this.setState({group: resp});
    },
    componentWillMount: function() {
        ajax('/api/1/group/' + this.props.params.groupId, this.haveGroup);
    },
    canSubmitVote: function() {
        return true;
    },
    render: function() {
        var gid = this.state.group.group_id;
        var editlink = (this.state.group.my_role === 'admin') ? (
            <Link to="group_edit" params={{groupId: gid}}>Edit</Link>
        ) : undefined;
        if(gid === undefined) {
            return (<span>loading</span>);
        }
        var votelink = this.canSubmitVote() ? (
            <Link to="vote_create" params={{groupId: gid}}>Create vote</Link>
        ) : undefined;
        return (
            <div>
            <h1>{this.state.group.title}</h1>
            <span>{editlink}</span> <span>{votelink}</span>
            </div>
        );
    },
});

module.exports = GroupCtx;
