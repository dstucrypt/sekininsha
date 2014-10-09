from flask import request, url_for, g, redirect, render_template, abort
from flask_oauthlib.client import OAuthException
from flask.ext.login import login_user, logout_user, login_required, current_user
from .app import app
from .models import User, Shadow, Group
from .eusign import eusign
from .fb import fb


def rapp(name):
    try:
        return {
            "fb": fb,
            "eusign": eusign,
        }[name]
    except KeyError:
        abort(400)


@app.route('/')
@login_required
def index():
    """Dashboard would be shown here for authenticated user.

    This page should list:
        - groups you are in
        - groups where you have admin rights
        - groups where you can create or start votes
        - link to group creation page
        - currently running votes available for you
        - currently running votes where you already voted
        - results of finished votes
    """
    return render_template('group_create.html')


@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/login/<provider>')
def go_login(provider):
    remote = rapp(provider)
    return remote.authorize(callback=url_for('authorized', provider=provider, _external=True))


@app.route('/logout')
def logout():
    logout_user()
    return U"LOGGED OUT"


@app.route('/login/authorized')
@app.route('/login/authorized/<provider>')
def authorized(provider='eusign'):
    remote = rapp(provider)

    resp = remote.authorized_response()
    if resp is None or isinstance(resp, (basestring, OAuthException)):
        return 'Access denied: reason=%s error=%s' % (
            request.args['error_reason'],
            request.args['error_description']
        )
    if provider == 'eusign':
        g.eusign_token = (resp['access_token'], '')
        me = eusign.get('user')
        filter_kw = {
            "ipn_hash": me.data['uniq'],
        }
        shadow_kw = {
            "ipn": me.data['tax_id'],
        }
    elif provider == 'fb':
        g.fb_token = (resp['access_token'], '')
        me = fb.get('me')
        if 'error' in me.data:
            abort(400)

        if 'email' not in me.data:
            abort(400)

        filter_kw = {
            "facebook": me.data['id'],
        }
        shadow_kw = {
            "email": me.data['email'],
        }

    db = app.db
    current_user = User.query.filter_by(**filter_kw).first()
    if current_user is None:
        current_user = User.from_remote(me.data, provider)
        db.session.add(current_user)
        db.session.flush()

    Shadow.update_shadows(current_user, **shadow_kw)

    db.session.commit()
    login_user(current_user)

    return redirect(url_for('index'))


@app.route('/group/<int:group_id>/')
@login_required
def group(group_id):
    """Group dashboard

    This page should list:
        - group members (short list)
        - group admins
        - group policy (voting rules)
        - link to full group members listing
        - link to group administation interface
        - list of currently running votes (indicating whether you had
          or had not voted)
        - last votes results
        - link to votes archive
    """
    shadow = Shadow.query.filter_by(group_id=group_id,
                                    user=current_user).first()
    if shadow is None:
        abort(403)

    group = Group.query.filter_by(id=group_id).first()
    if group is None:
        abort(404)

    return render_template('group_create.html')


@app.route('/vote/<vote_id>/')
def vote(vote_id):
    """Vote page

    This page should indicate:
        - vote title
        - vote description
        - person that manages vote
        - vote scope - public, group, mutli-group, ad-hoc
            - public vote - everybode can vote
            - group vote - only group members can vote
            - mgroup vote - members of different groups can vote
            - ad-hoc - arbitrary list of voters
        - vote secrecy - secret or signed votes
        - vote state - (planned, running, abadoned, with result)
        - vote choices 
            - yes/no/skip
            - single-choice
            - mchoice
            - ordering
        - opinions on this vote choices (links)
        - button to select choice (submit vote)
        - button to start vote (when have access)
        - button to end vote (if have access and manual end)
          - if button is pressed when quorum is not present, 
            vote transits to abadoned state
          - otherwise vote produces result
        - vote results (for completed votes)
        - link to vote protocol (detailed page with names, signs etc)
    """
    return "VOTE"


@app.route('/vote/<vote_id>/opinion/<opinion_id>/')
def vote_opinion(vote_id, opinion_id):
    """Vote opinion interface

    This page should show:
        - opinion author
        - full text
        - link to vote
    """
    return "VOTE OPINION"


@app.route('/group/create')
def group_create():
    """Group creation interface

    This page should have interface to select
        - group name
        - parent group (optional)
        - group visibility
        - initial members list
    """
    return render_template("group_create.html")


@app.route('/group/group_id/manage')
def group_manage():
    """Group management interface

    This page should have interface to
        - change group title
        - change group description
        - add admins
        - add members (users present in db and invites)
        - change group policy (voting rules)
            - everybody can suggest vote
            - everybody can start vote
            - group admins can start vote
            - quorum and ballout default values
    """
    return "MANAGE_GROUP"


@app.route('/group/<group_id>/vote/create')
def vote_create():
    """Vote creation interface

    This page should have interface to select:
        - vote title
        - vote description
        - vote type (see above)
        - vote secrecy
        - vote end policy (manual, timed, quorum)
        - quorum and turnout policy
        - vote choices
        - vote manager (defaults to current user or group admin)
        - child groups that can participate
    """
    return "V_CREATE_INTERFACE"

