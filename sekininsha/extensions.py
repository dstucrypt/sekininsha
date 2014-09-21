from flask.ext.sqlalchemy import SQLAlchemy
db = SQLAlchemy()


from flask.ext.migrate import Migrate, MigrateCommand
migrate = Migrate()

from flask.ext.script import Manager
manager = Manager()
manager.add_command('db', MigrateCommand)
