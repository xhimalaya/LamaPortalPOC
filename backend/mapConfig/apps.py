from django.apps import AppConfig


class MapconfigConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "mapConfig"

    def ready(self):

        from mapConfig.utils.load_layers import load_layers_from_json

        try:
            load_layers_from_json()
        except Exception as e:
            print("Layer sync failed:", e)