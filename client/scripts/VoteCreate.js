/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var Cursor = require('react-cursor/src/Cursor');
var B = require('react-bootstrap'),
    Grid = B.Grid,
    Row = B.Row,
    Col = B.Col,
    Button = B.Button;

var ajax = require('./ajax');

var VoteCreate = React.createClass({
    getInitialState: function () {
        return {
            form_data: {
                "title": "",
                "description": "",
            }
        };
    },
    updateTextField: function(cursor, event) {
        cursor.onChange(event.target.value);
    },
    validate: function(data) {
        return data && false;
    },
    submit: function(data) {
        if(!this.validate(data)) {
            return this.setState({error: "EFORM"});
        }
        ajax('/api/1/vote/', this.submitCB, data.pendingValue());
    },
    submitCB: function(req, resp) {
        if(!resp || resp.status === 'ok') {
            this.setState({error: "EVOTE"});
        }
    },
    render: function() {
        var cursor = Cursor.build(this);
        var data = cursor.refine("form_data");
        var title = data.refine("title");
        var desc = data.refine("description");

        var emsg = cursor.refine('error');

        var buttons = (
            <Row style={{"padding-bottom":"9px"}}>
            <Col md={12}>
                <Button bsStyle="primary" onClick={this.submit.bind(null, data)}>Опубликовать</Button>
            </Col>
            </Row>
        );
        var error = emsg.value ? (<div className="alert alert-danger" role="alert">{emsg.value}</div>) : undefined;

        return (
        <div>
            <Grid>
            {error}
            <h1>Create vote</h1>
            <Row>
                <Col md={12}>
                <h3>Тема голосования</h3>
                <input type="text" id="title" className="form-control" value={title.value} onChange={this.updateTextField.bind(this, title)}></input>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                <h3>Описание</h3>
                <textarea rows="5" id="description" className="form-control"  value={desc.value} onChange={this.updateTextField.bind(this, desc)}></textarea>
                </Col>
            </Row>
            {buttons}
    	</Grid>
    </div>
    );
    }
});

module.exports = VoteCreate;

