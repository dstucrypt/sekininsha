/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var ListGroupLink = require('../ListGroupLink');
var ListGroup = require('react-bootstrap').ListGroup;

var VoteList = React.createClass({
    render: function() {
        var votes = [], vote, key;
        var vl = this.props.votes.length;
        var idx;
        for(idx=0; idx<vl; idx++) {
            vote = this.props.votes[idx];
            key = "vote_" + vote.vote_id;
            key= 'g_' + key;
            votes.push(
                <ListGroupLink key={key} to="vote" params={{voteId: vote.vote_id}}>
                    {vote.title}
                </ListGroupLink>
            );
        };

        return <ListGroup bsStyle={{"margin-bottom":10}}>{votes}</ListGroup>
    }
});

module.exports = VoteList;
