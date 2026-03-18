from django.urls import path
from .views import *

urlpatterns = [
    path('collections/', MapCollectionListAPIView.as_view(), name='collection-list'),
    path('layers/<str:collection_id>/', CollectionLayersListAPIView.as_view(), name='collection-layers-list'),
     path('layers', LayerTilesThemeListView.as_view(), name='layers-list'),
]
