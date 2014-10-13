default: setup

setup: ./env/.pip

migrate: setup
	env/bin/python entry.py db upgrade


./env/.pip: ./env/.Python requirements.txt
	env/bin/pip install -r requirements.txt

./env/.Python:
	virtualenv env

ui:
	cd ./client/ ; make
	mkdir -p sekininsha/static/scripts/
	cp client/bundle.js sekininsha/static/scripts/bundle.js

deploy: ui
	rsync ./ app-vote@64.ikari.enodev.org:serve/ --exclude-from=./.rsyncignore -auv
	ssh app-vote@64.ikari.enodev.org ./serve/env/bin/python ./serve/entry.py db upgrade --directory=./serve/migrations
	ssh app-vote@64.ikari.enodev.org touch uwsgi.ini
