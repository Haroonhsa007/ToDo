import json
from pathlib import Path


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# # read the json file 
# with open(BASE_DIR / 'dev.json', 'r') as f:
#     config = json.load(f)

# read the json file 
with open(BASE_DIR / 'prod.json', 'r') as f:
    config = json.load(f)

SECRET_KEY = config['SECRET_KEY']

DEBUG = config['DEBUG']

ALLOWED_HOSTS = config['ALLOWED_HOSTS']


INSTALLED_APPS = [
    # Django Unfold must be before django.contrib.admin
    "unfold",  # Modern Django admin theme
    
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party apps
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    
    # Local apps
    "accounts",
    "todos",
    "billing",
]

# Use custom user model from accounts app
AUTH_USER_MODEL = "accounts.User"

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Add this - must be after SecurityMiddleware
    'corsheaders.middleware.CorsMiddleware',  # CORS middleware - should be early
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': config['DATABASES']['default']['ENGINE'],
        'NAME': config['DATABASES']['default']['NAME'],
        'USER': config['DATABASES']['default']['USER'],
        'PASSWORD': config['DATABASES']['default']['PASSWORD'],
        'HOST': config['DATABASES']['default']['HOST'],
        'PORT': config['DATABASES']['default']['PORT'],
        'OPTIONS': config['DATABASES']['default'].get('OPTIONS', {}),
    }
}


# Password validation
# https://docs.djangoproject.com/en/6.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/6.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.0/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'

# WhiteNoise Configuration for Production
# Use CompressedManifestStaticFilesStorage for optimal performance:
# - Compresses files (gzip/brotli) to reduce bandwidth
# - Generates manifest files for cache busting
# - Only works when DEBUG=False (production)

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
# if not DEBUG:
#     STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
# else:
#     # In development, use regular storage
#     STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

# WhiteNoise optimization settings
WHITENOISE_USE_FINDERS = True  # Allow WhiteNoise to find static files in development
WHITENOISE_AUTOREFRESH = DEBUG  # Auto-refresh in development mode
WHITENOISE_MANIFEST_STRICT = False  # Don't raise errors if manifest file is missing
WHITENOISE_MAX_AGE = 31536000  # Cache static files for 1 year (in seconds)

# ============================================================================
# Django Unfold Configuration
# ============================================================================

UNFOLD = {
    "SITE_TITLE": "TODO Admin",
    "SITE_HEADER": "TODO Administration",
    "SITE_URL": "/",
    "SITE_SYMBOL": "settings",
    "SHOW_HISTORY": True,
    "SHOW_VIEW_ON_SITE": True,
    "ENVIRONMENT": "TODO Backend v2",
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": True,
    },
}

# ============================================================================
# CORS Configuration
# ============================================================================

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Alternative dev port
    "https://9002b16214dc.ngrok-free.app",
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# ============================================================================
# REST Framework Configuration
# ============================================================================

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': [
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}

# ============================================================================
# JWT Configuration
# ============================================================================

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}

# ============================================================================
# Media Files Configuration
# ============================================================================

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Maximum upload size (5MB)
DATA_UPLOAD_MAX_MEMORY_SIZE = 5242880
FILE_UPLOAD_MAX_MEMORY_SIZE = 5242880

# Allowed image types
ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

# ============================================================================
# Polar.sh Configuration
# ============================================================================

# Polar API credentials
POLAR_ACCESS_TOKEN = config.get('POLAR_ACCESS_TOKEN', 'polar_oat_7zlmrd0C1sB1iFSlfTSNkOrHTV053Da5NaPPs0xhxZh')
POLAR_WEBHOOK_SECRET = config.get('POLAR_WEBHOOK_SECRET', 'polar_whs_QLyXd9vsHoIJBB8le7s7oKMqZPmokrIoEjjwF1b5X4x')

# Polar server URL (sandbox or production)
# Sandbox: https://sandbox-api.polar.sh
# Production: https://api.polar.sh
POLAR_SERVER_URL = config.get('POLAR_SERVER_URL', 'https://sandbox-api.polar.sh')

# Polar organization ID (your organization on Polar)
POLAR_ORGANIZATION_ID = config.get('POLAR_ORGANIZATION_ID', 'b1590d2a-96e0-45ed-ac79-b002a5873889')
