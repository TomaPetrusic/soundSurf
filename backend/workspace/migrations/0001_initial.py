import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("accounts", "0002_enable_rls"),
    ]

    operations = [
        migrations.CreateModel(
            name="Node",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                (
                    "kind",
                    models.CharField(
                        choices=[("folder", "Mapa"), ("file", "Datoteka")],
                        max_length=10,
                    ),
                ),
                (
                    "format",
                    models.CharField(
                        blank=True,
                        choices=[("WAV", "Wav"), ("MP3", "Mp3"), ("FLAC", "Flac")],
                        default="",
                        max_length=10,
                    ),
                ),
                (
                    "storage_key",
                    models.CharField(
                        blank=True, max_length=512, null=True, unique=True
                    ),
                ),
                ("size_bytes", models.BigIntegerField(blank=True, null=True)),
                ("duration_sec", models.FloatField(blank=True, null=True)),
                ("sample_rate", models.IntegerField(blank=True, null=True)),
                ("channels", models.IntegerField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="workspace_nodes",
                        to="accounts.userprofile",
                    ),
                ),
                (
                    "parent",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="children",
                        to="workspace.node",
                    ),
                ),
            ],
            options={
                "indexes": [
                    models.Index(
                        fields=["owner", "parent"],
                        name="workspace_n_owner_i_41c4af_idx",
                    )
                ],
            },
        ),
        migrations.AddConstraint(
            model_name="node",
            constraint=models.UniqueConstraint(
                fields=("owner", "parent", "name"),
                name="workspace_node_unique_name_in_folder",
                nulls_distinct=False,
            ),
        ),
        migrations.AddConstraint(
            model_name="node",
            constraint=models.CheckConstraint(
                check=models.Q(
                    ("kind", "folder"), ("storage_key__isnull", False), _connector="OR"
                ),
                name="workspace_node_file_has_storage_key",
            ),
        ),
    ]
