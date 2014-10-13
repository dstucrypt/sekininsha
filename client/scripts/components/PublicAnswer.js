/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Tooltip = require('react-bootstrap').Tooltip;

var PublicAnswer = React.createClass({
    render: function() {
        var mv = this.props.data;
        var mid = this.props.mid;
        // XXX: making things uo, b/c
        // server have no vote answers right now.
        var answer = mv.answer || (mv.user_id !== null ? "?" : "X");

        switch (answer) {
            case "yes":
                answer = <span className="glyphicon glyphicon-ok text-success"/>;
                break;
            case "no": 
                answer = <span className="glyphicon glyphicon-remove text-danger"/>;
                break;
            case "skip":
                answer = <span className="glyphicon glyphicon-minus"/>;
                break;
            case "?":
                answer = <span className="glyphicon glyphicon-time text-info"/>;
                break;
            case "X":
                answer = <OverlayTrigger placement="right" overlay={<Tooltip>Пользователь приглашен, но не зарегистрировался.</Tooltip>}><span className="glyphicon glyphicon-warning-sign text-info"/></OverlayTrigger>;
                break;
            default:
                break;
        };

        return (
            <tr>
                <td>{mid + 1}</td>
                <td>{mv.name}</td>
                <td>{answer}</td>
            </tr>
        );
    }
});

module.exports = PublicAnswer;
