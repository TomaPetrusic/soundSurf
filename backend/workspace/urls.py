from django.urls import path

from workspace import views

urlpatterns = [
    path("workspace/tree/", views.TreeView.as_view(), name="workspace-tree"),
    path("workspace/folders/", views.FolderCreateView.as_view(), name="workspace-folder-create"),
    path("workspace/formats/", views.FormatsView.as_view(), name="workspace-formats"),
    path("workspace/files/", views.FileUploadView.as_view(), name="workspace-file-upload"),
    path("workspace/files/<int:node_id>/download/", views.FileDownloadView.as_view(), name="workspace-file-download"),
    path("workspace/files/<int:node_id>/url/", views.FileUrlView.as_view(), name="workspace-file-url"),
    path("workspace/files/<int:node_id>/content/", views.FileContentView.as_view(), name="workspace-file-content"),
]
