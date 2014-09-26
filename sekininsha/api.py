from flask import jsonify, request, url_for
from flask.ext.login import current_user
from . app import app

@app.route('/api/1/group/', methods=['POST'])
def api_group_create():
    data = request.json
    if data is None:
        return "ZABORONENO! Send json to this API.", 415

    title = data.get('title')
    desc = data.get('description')
    members = data.get('members')

    if not current_user.is_authenticated():
        return jsonify(status='error', message="Not logged in", login_url=url_for('login'))

    if not (title and desc) or not isinstance(members, list):
        return jsonify(status='error', message="Arguments format"), 400

    if not all((
        member.get('email') or member.get('tax_id')
        for member in members
    )):
        return jsonify(status='error', message='Member format'), 400

    return jsonify(status='ok', group_id=1)


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
