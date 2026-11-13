import uuid
from pathlib import Path

from workspace import conf


def new_storage_key(owner, fmt):
    return f"{owner.supabase_user_id}/{uuid.uuid4().hex}.{fmt.lower()}"


class SupabaseStorage:
    def __init__(self):
        from supabase import create_client

        if not (conf.SUPABASE_URL and conf.SUPABASE_SECRET_KEY):
            raise RuntimeError("Za Storage trebaju SUPABASE_URL i SUPABASE_SECRET_KEY u .env")
        client = create_client(conf.SUPABASE_URL, conf.SUPABASE_SECRET_KEY)
        self.bucket = client.storage.from_(conf.STORAGE_BUCKET)

    def upload(self, key, data, content_type):
        self.bucket.upload(key, data, {"content-type": content_type, "upsert": "false"})

    def download(self, key):
        return self.bucket.download(key)

    def remove(self, keys):
        for i in range(0, len(keys), 100):
            self.bucket.remove(keys[i:i + 100])

    def signed_url(self, key, expires_in):
        res = self.bucket.create_signed_url(key, expires_in)
        return res.get("signedURL") or res.get("signedUrl")


class LocalStorage:
    def __init__(self, root=None):
        self.root = Path(root or Path(__file__).resolve().parent.parent / "local_storage")
        self.root.mkdir(parents=True, exist_ok=True)

    def _path(self, key):
        p = (self.root / key).resolve()
        if self.root.resolve() not in p.parents:
            raise ValueError("Neispravan ključ")
        return p

    def upload(self, key, data, content_type):
        p = self._path(key)
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(data)

    def download(self, key):
        return self._path(key).read_bytes()

    def remove(self, keys):
        for k in keys:
            self._path(k).unlink(missing_ok=True)

    def signed_url(self, key, expires_in):
        return self._path(key).as_uri()


_storage = None


def get_storage():
    global _storage
    if _storage is None:
        _storage = LocalStorage() if conf.STORAGE_BACKEND == "local" else SupabaseStorage()
    return _storage
