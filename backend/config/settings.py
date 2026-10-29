"""
Django settings for the ProAudio backend.

Minimal skeleton: a JSON API (Django REST Framework) authenticated with
Supabase-issued JWTs, serving the built React frontend as static files
in production (see core/urls.py is not needed for that -- WhiteNoise
serves frontend_dist/ directly, see WHITENOISE_ROOT below).
"""

import os
import re
from pathlib import Path
from urllib.parse import quote

import dj_database_url
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Loads backend/.env for local development. In production (Railway) the
# environment variables are injected directly, so this is a no-op there.
load_dotenv(BASE_DIR / ".env")


def _env_list(name, default=""):
    raw = os.environ.get(name, default)
    return [item.strip() for item in raw.split(",") if item.strip()]


def _env_bool(name, default=False):
    raw = os.environ.get(name)
    if raw is None:
        return default
    return raw.strip().lower() in ("1", "true", "yes", "on")


_DATABASE_URL_RE = re.compile(
    r"^(?P<scheme>[a-zA-Z][a-zA-Z0-9+]*)://"
    r"(?P<user>[^:@/]+):(?P<password>.*)@(?P<rest>.+)$"
)


def _normalize_database_url(raw):
    """
    Percent-encodes the user/password of a DATABASE_URL so a literal
    '%' or '/' in a Supabase-generated password doesn't break URL
    parsing (Supabase passwords are not percent-encoded by default).
    """
    match = _DATABASE_URL_RE.match(raw)
    if not match:
        return raw
    scheme, user, password, rest = match.group("scheme", "user", "password", "rest")
    return f"{scheme}://{quote(user, safe='')}:{quote(password, safe='')}@{rest}"


SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "dev-insecure-secret-key-change-me")
DEBUG = _env_bool("DJANGO_DEBUG", default=False)

ALLOWED_HOSTS = _env_list("ALLOWED_HOSTS", "localhost,127.0.0.1")
CSRF_TRUSTED_ORIGINS = _env_list("CSRF_TRUSTED_ORIGINS", "")

INSTALLED_APPS = [
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "accounts",
    "core",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# Database: PostgreSQL hosted on Supabase, reached through DATABASE_URL.
DATABASES = {
    "default": dj_database_url.parse(
        _normalize_database_url(os.environ["DATABASE_URL"]),
        conn_max_age=600,
        ssl_require=True,
    )
}

AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = "hr"
TIME_ZONE = "Europe/Zagreb"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles_collected"

# The built React app (frontend/dist, copied here at Docker build time).
# WHITENOISE_ROOT serves every file under it at the matching URL path
# (e.g. /assets/index-abc123.js), and WHITENOISE_INDEX_FILE makes "/"
# serve frontend_dist/index.html -- this is how the single Railway
# service serves the SPA without a separate static host.
FRONTEND_DIST = BASE_DIR / "frontend_dist"
WHITENOISE_ROOT = FRONTEND_DIST if FRONTEND_DIST.exists() else None
WHITENOISE_INDEX_FILE = "index.html"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Local development only: the Vite dev server runs on a different origin.
# In production the frontend is served by this same Django service, so
# there is no cross-origin request and CORS is irrelevant there.
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "accounts.authentication.SupabaseJWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    # No django.contrib.auth here (UserProfile isn't a Django auth user,
    # see accounts.authentication) -- DRF's own AnonymousUser default
    # would otherwise require django.contrib.contenttypes/auth installed.
    "UNAUTHENTICATED_USER": None,
}

# Supabase project settings, used to verify JWTs issued by Supabase Auth.
SUPABASE_URL = os.environ["SUPABASE_URL"].rstrip("/")
if SUPABASE_URL.endswith("/rest/v1"):
    SUPABASE_URL = SUPABASE_URL[: -len("/rest/v1")]
# Optional: only needed if the Supabase project still signs JWTs with the
# legacy shared HS256 secret instead of the newer JWKS-based signing keys.
SUPABASE_JWT_SECRET = os.environ.get("SUPABASE_JWT_SECRET") or None
