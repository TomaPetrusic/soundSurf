from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("workspace", "0001_initial"),
    ]

    operations = [
        migrations.RunSQL(
            "ALTER TABLE workspace_node ENABLE ROW LEVEL SECURITY;",
            reverse_sql="ALTER TABLE workspace_node DISABLE ROW LEVEL SECURITY;",
        ),
    ]
