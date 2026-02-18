from rest_framework import serializers
from .models import MapLayerModel, LegendConfigModel


class MapLayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = MapLayerModel
        fields = "__all__"
    

class LegendConfigSerializer(serializers.ModelSerializer):
    legend_image_url = serializers.SerializerMethodField()

    class Meta:
        model = LegendConfigModel
        fields = "__all__"

    def get_legend_image_url(self, obj):
        request = self.context.get("request")
        if obj.legend_image and request:
            return request.build_absolute_uri(obj.legend_image.url)
        return None
