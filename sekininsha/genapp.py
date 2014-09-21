from flask import Flask
from .extensions import db, migrate, manager, oauth

def create_app():
    app = Flask('sekininsha')
    app.config.from_object('sekininsha.config')
    app.config.from_pyfile('../local.cfg', silent=True)

    db.init_app(app)
    app.db = db

    migrate.init_app(app, db)
    manager.app = app
    app.manager = manager

    oauth.init_app(app)

    return app
