from rest_framework import serializers
from .models import (
    LayerTilesThemeModel,
    LegendConfigModel,
    MapCollectionModel
)


class LayerTilesThemeSerializer(serializers.ModelSerializer):

    class Meta:
        model = LayerTilesThemeModel
        fields = [
            "layer_name",
            "layer_style",
            "created_at"
        ]
        read_only_fields = ["created_at"]


class LegendConfigSerializer(serializers.ModelSerializer):

    class Meta:
        model = LegendConfigModel
        fields = [
            "id",
            "legend_name",
            "legend_color",
            "legend_image",
            "created_at",
            "updated_at"
        ]
        read_only_fields = ["created_at", "updated_at"]


class MapCollectionSerializer(serializers.ModelSerializer):

    layer_ids = serializers.ListField(read_only=True)
    layers_data = serializers.PrimaryKeyRelatedField(
                source="layers",
                many=True,
                read_only=True
            )
    

    legends_data = LegendConfigSerializer(
        source="legends", 
        many=True,
        read_only=True
    )

    # write fields (for POST / PUT)
    layers = serializers.PrimaryKeyRelatedField(
        queryset=LayerTilesThemeModel.objects.all(),
        many=True,
        write_only=True
    )

    legends = serializers.PrimaryKeyRelatedField( 
        queryset=LegendConfigModel.objects.all(),
        many=True,
        write_only=True
    )

    class Meta:
        model = MapCollectionModel
        fields = [
                    "id",
                    "name",
                    "description",
                    "image",
                    "redirect_to",
                    "layer_ids",
                    "layers_data",
                    "legends_data",
                    "layers",
                    "legends",
                    "created_at",
                    "updated_at",
                ]
        read_only_fields = [
            "layers_data",
            "legends_data",
            "created_at",
            "updated_at"
        ]

    def create(self, validated_data):
        layers = validated_data.pop("layers", [])
        legends = validated_data.pop("legends", [])   

        instance = MapCollectionModel.objects.create(**validated_data)

        instance.layers.set(layers)
        instance.legends.set(legends)                 

        return instance

    def update(self, instance, validated_data):
        layers = validated_data.pop("layers", None)
        legends = validated_data.pop("legends", None) 

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if layers is not None:
            instance.layers.set(layers)

        if legends is not None:
            instance.legends.set(legends)             

        return instance