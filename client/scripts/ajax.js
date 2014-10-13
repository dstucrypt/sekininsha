var token = window.vote_token;
delete window.vote_token;

var resp_done = function(cb, req) {
    var resp;
    try {
        resp = JSON.parse(req.responseText);
    } catch (e) {
    }

    cb(req, resp);
};
module.exports = function (url, cb, data) {
    var req = new XMLHttpRequest();
    req.open(data ? 'POST' : 'GET', url, true);
    req.overrideMimeType('application/json');
    if(data) {
        req.setRequestHeader('Content-Type', 'application/json');
    }

    req.setRequestHeader('Vote-Token', token);
    req.onerror = cb.bind(null, req);
    req.ontimeout = cb.bind(null, req);
    req.onload = resp_done.bind(null, cb, req);
    req.send(JSON.stringify(data));
};
