import json
import os
from django.conf import settings
from mapConfig.models import LayerTilesThemeModel
_loaded = False


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