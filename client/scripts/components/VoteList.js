/** @jsx React.DOM */
'use strict';
var React = require('react/addons');

var VoteList = React.createClass({
    render: function() {
        var votes = [], vote, key;
        var vl = this.props.votes.length;
        var idx;
        for(idx=0; idx<vl; idx++) {
            vote = this.props.votes[idx];
            key = "vote_" + vote.vote_id;
            key= 'g_' + key;
            votes.push(<li key={key}>
                <span>{vote.group_title}</span>&nbsp;
                <span>{vote.title}</span>
            </li>);
        };

        return <ul>{votes}</ul>
    }
});

module.exports = VoteList;
