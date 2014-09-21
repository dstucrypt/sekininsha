from .extensions import db, login_manager


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    ipn_hash = db.Column(db.String(32), nullable=True, index=True)
    active = db.Column(db.Boolean, default=True)
    name = db.Column(db.String, index=False)

    def is_active(self):
        return self.active

    def get_id(self):
        print 'my id', self.id
        return self.id

    def is_anonymous(self):
        return False

    def is_authenticated(self):
        return True

    @classmethod
    def load_user(cls, user_id):
        return User.query.filter_by(id=int(user_id)).first()

    @classmethod
    def from_remote(cls, data):
        return cls(name=data['name'], ipn_hash=data['uniq'])


login_manager.user_loader(User.load_user)
