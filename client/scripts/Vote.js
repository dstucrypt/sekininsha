/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var PublicAnswer = require('./components/PublicAnswer');
var ajax = require('./ajax');

var B = require('react-bootstrap'),
    Grid = B.Grid,
    Row = B.Row,
    Col = B.Col,
    Button = B.Button;

var Vote = React.createClass({
    getInitialState: function() {
        return {
            vote: {},
            members: null,
        };
    },
    componentWillMount: function() {
        var vid = this.props.params.voteId;
        ajax('/api/1/vote/' + vid, this.haveVote);
        ajax('/api/1/vote/' + vid + '/answers', this.haveAnswers);
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
        
        this.setState({vote: resp.vote});
    },
    haveAnswers: function(req, resp) {
        if(!resp || (resp & resp.status !== 'ok')) {
            return;
        }

        this.setMemberKeys(resp.answers);
        this.setState({members: resp.answers});
    },
    changedAnswer: function(req, resp) {
        if(!resp || (resp & resp.status !== 'ok')) {
            return;
        }

        if(resp.user_id === null || resp.user_id === undefined) {
            return;
        }

        var members = this.state.members;
        var mv;
        var idx, ml = members.length;
        for(idx=0; idx<ml; idx++) {
            mv = members[idx];
            if(mv.user_id === resp.user_id) {
                mv.answer = resp.answer;
                break;
            }
        }

        this.setState({members: members});
    },
    sendVote: function(answer) {
        var url = '/api/1/vote/' + this.props.params.voteId + '/answer';
        ajax(url, this.changedAnswer, {answer: answer});
    },
    render: function() {
        var vote = this.state.vote;
        var member_votes, mv;
        var ml, idx, key;
        if(vote.title === undefined) {
            return (<span>Loading...</span>);
        }
        var buttons = (
            <Row style={{"padding-bottom":"9px"}}>
            <Col md={12}>
                <Button style={{"margin-right": "5px"}} bsStyle="primary" onClick={this.sendVote.bind(null, 'yes')}>Да</Button>
                <Button style={{"margin-right": "5px"}} bsStyle="primary" onClick={this.sendVote.bind(null, 'no')}>Нет</Button>
                <Button style={{"margin-right": "5px"}} bsStyle="primary" onClick={this.sendVote.bind(null, 'skip')}>Воздержаться</Button>
            </Col>
            </Row>
        );

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
                <p>{vote.description}</p>
                <Grid>
                    {buttons}
                </Grid>
                {member_votes}
            </div>
        );
    },
});

module.exports = Vote;
