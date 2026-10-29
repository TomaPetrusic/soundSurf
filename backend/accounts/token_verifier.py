"""
Verification of Supabase-issued access tokens (JWTs).

Deliberately independent of Django/DRF so it can be unit-tested and
swapped out on its own (e.g. against a mocked JWKS endpoint).
"""

import jwt
from jwt import PyJWKClient

EXPECTED_AUDIENCE = "authenticated"


class TokenVerificationError(Exception):
    """Raised when a token is missing, malformed, expired, or forged."""


class SupabaseTokenVerifier:
    """
    Verifies a Supabase Auth access token's signature and claims.

    Primary path: fetch the project's public signing keys from its JWKS
    endpoint and verify against those (works for both RS256 and the
    newer ES256 Supabase signing keys).

    Fallback path: if the project still uses the legacy shared HS256 JWT
    secret, pass it as `jwt_secret` and it is tried if JWKS verification
    fails.
    """

    def __init__(self, supabase_url, jwt_secret=None):
        self._jwks_url = f"{supabase_url}/auth/v1/.well-known/jwks.json"
        self._jwt_secret = jwt_secret
        self._jwk_client = PyJWKClient(self._jwks_url)

    def verify(self, token):
        if not token:
            raise TokenVerificationError("Token je prazan.")

        try:
            return self._verify_with_jwks(token)
        except TokenVerificationError:
            if self._jwt_secret:
                return self._verify_with_shared_secret(token)
            raise

    def _verify_with_jwks(self, token):
        try:
            signing_key = self._jwk_client.get_signing_key_from_jwt(token)
            return jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256", "ES256"],
                audience=EXPECTED_AUDIENCE,
            )
        except jwt.PyJWTError as exc:
            raise TokenVerificationError(f"Neispravan token (JWKS): {exc}") from exc

    def _verify_with_shared_secret(self, token):
        try:
            return jwt.decode(
                token,
                self._jwt_secret,
                algorithms=["HS256"],
                audience=EXPECTED_AUDIENCE,
            )
        except jwt.PyJWTError as exc:
            raise TokenVerificationError(f"Neispravan token (HS256): {exc}") from exc
