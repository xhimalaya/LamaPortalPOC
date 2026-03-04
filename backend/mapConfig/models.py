from django.db import models


class LayerTilesThemeModel(models.Model):
    layer_name = models.CharField(max_length=255, primary_key = True)
    layer_style = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.layer_name


class LegendConfigModel(models.Model):
    legend_name = models.CharField(max_length=255, null=True, blank=True)
    legend_color = models.CharField(max_length=255, null=True, blank=True)
    legend_image = models.ImageField(upload_to="legend/picture/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.legend_name


class MapCollectionModel(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    description = models.CharField(max_length=255, null=True, blank=True)
    layers = models.ManyToManyField(LayerTilesThemeModel, related_name="themes")
    lagends = models.ManyToManyField(LegendConfigModel, related_name="themes")
    image = models.ImageField(upload_to="layer_display/", null=True, blank=True)
    redirect_to = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


