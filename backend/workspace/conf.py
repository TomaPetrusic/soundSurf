import os

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
if SUPABASE_URL.endswith("/rest/v1"):
    SUPABASE_URL = SUPABASE_URL[: -len("/rest/v1")]

SUPABASE_SECRET_KEY = os.environ.get("SUPABASE_SECRET_KEY", "")

STORAGE_BUCKET = os.environ.get("STORAGE_BUCKET", "audio-files")

STORAGE_BACKEND = os.environ.get("WORKSPACE_STORAGE_BACKEND", "supabase")
