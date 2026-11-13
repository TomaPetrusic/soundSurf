from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("workspace", "0002_enable_rls"),
    ]

    operations = [
        migrations.AddField(
            model_name="node",
            name="origin",
            field=models.CharField(
                blank=True,
                choices=[
                    ("upload", "Upload"),
                    ("freesound", "Freesound"),
                    ("generated", "Generated"),
                    ("copy", "Copy"),
                ],
                default="",
                max_length=10,
            ),
        ),
    ]
