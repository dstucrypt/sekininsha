/** @jsx React.DOM */
'use strict';
var React = require('react/addons'),
    Router = require('react-router');

var ajax = require('./ajax');
var VoteList = require('./components/VoteList');

var Link = Router.Link;

var GroupCtx = React.createClass({
    getInitialState: function() {
        return {
            group: {},
            votes: [],
        };
    },
    haveGroup: function(req, resp) {
        if(!resp || (resp && resp.status !== 'ok')) {
            return;
        }

        delete resp.status;
        this.setState({group: resp});
    },
    haveVotes: function(req, resp) {
        if(!resp || (resp & resp.status !== 'ok')) {
            return;
        }

        this.setState({votes: resp.vote});
    },
    componentWillMount: function() {
        ajax('/api/1/group/' + this.props.params.groupId, this.haveGroup);
        ajax('/api/1/vote/?group_id=' + this.props.params.groupId, this.haveVotes);

    },
    canSubmitVote: function() {
        return true;
    },
    render: function() {
        var gid = this.state.group.group_id;
        var votes = this.state.votes;

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
            <VoteList votes={votes} />
            </div>
        );
    },
});

module.exports = GroupCtx;
