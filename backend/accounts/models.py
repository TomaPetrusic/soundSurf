from django.db import models


class BioTooLongError(ValueError):
    """Raised when a 'bio' edit exceeds UserProfile.BIO_MAX_LENGTH."""


class UserProfile(models.Model):
    """
    A ProAudio user, created on first Google sign-in (there is no
    separate registration step -- the first successful login via
    Supabase Auth is the registration).
    """

    BIO_MAX_LENGTH = 500

    supabase_user_id = models.UUIDField(unique=True)
    email = models.EmailField()
    display_name = models.CharField(max_length=255, blank=True)
    bio = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Not a Django auth user, but DRF's IsAuthenticated permission only
    # needs this attribute on whatever authenticate() returns.
    is_authenticated = True

    def __str__(self):
        return self.display_name or self.email

    def update_bio(self, text):
        text = text or ""
        if len(text) > self.BIO_MAX_LENGTH:
            raise BioTooLongError(
                f"Tekst 'O meni' ne može imati više od {self.BIO_MAX_LENGTH} znakova."
            )
        self.bio = text
        self.save(update_fields=["bio", "updated_at"])
