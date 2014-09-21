from flask import session
from .app import app
from .extensions import oauth


eusign = oauth.remote_app(
    'eusign',
    consumer_key=app.config['EUSIGN_OAUTH2_KEY'],
    consumer_secret=app.config['EUSIGN_OAUTH2_SECRET'],
    request_token_params={'scope': 'x509'},
    base_url='https://eusign.org/api/1/',
    request_token_url=None,
    access_token_method='GET',
    access_token_url='https://eusign.org/oauth/token',
    authorize_url='https://eusign.org/oauth',
)


@eusign.tokengetter
def get_github_oauth_token():
    return session.get('eusign_token')
