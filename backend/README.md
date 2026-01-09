# Django ToDo Backend API

A clean, production-ready Django REST Framework backend with MySQL database, JWT authentication, task management, categories, and comprehensive test coverage.

## Features

- **Authentication**: JWT-based authentication with user registration, login, and token refresh
- **Task Management**: Full CRUD operations for tasks with filtering, search, and statistics
- **Category Management**: User-scoped categories for organizing tasks
- **File Upload**: Image upload support for tasks
- **Billing & Subscriptions**: Polar.sh integration for subscription management and payments
- **User Isolation**: Users can only access their own tasks and categories
- **Comprehensive Testing**: pytest test suite with high coverage
- **API Versioning**: Versioned API endpoints (`/api/v1/`)

## Technology Stack

- **Framework**: Django 6.0
- **API**: Django REST Framework
- **Database**: MySQL
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Payments**: Polar.sh (polar-sdk)
- **CORS**: django-cors-headers
- **Testing**: pytest, pytest-django, pytest-cov
- **Image Processing**: Pillow

## Project Structure

```
backend/
├── core/                    # Django project settings
│   ├── settings.py         # Main settings file
│   └── urls.py             # URL routing
├── accounts/                # User authentication & management
│   ├── models.py           # Custom User model
│   ├── api/v1/             # Versioned API endpoints
│   │   ├── serializers.py  # User serializers
│   │   ├── view.py         # Auth views
│   │   └── urls.py         # Auth URL patterns
│   └── test/               # pytest tests
├── todos/                   # Task management app
│   ├── models.py           # Task, Category models
│   ├── api/v1/             # Versioned API endpoints
│   │   ├── serializers.py  # Task serializers
│   │   ├── views.py        # Task views
│   │   └── urls.py         # Task URL patterns
│   └── test/               # pytest tests
├── billing/                 # Billing & subscriptions (Polar.sh)
│   ├── models.py           # Product, Price, Subscription models
│   ├── admin.py            # Django admin for subscription management
│   ├── signals.py          # Auto-sync to Polar.sh
│   ├── services/           # Polar API integration
│   │   ├── polar_client.py # Polar SDK client
│   │   └── sync_service.py # Sync service
│   ├── webhooks/           # Webhook handlers
│   │   ├── handlers.py     # Webhook endpoint
│   │   └── processors.py   # Event processors
│   └── api/v1/             # Billing API endpoints
│       ├── serializers.py  # Billing serializers
│       ├── views.py        # Billing views
│       └── urls.py         # Billing URL patterns
├── common/                  # Shared utilities
│   └── utils.py            # Helper functions
├── requirements.txt         # Python dependencies
├── pytest.ini              # pytest configuration
└── manage.py
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- MySQL 5.7+ or MySQL 8.0+
- pip (Python package manager)

### 1. Create Virtual Environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt

# Install Polar SDK for billing integration
pip install polar-sdk
```

### 3. Database Setup

#### Create MySQL Database

```bash
mysql -u root -p -P 3309
```

```sql
CREATE DATABASE todolist CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'todolist'@'localhost' IDENTIFIED BY 'todolist1234';
GRANT ALL PRIVILEGES ON todolist.* TO 'todolist'@'localhost';
FLUSH PRIVILEGES;
SHOW DATABASES;
USE todolist;


```

#### Configure Database

Database configuration is stored in `dev.json`:

```json
{
    "DEBUG": true,
    "SECRET_KEY": "your-secret-key",
    "ALLOWED_HOSTS": ["*"],
    "DATABASES": {
        "default": {
            "ENGINE": "django.db.backends.mysql",
            "NAME": "dbraxis",
            "USER": "userraxis",
            "PASSWORD": "userraxis1234",
            "HOST": "localhost",
            "PORT": "3309",
            "OPTIONS": {}
        }
    }
}
```

### 4. Run Migrations

```bash
python manage.py migrate
```

### 5. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 6. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Base URL

All API endpoints are prefixed with `/api/v1/`

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register/
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "name": "string",
  "password": "string",
  "password_confirm": "string"
}
```

#### Login
```http
POST /api/v1/auth/login/
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### User Endpoints

All user endpoints require authentication (Bearer token in Authorization header).

#### Get Current User
```http
GET /api/v1/users/me/
Authorization: Bearer <access_token>
```

#### Update Profile
```http
PUT /api/v1/users/profile/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "string",
  "first_name": "string",
  "last_name": "string"
}
```

#### Change Password
```http
POST /api/v1/users/change-password/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "old_password": "string",
  "new_password": "string",
  "confirm_password": "string"
}
```

