import json
import os
from django.conf import settings
from mapConfig.models import *
_loaded = False
_loaded_themes = False

def load_layers_from_json():
    global _loaded
    if _loaded:
        return
    _loaded = True
    file_path = os.path.join(
        settings.BASE_DIR,
        "mapConfig",
        "utils",
        "layers.json"
    )
    if not os.path.exists(file_path):
        print("layers.json not found")
        return
    with open(file_path, "r") as f:
        data = json.load(f)
    for layer in data:
        layer_name = layer.get("id")
        if not layer_name:
            continue
        LayerTilesThemeModel.objects.update_or_create(
            layer_name=layer_name,
            defaults={
                "layer_style": layer
            }
        )
        print(f"Layer synced: {layer_name}")
    print("Layer JSON sync completed.")


def load_themes_from_json():
    global _loaded_themes

    if _loaded_themes:
        return

    _loaded_themes = True

    file_path = os.path.join(
        settings.BASE_DIR,
        "mapConfig",
        "utils",
        "themes.json"
    )

    if not os.path.exists(file_path):
        print("themes.json not found")
        return

    with open(file_path, "r") as f:
        data = json.load(f)

    for theme in data:

        theme_name = theme.get("name")

        if not theme_name:
            continue

        collection, _ = MapCollectionModel.objects.update_or_create(
            name=theme_name,
            defaults={
                "description": theme.get("description"),
                "redirect_to": theme.get("redirect_to"),
            }
        )

        print(f"Theme synced: {theme_name}")

        # -------- Layers --------
        layers = theme.get("layers_data", [])

        layer_objs = []

        for layer in layers:
            layer_name = layer.get("layer_name")

            try:
                layer_obj = LayerTilesThemeModel.objects.get(layer_name=layer_name)
                layer_objs.append(layer_obj)
            except LayerTilesThemeModel.DoesNotExist:
                print(f"Layer missing: {layer_name}")

        collection.layers.set(layer_objs)

        # -------- Legends --------
        legends = theme.get("legends_data", [])

        legend_objs = []

        for legend in legends:
            legend_obj, _ = LegendConfigModel.objects.update_or_create(
                legend_name=legend.get("legend_name"),
                defaults={
                    "legend_color": legend.get("legend_color")
                }
            )

            legend_objs.append(legend_obj)

        collection.legends.set(legend_objs)

    print("Themes JSON sync completed.")