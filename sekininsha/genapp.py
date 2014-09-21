from flask import Flask
from .extensions import db

def create_app():
    app = Flask('sekininsha')
    app.config.from_object('sekininsha.config')
    app.config.from_pyfile('../local.cfg', silent=True)

    db.init_app(app)
    app.db = db

    return app
