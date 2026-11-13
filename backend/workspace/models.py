from django.db import models
from django.db.models import Q


class Node(models.Model):
    class Kind(models.TextChoices):
        FOLDER = "folder", "Mapa"
        FILE = "file", "Datoteka"

    class Format(models.TextChoices):
        WAV = "WAV"
        MP3 = "MP3"
        FLAC = "FLAC"

    class Origin(models.TextChoices):
        UPLOAD = "upload"
        FREESOUND = "freesound"
        GENERATED = "generated"
        COPY = "copy"

    owner = models.ForeignKey(
        "accounts.UserProfile", on_delete=models.CASCADE, related_name="workspace_nodes"
    )
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="children"
    )
    name = models.CharField(max_length=255)
    kind = models.CharField(max_length=10, choices=Kind.choices)

    format = models.CharField(max_length=10, choices=Format.choices, blank=True, default="")
    storage_key = models.CharField(max_length=512, unique=True, null=True, blank=True)
    size_bytes = models.BigIntegerField(null=True, blank=True)
    duration_sec = models.FloatField(null=True, blank=True)
    sample_rate = models.IntegerField(null=True, blank=True)
    channels = models.IntegerField(null=True, blank=True)
    origin = models.CharField(max_length=10, choices=Origin.choices, blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["owner", "parent", "name"],
                name="workspace_node_unique_name_in_folder",
                nulls_distinct=False,
            ),
            models.CheckConstraint(
                check=Q(kind="folder") | Q(storage_key__isnull=False),
                name="workspace_node_file_has_storage_key",
            ),
        ]
        indexes = [models.Index(fields=["owner", "parent"])]

    def __str__(self):
        return f"{self.name} ({self.kind})"

    @property
    def is_folder(self):
        return self.kind == self.Kind.FOLDER

