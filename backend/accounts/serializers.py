from rest_framework import serializers

from accounts.models import UserProfile


class UserProfileSerializer(serializers.Serializer):
    display_name = serializers.CharField(allow_blank=True)
    email = serializers.EmailField(allow_blank=True)
    bio = serializers.CharField(allow_blank=True)


class UserProfileUpdateSerializer(serializers.Serializer):
    bio = serializers.CharField(
        allow_blank=True,
        max_length=UserProfile.BIO_MAX_LENGTH,
        error_messages={
            "max_length": f"Tekst 'O meni' ne može imati više od {UserProfile.BIO_MAX_LENGTH} znakova.",
        },
    )
