from functools import wraps
from collections import namedtuple, defaultdict
from flask import Blueprint, jsonify, request, url_for, session, current_app
from flask.ext.login import current_user
from .models import Group, Shadow, User, Vote, VoteAnswer


api = Blueprint('api', __name__, url_prefix='/api/1')


def login_required(f):
    @wraps(f)
    def check_login(*args, **kwargs):
        if not current_user.is_authenticated():
            return jsonify(status='error', message="Not logged in", login_url=url_for('login'))

        token = request.headers.get('Vote-Token')
        need_token = session.get('vote-token')
        if token is  None or token != need_token:
            return jsonify(status='error', message='token'), 400

        return f(*args, **kwargs)
    return check_login


def validate_members(members):
    return all((
        member.get('email') or member.get('tax_id')
        for member in members
    ))


def add_members(group_id, members):
    for member in members:
        email, tax_id = member.get('email'), member.get('tax_id')
        name = member.get('name')
        user = User.resolve(tax_id, email)
        yield Shadow(
            name=user.name if user else name,
            ipn=tax_id, email=email,
            group_id=group_id, user=user,
        )


VoteShadow = namedtuple('VoteShadow', ['vote', 'shadow'])


@api.route('/group/', methods=['POST'])
@login_required
def api_group_create():
    data = request.json
    db = current_app.db
    if data is None:
        return "ZABORONENO! Send json to this API.", 415

    title = data.get('title')
    desc = data.get('description')
    members = data.get('members')

    if not current_user.is_authenticated():
        return jsonify(status='error', message="Not logged in", login_url=url_for('login'))

    if not title or not isinstance(members, list):
        return jsonify(status='error', message="Arguments format"), 400

    if not validate_members(members):
        return jsonify(status='error', message='Member format'), 400

    group = Group(owner_id=current_user.id,
                  name=title, description=desc)
    db.session.add(group)
    db.session.flush()
    map(db.session.add, add_members(group.id, members))

    shadow = Shadow(email=current_user.email,
                    ipn=current_user.ipn,
                    name=current_user.name,
                    user=current_user,
                    group=group)
    db.session.add(shadow)

    db.session.commit()
    return jsonify(status='ok', group_id=group.id)


@api.route('/user/<lookup>')
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


@api.route('/group/<int:group_id>/members')
@login_required
def api_group_members_read(group_id):
    shadow = Shadow.query.filter_by(group_id=group_id,
                                    user=current_user).first()
    if shadow is None:
        return jsonify(status='fail', code='EACCESS'), 403

    members = Shadow.query.filter_by(group_id=group_id)
    role = 'admin' if shadow.group.can_admin else 'member'
    return jsonify(
        status='ok',
        my_role=role,
        members=[
            member.export_for(role)
            for member in members
        ]
    )


@api.route('/group/<int:group_id>/members', methods=['POST'])
@login_required
def api_group_members_append(group_id):
    db = current_app.db
    data = request.json
    if data is None:
        return "ZABORONENO! Send json to this API.", 415

    shadow = Shadow.query.filter_by(group_id=group_id,
                                    user=current_user).first()
    if shadow is None or not shadow.group.can_admin:
        return jsonify(status='fail', code='EACCESS'), 403

    emails, taxids = set(), set()
    shadows = list(Shadow.query.filter_by(group_id=group_id))
    for shadow in shadows:
        if shadow.email:
            emails.add(shadow.email)
        if shadow.ipn:
            taxids.add(shadow.ipn)

    members = data.get('members')
    if not isinstance(members, list):
        return jsonify(status='error', message="Arguments format"), 400

    if not validate_members(members):
        return jsonify(status='error', message='Member format'), 400
    fail = False
    for member in members:
        member['errors'] = {}
        if member.get('tax_id') and member['tax_id'] in taxids:
            member['errors']['tax_id'] = 'DUP TAXID'
            fail = True
        if member.get('email') and member['email'] in emails:
            member['errors']['email'] = 'DUP EMAIL'
            fail = True

    if fail:
        return jsonify(
            status='fail',
            members=members
        )

    new_shadows = list(add_members(group_id, members))
    map(db.session.add, new_shadows)

    db.session.commit()

    return jsonify(
        status='ok',
        members=[
            member.export_for('admin')
            for member in shadows + new_shadows
        ]
    )


@api.route('/group/<int:group_id>')
@login_required
def api_group_read(group_id):
    shadow = Shadow.query.filter_by(group_id=group_id,
                                    user=current_user).first()
    if shadow is None:
        return jsonify(status='fail', code='EACCESS'), 403

    group = shadow.group
    role = 'admin' if group.can_admin else 'member'

    return jsonify(
        status='ok',
        group_id=group.id,
        my_role=role,
        owner_id=group.owner_id,
        owner_name=group.owner.name,
        title=group.name,
        description=group.description,
    )


@api.route('/group/')
@login_required
def group_list():
    user = current_user._get_current_object()
    groups = [
        shadow.group
        for shadow in
        Shadow.query.filter_by(user=user)
    ]

    return jsonify(
        status='ok',
        groups=[
            {
                "group_id": group.id,
                "name": group.name,
                "can_admin": group.can_admin,
            }
            for group in groups
        ]
    )


