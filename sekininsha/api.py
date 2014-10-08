from functools import wraps
from flask import jsonify, request, url_for
from flask.ext.login import current_user
from .models import Group, Shadow, User

from . app import app


def login_required(f):
    @wraps(f)
    def check_login(*args, **kwargs):
        if not current_user.is_authenticated():
            return jsonify(status='error', message="Not logged in", login_url=url_for('login'))

        return f(*args, **kwargs)
    return check_login


@app.route('/api/1/group/', methods=['POST'])
@login_required
def api_group_create():
    data = request.json
    db = app.db
    if data is None:
        return "ZABORONENO! Send json to this API.", 415

    title = data.get('title')
    desc = data.get('description')
    members = data.get('members')

    if not current_user.is_authenticated():
        return jsonify(status='error', message="Not logged in", login_url=url_for('login'))

    if not title or not isinstance(members, list):
        return jsonify(status='error', message="Arguments format"), 400

    if not all((
        member.get('email') or member.get('tax_id')
        for member in members
    )):
        return jsonify(status='error', message='Member format'), 400

    group = Group(owner_id=current_user.id,
                  name=title, description=desc)
    db.session.add(group)
    db.session.flush()
    for member in members:
        email, tax_id = member.get('email'), member.get('tax_id')
        name = member.get('name')
        user = User.resolve(tax_id, email)
        shadow = Shadow(
            name=user.name if user else name,
            ipn=tax_id, email=email,
            group=group, user=user,
        )
        db.session.add(shadow)

    shadow = Shadow(email=current_user.email,
                    ipn=current_user.ipn,
                    name=current_user.name,
                    user=current_user,
                    group=group)
    db.session.add(shadow)

    db.session.commit()
    return jsonify(status='ok', group_id=group.id)


@app.route('/api/1/user/<lookup>')
def api_user_resolve(lookup):
    uid = None
    if lookup.startswith('tax_id:') or \
       lookup.startswith('email:'):
        kw = dict((lookup.split(':', 1), ))
    else:
        try:
            uid = int(lookup)
            kw = {"id": uid}
        except:
            return jsonify(status='error', message="Don't understand"), 404

    if kw.get('email') == 'mustafa@h.tv' or uid == 200:
        user = {
            "user_id": 200,
            "name": "Mustafa Nayem",
            "have_facebook": True,
        }
    elif kw.get('tax_id') == '2952222000' or uid == 201:
        user = {
            "user_id": 201,
            "name": "Mozes CashKing",
            "have_facebook": True,
            "have_eusign": True,
        }
    else:
        return jsonify(status='fail', message='Not found'), 404

    return jsonify(status='ok', user=user)


@app.route('/api/1/group/<int:group_id>/members')
@login_required
def api_group_members_read(group_id):
    shadow = Shadow.query.filter_by(group_id=group_id,
                                    user=current_user).first()
    if shadow is None:
        return jsonify(status='fail', code='EACCESS'), 403

    members = Shadow.query.filter_by(group_id=group_id)
    role = 'admin' if shadow.group.can_admin else 'member'
    return jsonify(
        my_role=role,
        members=[
            member.export_for(role)
            for member in members
        ]
    )


@app.route('/api/1/group/<int:group_id>')
@login_required
def api_group_read(group_id):
    shadow = Shadow.query.filter_by(group_id=group_id,
                                    user=current_user).first()
    if shadow is None:
        return jsonify(status='fail', code='EACCESS'), 403

    group = shadow.group
    role = 'admin' if group.can_admin else 'member'

    return jsonify(
        my_role=role,
        owner_id=group.owner_id,
        owner_name=group.owner.name,
        title=group.name,
        description=group.description,
    )
