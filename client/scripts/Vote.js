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
            <ButtonToolbar >
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

        function renderChart(sectors){

            var paths = [];
            var total = 0,
                col = 0,
                seg = 0,
                radius = 130,
                startx = 135,  //The screen x-origin: center of pie chart
                starty = 135,   //The screen y-origin: center of pie chart
                lastx = radius, //Starting coordinates of 
                lasty = 0;      //the first arc

            var colors = ['red','blue','yellow','magenta','orange','slateblue','slategrey','greenyellow','wheat']; 
            var bordercolor = 'black';
            for (var i = 0; i < sectors.length; i++) {
                total += sectors[i];
            }
            for (var i = 0; i < sectors.length; i++) {
                var n = sectors[i];
                var arc = "0";                  // default is to draw short arc (< 180 degrees)
                seg = n/total * 360 + seg;      // this angle will be current plus all previous
                if ((n/total * 360) > 180) {
                    arc = "1"               // just in case this piece is > 180 degrees
                }
                var radseg = seg * Math.PI / 180;  // we need to convert to radians for cosine, sine functions
                var nextx = Math.round(Math.cos(radseg) * radius);
                var nexty = Math.round(Math.sin(radseg) * radius);
                var d = 'M ' + startx + ',' + starty + ' l ' + lastx + ',' + (-lasty) + ' a' + radius + ',' + radius + ' 0 ' + arc + ',0 ' + (nextx - lastx) + ',' + (-(nexty - lasty)) + ' z';
                console.log(d);
                var path = <path d={d} fill={colors[col]} stroke={bordercolor} stroke-width="2" stroke-linejoin="round" />;
                paths.push(path);
                lastx = nextx;
                lasty = nexty;
                col++;
            }
            return paths;
        }
        var paths = renderChart([2,5,1,6]);
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
                <p className="text-center"><svg width="270" height="270" xmlns="http://www.w3.org/2000/svg" version="1.1">
                    {paths}
                </svg></p>
            </Col>
            </Row>
            </div>
        );
    },
});

module.exports = Vote;
