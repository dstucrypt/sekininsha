/** @jsx React.DOM */
'use strict';
var React = require('react/addons');

var PublicAnswer = React.createClass({
    render: function() {
        var mv = this.props.data;
        var mid = this.props.mid;
        // XXX: making things uo, b/c
        // server have no vote answers right now.
        var answer = mv.user_id !== null ? "No" : "Skipped";

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
