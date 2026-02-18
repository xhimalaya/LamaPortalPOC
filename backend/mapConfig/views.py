from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import MapLayerModel, LegendConfigModel
from .serializers import MapLayerSerializer, LegendConfigSerializer


class ListLayerView(APIView):
    def get(self, request):
        layers = MapLayerModel.objects.all()
        serializer = MapLayerSerializer(layers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LegendByLayerNameView(APIView):
    def get(self, request, pk):
        try:
            layer = MapLayerModel.objects.get(layerName=pk)
        except MapLayerModel.DoesNotExist:
            return Response(
                {"error": "Layer not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        legends = LegendConfigModel.objects.filter(layer=layer)
        serializer = LegendConfigSerializer(
            legends,
            many=True,
            context={"request": request}
        )

        return Response(serializer.data, status=status.HTTP_200_OK)