### Task Endpoints

All task endpoints require authentication.

#### List Tasks
```http
GET /api/v1/todos/
Authorization: Bearer <access_token>

# Query Parameters:
# - status: Filter by status (Not Started, In Progress, Completed)
# - priority: Filter by priority (Extreme, Moderate, Low)
# - category: Filter by category ID
# - search: Search in title and description
# - ordering: Sort by field (-created_at, priority, etc.)
# - page: Page number
```

#### Create Task
```http
POST /api/v1/todos/
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

{
  "title": "string (required)",
  "description": "string (required)",
  "priority": "Extreme|Moderate|Low (required)",
  "status": "Not Started|In Progress|Completed (optional)",
  "due_date": "YYYY-MM-DDTHH:mm:ssZ (optional)",
  "image": "file (optional)",
  "category": "integer (optional)"
}
```

#### Get Task
```http
GET /api/v1/todos/{id}/
Authorization: Bearer <access_token>
```

#### Update Task
```http
PUT /api/v1/todos/{id}/
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

{
  "title": "string",
  "description": "string",
  "priority": "Extreme|Moderate|Low",
  "status": "Not Started|In Progress|Completed",
  "due_date": "YYYY-MM-DDTHH:mm:ssZ",
  "image": "file (optional)",
  "category": "integer (optional)"
}
```

#### Delete Task
```http
DELETE /api/v1/todos/{id}/
Authorization: Bearer <access_token>
```

#### Get Task Statistics
```http
GET /api/v1/todos/statistics/
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "total": 10,
  "completed": 8,
  "in_progress": 1,
  "not_started": 1,
  "completed_percentage": 80.0,
  "in_progress_percentage": 10.0,
  "not_started_percentage": 10.0
}
```

### Category Endpoints

All category endpoints require authentication.

#### List Categories
```http
GET /api/v1/categories/
Authorization: Bearer <access_token>
```

#### Create Category
```http
POST /api/v1/categories/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "string (required)",
  "color": "string (optional, hex color, default: #FF6767)"
}
```

#### Get Category
```http
GET /api/v1/categories/{id}/
Authorization: Bearer <access_token>
```

#### Update Category
```http
PUT /api/v1/categories/{id}/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "string",
  "color": "string"
}
```

#### Delete Category
```http
DELETE /api/v1/categories/{id}/
Authorization: Bearer <access_token>
```

### Billing Endpoints

All billing endpoints require authentication except for listing products.

#### List Products
```http
GET /api/v1/billing/products/
# No authentication required - public endpoint

# Returns available subscription products with their prices
```

#### Get My Subscriptions
```http
GET /api/v1/billing/subscriptions/
Authorization: Bearer <access_token>

# Returns all subscriptions for the current user
```

#### Check Subscription Status
```http
GET /api/v1/billing/subscriptions/status/
Authorization: Bearer <access_token>

# Returns whether user has an active subscription
```

**Response:**
```json
{
  "has_active_subscription": true,
  "subscriptions": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "Premium Plan",
        "description": "Access to all features"
      },
      "price": {
        "price_amount": 999,
        "price_display": "$9.99",
        "interval_display": "per month"
      },
      "status": "active",
      "current_period_end": "2026-02-08T00:00:00Z",
      "is_active": true
    }
  ]
}
```

#### Create Checkout Session
```http
POST /api/v1/billing/checkout/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "product_id": 1,
  "price_id": 1,
  "success_url": "https://yourapp.com/success" (optional)
}
```

**Response:**
```json
{
  "checkout_url": "https://polar.sh/checkout/...",
  "subscription_id": 1
}
```

#### Cancel Subscription
```http
POST /api/v1/billing/subscriptions/{id}/cancel/
Authorization: Bearer <access_token>

# Cancels subscription at end of billing period
```

### Webhook Endpoints

#### Polar.sh Webhook
```http
POST /webhooks/polar/
Content-Type: application/json

# This endpoint receives webhook events from Polar.sh
# Configure this URL in your Polar.sh dashboard
# Headers required:
# - webhook-id
# - webhook-timestamp
# - webhook-signature
```

## Django Admin - Billing Management

The billing system can be fully managed from the Django admin panel:

1. **Products & Prices**: Create products and prices in admin
2. **Auto-Sync**: Changes are automatically synced to Polar.sh via Django signals
3. **Subscriptions**: View and manage all subscriptions
4. **Webhook Events**: Monitor incoming webhook events for debugging
5. **Manual Sync**: Use admin actions to manually sync products/prices if needed

### Creating a Subscription Product

