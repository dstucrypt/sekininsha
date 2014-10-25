/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var ajax = require('./ajax');

var User = React.createClass({
    getInitialState: function() {
        return {user: null};
    },
    haveMe: function(req, resp) {
        if(!resp || (resp & resp.status !== 'ok')) {
            alert('faile');
            return;
        }
        this.setState({user: resp.user});
    },
    componentWillMount: function() {
        ajax('/api/1/me', this.haveMe);
    },
    render: function() {
        var user = this.state.user || window.current_user;
        var eusign = user.ipn ? (<div>Tax ID: {user.ipn}
        </div>) : null;
        var fb = user.email ? (<div>
            <div>Email: {user.email}</div>
            <div>Facebook: <a href={"https://facebook.com/" + user.fb} >Facebook</a></div>
        </div>) : null;

        return (<div>
            <h1>Это ваша контактная информация</h1>

            <div>Name: <span>{user.name}</span></div>
            {eusign}
            {fb}
        </div>);
    },
});

module.exports = User;
