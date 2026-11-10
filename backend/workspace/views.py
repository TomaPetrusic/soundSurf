from django.db import IntegrityError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from workspace import services
from workspace.models import Node
from workspace.serializers import FolderCreateSerializer, NodeSerializer


NAME_TAKEN_MSG = "Stavka s nazivom '{}' već postoji u ovoj mapi."


def _conflict(name):
    return Response({"detail": NAME_TAKEN_MSG.format(name)}, status=status.HTTP_409_CONFLICT)


class TreeView(APIView):
    def get(self, request):
        return Response(services.build_tree(request.user))


class FolderCreateView(APIView):
    def post(self, request):
        s = FolderCreateSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        name, parent_id = s.validated_data["naziv"], s.validated_data["roditelj"]

        services.get_owned_folder(request.user, parent_id)
        if services.name_taken(request.user, parent_id, name):
            return _conflict(name)
        try:
            node = Node.objects.create(owner=request.user, parent_id=parent_id,
                                       name=name, kind=Node.Kind.FOLDER)
        except IntegrityError:
            return _conflict(name)
        return Response(NodeSerializer(node).data, status=status.HTTP_201_CREATED)
