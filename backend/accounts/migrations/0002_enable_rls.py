from django.db import migrations

# Enables Row Level Security (no policies) on every table Django has
# created so far in the "public" schema -- including django_migrations
# itself and any future tables from other apps, since this loops over
# pg_tables rather than naming tables individually. Django connects to
# Postgres as the table owner, so RLS does not block Django's own
# queries; it only blocks Supabase's Data API (anon/authenticated
# roles), which is the point: frontend code can never read/write these
# tables directly through Supabase, only through the Django API.
ENABLE_RLS_SQL = """
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    END LOOP;
END $$;
"""

# No inverse: disabling RLS again is not a meaningful "undo" for a
# security control, and every table this enables it on still has no
# policies attached, so nothing reads as broken if this migration is
# never reversed.
DISABLE_RLS_SQL = """
SELECT 1;
"""


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.RunSQL(ENABLE_RLS_SQL, reverse_sql=DISABLE_RLS_SQL),
    ]
