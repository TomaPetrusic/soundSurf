import logging

from django.db import transaction

from workspace import audio, conf, services
from workspace.models import Node, Workspace
from workspace.storage import get_storage

log = logging.getLogger(__name__)

SAMPLES_FOLDER = "Primjeri"
SAMPLES_COUNT = 3
AUDIO_EXTENSIONS = (".wav", ".mp3", ".flac")


def ensure_workspace(owner):
    with transaction.atomic():
        _, created = Workspace.objects.get_or_create(owner=owner)
    if created:
        _copy_samples(owner)


def _copy_samples(owner):
    from workspace.views import save_new_file

    storage = get_storage()
    try:
        keys = [k for k in storage.list(conf.SAMPLES_PREFIX) if k.lower().endswith(AUDIO_EXTENSIONS)]
    except Exception:
        log.exception("Popis početnih zapisa nije dostupan")
        return
    keys = keys[:SAMPLES_COUNT]
    if not keys:
        log.warning("U bucketu nema zvukovnih datoteka u '%s/'.", conf.SAMPLES_PREFIX)
        return

    folder = Node.objects.create(
        owner=owner, parent=None, kind=Node.Kind.FOLDER,
        name=services.free_name(owner, None, SAMPLES_FOLDER),
    )
    for key in keys:
        try:
            data = storage.download(key)
            save_new_file(owner, folder.id, services.name_from_filename(key), data,
                          audio.inspect(data), Node.Origin.UPLOAD)
        except Exception:
            log.exception("Početni zapis %s nije kopiran", key)