@api.route('/vote/', methods=['POST'])
@login_required
def api_vote_create():
    data = request.json
    db = current_app.db
    if data is None:
        return "ZABORONENO! Send json to this API.", 415

    title = data.get('title')
    desc = data.get('description')
    group_id = data.get('group_id')

    if not isinstance(title, basestring):
        return jsonify(status='fail', message='Title is mandatory')
    if not isinstance(desc, basestring):
        return jsonify(status='fail', message='Description should be string')

    try:
        group_id = int(group_id)
    except (ValueError, TypeError):
        return jsonify(status='fail', message='Invalid group id')

    shadow = Shadow.query.filter_by(group_id=group_id,
                                    user=current_user).first()
    if shadow is None:
        return jsonify(status='fail', code='EACCESS'), 403

    vote = Vote(group_id=group_id,
                owner_id=current_user.id,
                name=title,
                description=desc)
    db.session.add(vote)
    db.session.commit()

    return jsonify(
        status='ok',
        vote_id=vote.id
    )


@api.route('/vote/')
@login_required
def api_vote_list():
    user = current_user._get_current_object()
    group_id = request.args.get('group_id')
    q = current_app.db.session.query(Vote, Group, User)
    q = q.filter(Group.id == Vote.group_id, User.id == Vote.owner_id)

    if group_id:
        try:
            group_id = int(group_id)
        except ValueError:
            return jsonify(status='faile', message='group_id value not int'), 400

        shadow = Shadow.query.filter_by(group_id=group_id,
                                        user=current_user).first()
        if shadow is None:
            return jsonify(status='fail', code='EACCESS'), 403

        q = q.filter(Vote.group_id==group_id)

    q = q.order_by(Vote.id.desc())
    return jsonify(
        status='ok',
        vote=[vote.export(group, user) for vote, group, user in q]
    )


@api.route('/vote/<int:vote_id>')
@login_required
def api_vote_single(vote_id):
    vote = Vote.query.filter_by(id=vote_id).first()
    if not vote:
        return jsonify(status='false', message='No such vote'), 404

    shadow = Shadow.query.filter_by(group_id=vote.group_id,
                                    user=current_user).first()
    if shadow is None:
        return jsonify(status='fail', code='EACCESS'), 403

    return jsonify(
        status='ok',
        vote=vote.export()
    )


@api.route('/vote/<int:vote_id>/answers')
@login_required
def api_vote_answer_list(vote_id):
    vote = Vote.query.filter_by(id=vote_id).first()
    if not vote:
        return jsonify(status='false', message='No such vote'), 404

    shadow = Shadow.query.filter_by(group_id=vote.group_id,
                                    user=current_user).first()
    if shadow is None:
        return jsonify(status='fail', code='EACCESS'), 403

    
    voteshadows = {}
    for shadow in Shadow.query.filter_by(group_id=vote.group_id):
        voteshadows[shadow.user_id] = VoteShadow(shadow=shadow, vote=None)

    va_cnt = 0
    for voteanswer in VoteAnswer.query.filter_by(vote_id=vote.id):
        voteshadow = voteshadows.get(voteanswer.user_id)
        if not voteshadow:
            continue

        voteshadows[voteanswer.user_id] = VoteShadow(
            shadow=voteshadow.shadow, vote=voteanswer
        )
        va_cnt += 1

    possible = len([1 for v, s in voteshadows.values() if s.user_id])
    stats = defaultdict(lambda : 0)
    stats['total'] = va_cnt
    stats['group'] = len(voteshadows)
    stats['possible'] = possible
    for v, s in voteshadows.values():
        key = v.answer if v else 'na'
        stats[key] += 1

    return jsonify(
        status="ok",
        answers=[
            {
                "name": s.name,
                "user_id": s.user_id,
                "answer": v.answer if v else None,
            }
            for v, s in voteshadows.values()
        ],
        stats=stats,
        quorum=(va_cnt * 2) > len(voteshadows),
        quorum_possible=(possible * 2) > len(voteshadows),
        vote={
            "state": vote.state_text,
        },
    )

@api.route('/vote/<int:vote_id>/answer', methods=['POST'])
@login_required
def api_vote_answer(vote_id):
    data = request.json
    db = current_app.db
    if data is None:
        return "ZABORONENO! Send json to this API.", 415

    answer_text = data.get('answer')
    if not answer_text or answer_text.lower() not in ['yes', 'no', 'skip']:
        return jsonify(status='error', message='Answer'), 400

    vote = Vote.query.filter_by(id=vote_id).first()
    if not vote:
        return jsonify(status='false', message='No such vote'), 404

    shadow = Shadow.query.filter_by(group_id=vote.group_id,
                                    user=current_user).first()
    if shadow is None:
        return jsonify(status='fail', code='EACCESS'), 403


    db.session.query(VoteAnswer).filter_by(vote_id=vote_id, user_id=current_user.id).delete()
    answer = VoteAnswer(vote_id=vote_id,
                        user_id=current_user.id,
                        answer=answer_text,
    )
    db.session.add(answer)

    db.session.commit()

    return jsonify(
        status='ok',
        answer=answer_text,
        user_id=answer.user_id,
    )
