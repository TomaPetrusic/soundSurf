from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("workspace", "0004_workspace"),
    ]

    operations = [
        migrations.RunSQL(
            "ALTER TABLE workspace_workspace ENABLE ROW LEVEL SECURITY;",
            reverse_sql="ALTER TABLE workspace_workspace DISABLE ROW LEVEL SECURITY;",
        ),
    ]
