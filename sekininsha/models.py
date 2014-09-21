from .extensions import db


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    ipn_hash = db.Column(db.String(32), nullable=True, index=True)
    active = db.Column(db.Boolean, default=True)

    def is_active(self):
        return self.active
