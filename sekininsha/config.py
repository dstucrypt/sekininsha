from os.path import dirname, abspath, join
SQLALCHEMY_DATABASE_URI = 'sqlite:////%s/data.sqlite' % dirname(abspath(__file__))
SQLALCHEMY_ECHO = True
LIVEJS=False
