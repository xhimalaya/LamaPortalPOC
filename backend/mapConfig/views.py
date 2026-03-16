from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import MapCollectionModel, LayerTilesThemeModel
from .serializers import MapCollectionSerializer, LayerTilesThemeSerializer


class MapCollectionListAPIView(generics.ListAPIView):
    serializer_class = MapCollectionSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        return MapCollectionModel.objects.prefetch_related(
            "layers",
            "legends"
        )


class CollectionLayersListAPIView(generics.ListAPIView):
    serializer_class = LayerTilesThemeSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        collection_id = self.kwargs.get('collection_id')
        print(">"*60)
        print(collection_id)
        print("<"*60)
        return LayerTilesThemeModel.objects.filter(
            id=collection_id
        )