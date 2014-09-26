import sys
from sekininsha.app import app
import sekininsha.views
import sekininsha.api
import sekininsha.livejs

if __name__ == '__main__':
    if not sys.argv[1:]:
        app.run(debug=True)
    elif sys.argv[1] == 'livejs':
        app.config['LIVEJS'] = True
        app.run(debug=True)
    else:
        app.manager.run()
