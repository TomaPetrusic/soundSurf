from django.urls import path

from workspace import views

urlpatterns = [
    path("workspace/tree/", views.TreeView.as_view(), name="workspace-tree"),
    path("workspace/folders/", views.FolderCreateView.as_view(), name="workspace-folder-create"),
]
