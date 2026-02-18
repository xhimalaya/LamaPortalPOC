from django.urls import path
from .views import *

urlpatterns = [
     path("listlayer/", ListLayerView.as_view(), name="list-layer"),
    path("legendconf/<str:pk>/", LegendByLayerNameView.as_view(), name="legend-by-layer"),
]
