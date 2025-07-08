from flask import Flask
from flask_cors import CORS
import os

from squat_api import register_squat_routes
from pushup_api import register_pushup_routes
from lunge_api import register_lunge_routes
from plank_api import register_plank_routes  # Only if you have one

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Register each exercise route
register_squat_routes(app)
register_pushup_routes(app)
register_lunge_routes(app)
register_plank_routes(app)  # Comment/remove if not using

if __name__ == '__main__':
    app.run(debug=True)
