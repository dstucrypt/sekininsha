from flask.ext.login import current_user
from .extensions import db, login_manager


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    ipn_hash = db.Column(db.String(64), nullable=True, index=True)
    ipn = db.Column(db.String(10), nullable=True, index=True)
    facebook = db.Column(db.String(20), nullable=True, index=True)
    email = db.Column(db.String, nullable=True, index=True)
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
    def resolve(cls, tax_id=None, email=None, **kwargs):
        rett, rete = None, None
        if tax_id is not None:
            rett = cls.query.filter_by(ipn=tax_id).first()

        if email is not None:
            rete = cls.query.filter_by(email=email).first()

        return rett or rete

    @classmethod
    def load_user(cls, user_id):
        return User.query.filter_by(id=int(user_id)).first()

    @classmethod
    def from_remote(cls, data, provider):
        if provider == 'eusign':
            return cls(name=data['name'], ipn_hash=data['uniq'],
                       ipn=data['tax_id'])
        elif provider == 'fb':
            return cls(name=data['name'], facebook=data['id'],
                       email=data['email'])


login_manager.user_loader(User.load_user)


class Group(db.Model):
    __tablename__ = 'groups'

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(
        db.Integer, db.ForeignKey('users.id', ondelete='CASCADE')
    )
    owner = db.relationship('User')

    name = db.Column(db.Text())
    description = db.Column(db.Text())

    @property
    def can_admin(self):
        return self.owner_id == current_user.id


class Shadow(db.Model):
    __tablename__ = 'shadow'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=True
    )
    user = db.relationship('User')
    email = db.Column(db.String, nullable=True, index=True)
    ipn = db.Column(db.String(10), nullable=True, index=True)

    group_id = db.Column(
        db.Integer, db.ForeignKey('groups.id', ondelete='CASCADE'), nullable=True
    )
    group = db.relationship('Group')

    @classmethod
    def update_shadows(cls, user, **filter_kw):
        for shadow in cls.query.filter_by(**filter_kw):
            if shadow.user_id is not None:
                continue

            shadow.user = user
            db.session.add(shadow)
