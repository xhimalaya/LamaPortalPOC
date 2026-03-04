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

    # nested read fields (for GET)
    layers_data = LayerTilesThemeSerializer(
        source="layers",
        many=True,
        read_only=True
    )

    legends_data = LegendConfigSerializer(
        source="lagends",
        many=True,
        read_only=True
    )

    # write fields (for POST / PUT)
    layers = serializers.PrimaryKeyRelatedField(
        queryset=LayerTilesThemeModel.objects.all(),
        many=True,
        write_only=True
    )

    lagends = serializers.PrimaryKeyRelatedField(
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
            "layers",
            "lagends",
            "layers_data",
            "legends_data",
            "created_at",
            "updated_at"
        ]

        read_only_fields = [
            "created_at",
            "updated_at"
        ]

    def create(self, validated_data):
        layers = validated_data.pop("layers", [])
        lagends = validated_data.pop("lagends", [])

        instance = MapCollectionModel.objects.create(**validated_data)

        instance.layers.set(layers)
        instance.lagends.set(lagends)

        return instance

    def update(self, instance, validated_data):
        layers = validated_data.pop("layers", None)
        lagends = validated_data.pop("lagends", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if layers is not None:
            instance.layers.set(layers)

        if lagends is not None:
            instance.lagends.set(lagends)

        return instance