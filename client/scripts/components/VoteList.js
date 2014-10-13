/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;

var VoteList = React.createClass({
    render: function() {
        var votes = [], vote, key;
        var vl = this.props.votes.length;
        var idx;
        for(idx=0; idx<vl; idx++) {
            vote = this.props.votes[idx];
            console.log(vote);
            key = "vote_" + vote.vote_id;
            key= 'g_' + key;
            votes.push(
                <ListGroupItem key={key}>
                    {vote.title}
                </ListGroupItem>
            );
        };

        return <ListGroup bsStyle={{"margin-bottom":10}}>{votes}</ListGroup>
    }
});

module.exports = VoteList;
