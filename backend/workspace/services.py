from rest_framework.exceptions import NotFound, ValidationError

from workspace.models import Node


def get_owned(owner, node_id):
    try:
        return Node.objects.get(id=node_id, owner=owner)
    except Node.DoesNotExist:
        raise NotFound("Datoteka ili mapa ne postoji.")


def get_owned_folder(owner, folder_id):
    if folder_id is None:
        return None
    node = get_owned(owner, folder_id)
    if not node.is_folder:
        raise ValidationError({"detail": "Odredište nije mapa."})
    return node


def name_taken(owner, parent_id, name, exclude_id=None):
    qs = Node.objects.filter(owner=owner, parent_id=parent_id, name=name)
    if exclude_id is not None:
        qs = qs.exclude(id=exclude_id)
    return qs.exists()


def build_tree(owner):
    from workspace.serializers import NodeSerializer

    nodes = list(Node.objects.filter(owner=owner))
    items = {}
    for n in nodes:
        item = NodeSerializer(n).data
        if n.is_folder:
            item["djeca"] = []
        items[n.id] = item

    roots = []
    for n in nodes:
        if n.parent_id in items:
            items[n.parent_id]["djeca"].append(items[n.id])
        else:
            roots.append(items[n.id])

    def sort(lst):
        lst.sort(key=lambda x: (x["tip"] != "mapa", x["naziv"].lower()))
        for x in lst:
            if "djeca" in x:
                sort(x["djeca"])

    sort(roots)
    return roots


def free_name(owner, parent_id, name):
    candidate, i = name, 1
    while name_taken(owner, parent_id, candidate):
        candidate = f"{name} ({i})"
        i += 1
    return candidate


def name_from_filename(filename):
    base = (filename or "").replace("\\", "/").rsplit("/", 1)[-1].strip()
    stem = base.rsplit(".", 1)[0] if "." in base else base
    return stem.strip() or "Zapis"
