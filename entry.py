import sys
from sekininsha.app import app
import sekininsha.views
import sekininsha.api

if __name__ == '__main__':
    if sys.argv[1:]:
        app.manager.run()
    else:
        app.run(debug=True)
