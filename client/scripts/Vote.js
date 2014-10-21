/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var PublicAnswer = require('./components/PublicAnswer');
var ajax = require('./ajax');
var Table = require('react-bootstrap').Table;
var Router = require('react-router');
var Link = Router.Link;

var B = require('react-bootstrap'),
    Grid = B.Grid,
    Row = B.Row,
    Col = B.Col,
    Button = B.Button,
    Panel = B.Panel,
    ButtonToolbar = B.ButtonToolbar;

var SVGPieChart = require('./SVGPieChart')

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
        this.setState({members: resp.answers, stats: resp.stats});
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
        var vid = this.props.params.voteId;
        ajax('/api/1/vote/' + vid + '/answers', this.haveAnswers);
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
            <ButtonToolbar>
                <Button bsStyle="success" onClick={this.sendVote.bind(null, 'yes')}>Да</Button>
                <Button bsStyle="danger" onClick={this.sendVote.bind(null, 'no')}>Нет</Button>
                <Button onClick={this.sendVote.bind(null, 'skip')}>Воздержаться</Button>
            </ButtonToolbar>
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
                <Table striped bordered>
                    <thead>
                        <tr>
                            <th className="col-sm-1">#</th>
                            <th>Имя</th>
                            <th className="col-sm-1">Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                    {member_votes}
                    </tbody>
                </Table>
            )
        }
        var title = <h1>{vote.title}</h1>;

        var stats = [
            this.state.stats.yes || 0, 
            this.state.stats.no || 0, 
            this.state.stats.skip || 0, 
            this.state.stats.na || 0
        ];
        
        var colors = [
            '#449d44', 
            '#d9534f', 
            'grey', 
            'white'
        ];

        return (
            <div>
                <Row>
                    <h1><Link to="group_ctx" params={{groupId: vote.group_id}}>{vote.group_title}</Link></h1>
                </Row>
                <Row>
                    <Panel header={title} footer={buttons}>
                        {vote.description}
                    </Panel>
                </Row>
                <Row>
                    <Col md={6}>{member_votes}</Col>
                    <Col md={4} mdPush={1}>
                        <p className="text-center">
                            <SVGPieChart stats={stats} colors={colors} radius={135} border={1}/>
                        </p>
                    </Col>
                </Row>
            </div>
        );
    },
});

module.exports = Vote;
