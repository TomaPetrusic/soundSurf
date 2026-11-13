from django.db import IntegrityError, transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from workspace import audio, conf, services
from workspace.models import Node
from workspace.serializers import FolderCreateSerializer, NodeSerializer, UploadSerializer
from workspace.storage import get_storage, new_storage_key


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


class FormatsView(APIView):
    def get(self, request):
        return Response({
            "formati": [{"format": f, "mime": audio.mime_type(f)} for f in audio.FORMATS],
            "max_mb": conf.MAX_UPLOAD_MB,
        })


class FileUploadView(APIView):
    def post(self, request):
        s = UploadSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        upload, parent_id = s.validated_data["datoteka"], s.validated_data["roditelj"]
        services.get_owned_folder(request.user, parent_id)

        if upload.size > conf.MAX_UPLOAD_MB * 1024 * 1024:
            return Response({"detail": f"Datoteka je veća od {conf.MAX_UPLOAD_MB} MB."},
                            status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE)
        data = upload.read()
        try:
            info = audio.inspect(data)
        except audio.AudioError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)

        node = save_new_file(request.user, parent_id, services.name_from_filename(upload.name),
                             data, info, Node.Origin.UPLOAD)
        return Response(NodeSerializer(node).data, status=status.HTTP_201_CREATED)


def save_new_file(owner, parent_id, name, data, info, origin):
    storage = get_storage()
    key = new_storage_key(owner, info["format"])
    storage.upload(key, data, audio.mime_type(info["format"]))
    try:
        with transaction.atomic():
            return Node.objects.create(
                owner=owner, parent_id=parent_id, kind=Node.Kind.FILE,
                name=services.free_name(owner, parent_id, name),
                storage_key=key, size_bytes=len(data), origin=origin, **info,
            )
    except Exception:
        storage.remove([key])
        raise