1. Login to Django admin at `http://localhost:8000/admin/`
2. Go to **Billing > Polar Products**
3. Click **Add Polar Product**
4. Fill in product details (name, description, type)
5. Add prices inline (amount in cents, currency, interval)
6. Click **Save** - Product will auto-sync to Polar.sh
7. Check sync status in the product list

### Managing Subscriptions

Subscriptions are created when customers complete checkout. You can:
- View all subscriptions in admin
- Check subscription status and billing periods
- Cancel subscriptions
- View checkout URLs for pending subscriptions

## Testing

### Run All Tests

```bash
pytest
```

### Run Tests with Coverage

```bash
pytest --cov=todos --cov=accounts --cov-report=html
```

### Run Specific Test File

```bash
pytest accounts/test/test_api_auth.py
pytest todos/test/test_api.py
```

### Run Tests Verbosely

```bash
pytest -v
```

### Test Coverage Report

After running tests with coverage, open `htmlcov/index.html` in your browser to view the coverage report.

## Environment Variables

The backend uses `dev.json` for configuration. For production, create `prod.json` with similar structure but with `DEBUG: false`.

### Configuration File Structure (`dev.json`)

```json
{
    "DEBUG": true,
    "SECRET_KEY": "your-secret-key-here",
    "ALLOWED_HOSTS": ["*"],
    "DATABASES": {
        "default": {
            "ENGINE": "django.db.backends.mysql",
            "NAME": "dbraxis",
            "USER": "userraxis",
            "PASSWORD": "userraxis1234",
            "HOST": "localhost",
            "PORT": "3309",
            "OPTIONS": {}
        }
    },
    "POLAR_ACCESS_TOKEN": "polar_sandbox_...",
    "POLAR_WEBHOOK_SECRET": "whsec_...",
    "POLAR_SERVER_URL": "https://sandbox-api.polar.sh",
    "POLAR_ORGANIZATION_ID": "your-org-id"
}
```

### Polar.sh Configuration

To enable billing features, you need to configure Polar.sh:

1. **Create a Polar.sh Account**: Sign up at [https://polar.sh](https://polar.sh)
2. **Get API Credentials**:
   - Go to Settings > API Keys
   - Create a new API key for development (sandbox)
   - Copy the access token (starts with `polar_sandbox_`)
3. **Setup Webhook Secret**:
   - Go to Settings > Webhooks
   - Create a new webhook endpoint: `https://your-domain.com/webhooks/polar/`
   - Copy the webhook secret (starts with `whsec_`)
4. **Get Organization ID**:
   - Find your organization ID in the Polar dashboard URL
5. **Update `dev.json`** with your credentials

**Important**: For production, use production API keys (start with `polar_` instead of `polar_sandbox_`) and update `POLAR_SERVER_URL` to `https://api.polar.sh`

## CORS Configuration

CORS is configured to allow requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative dev port)

To add more origins, update `CORS_ALLOWED_ORIGINS` in `core/settings.py`.

## Media Files

Uploaded images are stored in the `media/` directory:
- Task images: `media/tasks/`
- Media URL: `/media/`

In development, media files are served automatically. In production, configure your web server to serve media files.

## Security Considerations

1. **Authentication**: All endpoints except login/register require JWT authentication
2. **Authorization**: Users can only access their own tasks and categories
3. **Input Validation**: All inputs are validated on the backend
4. **File Upload Security**: 
   - File types are validated (JPEG, PNG, GIF, WebP)
   - File size is limited (5MB max)
5. **CORS**: Configured for specific origins only
6. **Token Expiration**: Access tokens expire in 60 minutes, refresh tokens in 24 hours

## Database Migrations

### Create Migrations

```bash
python manage.py makemigrations
```

### Apply Migrations

```bash
python manage.py migrate
```

### Check Migration Status

```bash
python manage.py showmigrations
```

## Admin Interface

Access the Django admin interface at `http://localhost:8000/admin/`

Login with your superuser credentials to manage:
- Users
- Tasks
- Categories

## Troubleshooting

### Database Connection Issues

1. Verify MySQL is running
2. Check database credentials in `dev.json`
3. Ensure database exists: `SHOW DATABASES;`
4. Verify user permissions: `SHOW GRANTS FOR 'userraxis'@'localhost';`

### Migration Issues

```bash
# Reset migrations (use with caution)
python manage.py migrate --fake-initial

# Show migration status
python manage.py showmigrations
```

### Import Errors

Ensure virtual environment is activated and dependencies are installed:

```bash
pip install -r requirements.txt
```

## API Documentation

For detailed API documentation, see `frontend/BACKEND_API_DOCUMENTATION.md`

## License

MIT



