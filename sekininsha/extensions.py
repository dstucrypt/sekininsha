from flask.ext.sqlalchemy import SQLAlchemy
db = SQLAlchemy()


from flask.ext.migrate import Migrate, MigrateCommand
migrate = Migrate()

from flask.ext.script import Manager
manager = Manager()
manager.add_command('db', MigrateCommand)


from flask_oauthlib.client import OAuth
oauth = OAuth()


from flask.ext.login import LoginManager
login_manager = LoginManager()
login_manager.login_view = 'login'
