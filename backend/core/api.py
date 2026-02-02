from django_bolt import BoltAPI

api = BoltAPI(prefix="/api/v2/")

from accounts.api.v2 import views as accounts_views
from todos.api.v2 import views as todos_views
