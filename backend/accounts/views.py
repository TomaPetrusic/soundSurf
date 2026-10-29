from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import BioTooLongError
from accounts.serializers import UserProfileSerializer, UserProfileUpdateSerializer


class MeView(APIView):
    """
    GET: returns the signed-in user's profile (created on first call, if
    this is their first successful login).
    PATCH: updates the 'bio' ("O meni") field.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserProfileSerializer(request.user).data)

    def patch(self, request):
        serializer = UserProfileUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        profile = request.user
        try:
            profile.update_bio(serializer.validated_data["bio"])
        except BioTooLongError as exc:
            return Response({"detail": str(exc)}, status=400)

        return Response(UserProfileSerializer(profile).data)
