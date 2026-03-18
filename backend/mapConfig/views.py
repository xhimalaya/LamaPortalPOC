from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response

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
    

class LayerTilesThemeListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        ids = request.query_params.get('ids')

        if not ids:
            return Response(
                {"error": "ids query param is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            id_list = [int(i) for i in ids.split(',')]
        except ValueError:
            return Response(
                {"error": "ids must be integers"},
                status=status.HTTP_400_BAD_REQUEST
            )
        layers = LayerTilesThemeModel.objects.filter(id__in=id_list)
        serializer = LayerTilesThemeSerializer(layers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)