from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from accounts.models import UserProfile
from accounts.token_verifier import SupabaseTokenVerifier, TokenVerificationError

_verifier = None


def _get_verifier():
    global _verifier
    if _verifier is None:
        _verifier = SupabaseTokenVerifier(
            supabase_url=settings.SUPABASE_URL,
            jwt_secret=settings.SUPABASE_JWT_SECRET,
        )
    return _verifier


class SupabaseJWTAuthentication(BaseAuthentication):
    """
    Authenticates requests carrying `Authorization: Bearer <supabase JWT>`.

    On a token seen for the first time, creates the matching UserProfile
    (first login = registration). Returns None (no credentials supplied)
    when there is no Authorization header at all, and raises
    AuthenticationFailed for a present-but-invalid token -- both end up
    as HTTP 401 thanks to authenticate_header() below.
    """

    def authenticate(self, request):
        header = request.META.get("HTTP_AUTHORIZATION", "")
        if not header:
            return None
        if not header.startswith("Bearer "):
            raise AuthenticationFailed("Zaglavlje Authorization mora biti oblika 'Bearer <token>'.")

        token = header[len("Bearer "):].strip()
        try:
            claims = _get_verifier().verify(token)
        except TokenVerificationError as exc:
            raise AuthenticationFailed(str(exc)) from exc

        profile = self._get_or_create_profile(claims)
        return (profile, claims)

    def authenticate_header(self, request):
        return "Bearer"

    @staticmethod
    def _get_or_create_profile(claims):
        supabase_user_id = claims.get("sub")
        if not supabase_user_id:
            raise AuthenticationFailed("Token nema 'sub' tvrdnju (claim).")

        user_metadata = claims.get("user_metadata") or {}
        display_name = user_metadata.get("full_name") or user_metadata.get("name") or ""

        profile, _created = UserProfile.objects.get_or_create(
            supabase_user_id=supabase_user_id,
            defaults={
                "email": claims.get("email", ""),
                "display_name": display_name,
            },
        )
        return profile
