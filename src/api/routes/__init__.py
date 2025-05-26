from flask import Blueprint
from flask_cors import CORS

# Create the main Blueprint
api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# Import all route modules
from .reservations import *
from .tables import *
from .orders import *
from .products import *
from .kitchen import *
from .auth import *
from .general import *

# All routes will be registered to the api Blueprint automatically 