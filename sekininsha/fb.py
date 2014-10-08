from flask import g
from .app import app
from .extensions import oauth


fb = oauth.remote_app(
    'fb',
    consumer_key=app.config['FB_OAUTH2_KEY'],
    consumer_secret=app.config['FB_OAUTH2_SECRET'],
    request_token_params={'scope': 'email'},
    base_url='https://graph.facebook.com',
    request_token_url=None,
    access_token_url='/oauth/access_token',
    authorize_url='https://www.facebook.com/dialog/oauth'
)


@fb.tokengetter
def get_fb_oauth_token():
    return g.fb_token
