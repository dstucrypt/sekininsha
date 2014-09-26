import os
import logging
import zlib

from . app import app
from flask import Response, abort, url_for


@app.route('/scripts/<path:js>')
def js_hack(js):
    if app.config['LIVEJS'] is not True:
        abort(404)

    import urllib
    resp = urllib.urlopen(redirect_live_js(js))
    return Response(resp.read(), content_type="application/javascript")


@app.context_processor
def inject_user():
    if app.config['LIVEJS']:
        func = redirect_live_js
    else:
        func = static_js_path

    return dict(appjs=func)


hcache = {}
def script_version(path):
    try:
        return hcache[path]
    except KeyError:
        pass

    hh = 0
    def read():
        return f.read(4096)

    try:
        with app.open_resource(os.path.join('static', path)) as f:
            for chunk in iter(read, ''):
                hh = zlib.adler32(chunk, hh)
    except IOError as e:
        logging.error("Either use livejs mode or put compiled files in static/scripts/")
        abort(503)

    if app.config['DEBUG'] is not True:
        hcache[path] = hh
    return hh


def static_js_path(path):
    path = 'scripts/' + path
    hh = script_version(path)
    return url_for('static', filename=path, _external=True) + '?' + hex(hh)[2:]


def redirect_live_js(path):
    return "http://localhost:3000/scripts/{}".format(path)

