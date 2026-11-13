from rest_framework import serializers

from workspace.models import Node


def validate_name(value):
    value = (value or "").strip()
    if not value:
        raise serializers.ValidationError("Naziv ne smije biti prazan.")
    if "/" in value or "\\" in value:
        raise serializers.ValidationError("Naziv ne smije sadržavati znakove / i \\.")
    if value in (".", ".."):
        raise serializers.ValidationError("Nedopušten naziv.")
    return value


class NodeSerializer(serializers.ModelSerializer):
    naziv = serializers.CharField(source="name")
    tip = serializers.SerializerMethodField()
    roditelj = serializers.IntegerField(source="parent_id", allow_null=True)
    velicina = serializers.IntegerField(source="size_bytes")
    trajanje = serializers.FloatField(source="duration_sec")
    kanali = serializers.IntegerField(source="channels")
    stvoreno = serializers.DateTimeField(source="created_at")
    izmijenjeno = serializers.DateTimeField(source="updated_at")
    porijeklo = serializers.CharField(source="origin")

    class Meta:
        model = Node
        fields = ["id", "naziv", "tip", "format", "roditelj", "velicina", "trajanje",
                  "sample_rate", "kanali", "porijeklo", "stvoreno", "izmijenjeno"]

    def get_tip(self, node):
        return "mapa" if node.is_folder else "datoteka"


class FolderCreateSerializer(serializers.Serializer):
    naziv = serializers.CharField(max_length=255, allow_blank=True)
    roditelj = serializers.IntegerField(required=False, allow_null=True, default=None)

    def validate_naziv(self, value):
        return validate_name(value)


class UploadSerializer(serializers.Serializer):
    datoteka = serializers.FileField()
    roditelj = serializers.IntegerField(required=False, allow_null=True, default=None)
