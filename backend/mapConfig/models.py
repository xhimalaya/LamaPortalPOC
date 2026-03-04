from django.db import models

# Create your models here.
class MapLayerModel(models.Model):
    id = models.BigAutoField(primary_key=True, blank=True)
    layerName = models.CharField(
        max_length=255,
        unique=True
    )
    layerDescription = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )
    image = models.ImageField(
            upload_to="layer_display/",
            null=True,
            blank=True
        )
    redirect_to = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.layerName
    

class LegendConfigModel(models.Model):
    layer = models.ForeignKey(
        MapLayerModel,
        on_delete=models.CASCADE
    )
    legend_name = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )
    legend_color = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )
    legend_image = models.ImageField(
        upload_to="legend/picture/",
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.layer+"___"+self.legend_name
