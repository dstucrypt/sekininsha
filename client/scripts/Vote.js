/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var PublicAnswer = require('./components/PublicAnswer');
var ajax = require('./ajax');

var Vote = React.createClass({
    getInitialState: function() {
        return {
            vote: {},
            members: null,
        };
    },
    componentWillMount: function() {
        ajax('/api/1/vote/' + this.props.params.voteId, this.haveVote);
    },
    // XXX factor out;
    setMemberKeys: function(members) {
        var idx, member;
        for(idx=0; idx < members.length; idx++) {
            member = members[idx];
            member.key = 'member-' + idx.toString() + (member.user_id || Number(new Date()));
        }
        return members;
    },

    haveVote: function(req, resp) {
        if(!resp || (resp & resp.status !== 'ok')) {
            return;
        }
        ajax('/api/1/group/' + resp.vote.group_id + '/members', this.haveMembers);
        this.setState({vote: resp.vote});
    },
    haveMembers: function(req, resp) {
        if(!resp || (resp & resp.status !== 'ok')) {
            return;
        }

        this.setMemberKeys(resp.members);
        this.setState({members: resp.members});
    },
    render: function() {
        var vote = this.state.vote;
        var member_votes, mv;
        var ml, idx, key;
        if(vote.title === undefined) {
            return (<span>Loading...</span>);
        }
        if(this.state.members === null) {
            member_votes = (<span>Loading</span>);
        } else {
            member_votes = [];
            ml = this.state.members.length;
            for(idx=0; idx<ml; idx++) {
                mv = this.state.members[idx];
                key = "member_" + mv.key;

                member_votes.push(<PublicAnswer key={key} data={mv} mid={idx} />);
            }
            member_votes = (
                <table>
                    <tbody>
                    {member_votes}
                    </tbody>
                </table>
            )
        }
        return (
            <div>
                <h1>{vote.title}</h1>
                {member_votes}
            </div>
        );
    },
});

module.exports = Vote;
