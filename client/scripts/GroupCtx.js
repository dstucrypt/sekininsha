/** @jsx React.DOM */
'use strict';
var React = require('react/addons');

var ajax = require('./ajax');
var VoteList = require('./components/VoteList');

var ButtonLink = require('./ButtonLink');
var Row = require('react-bootstrap').Row;
var PageHeader = require('react-bootstrap').PageHeader;

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
            <ButtonLink style={{"margin-left":5}} to="group_edit" params={{groupId: gid}}>Edit</ButtonLink>
        ) : undefined;
        if(gid === undefined) {
            return (<span>loading</span>);
        }
        var votelink = this.canSubmitVote() ? (
            <ButtonLink to="vote_create" params={{groupId: gid}}>Create vote</ButtonLink>
        ) : undefined;
        return (
            <div>
                <Row>
                    <h1>{this.state.group.title}{editlink}</h1>
                </Row>
                <Row>
                    <VoteList votes={votes} />
                </Row>
                <Row style={{"margin-bottom": 10}}>
                    {votelink}
                </Row>
            </div>
        );
    },
});

module.exports = GroupCtx;
