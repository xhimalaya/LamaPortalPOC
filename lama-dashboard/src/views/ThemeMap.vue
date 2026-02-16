<template>
  <div class="map-container">
    <div id="map" class="map"></div>

    <div class="map-controls">
      <button @click="loadGeoTIFF" :disabled="loading">
        {{ loading ? 'Loading...' : 'Load Snow/Glacier GeoTIFF (Last 5 Years)' }}
      </button>

      <button @click="searchMapplsFeatures">Search Features (Lakes/Glaciers/Rivers)</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoTIFFSource from 'ol/source/GeoTIFF';
import OSM from 'ol/source/OSM';
import TileJSON from 'ol/source/TileJSON';
import GeoJSON from 'ol/format/GeoJSON';
import { fromLonLat } from 'ol/proj';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import CircleStyle from 'ol/style/Circle';
import 'ol/ol.css';

const mapplsApiKey = '07b3d712c4d64866858dfd812141d0cf';

const loading = ref(false);
let map = null;
let featureLayer = null;

onMounted(() => {
  map = new Map({
    target: 'map',
    view: new View({
      center: fromLonLat([77.58, 34.15]),
      zoom: 7
    }),
    layers: [
      new TileLayer({
        source: new OSM(),
        title: 'OpenStreetMap Fallback'
      })
    ]
  });

  // Ladakh boundary (working GeoJSON)
  const boundarySource = new VectorSource({
    url: 'https://raw.githubusercontent.com/adarshbiradar/maps-geojson/main/india/states/Ladakh.json',
    format: new GeoJSON()
  });

  const boundaryLayer = new VectorLayer({
    source: boundarySource,
    style: new Style({
      stroke: new Stroke({ color: '#ff6600', width: 3 }),
      fill: new Fill({ color: 'rgba(255, 102, 0, 0.1)' })
    })
  });

  map.addLayer(boundaryLayer);

  // Lakes vector
  const lakesGeoJSON = {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', geometry: { type: 'Point', coordinates: [78.8333, 33.7167] }, properties: { name: 'Pangong Tso' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [78.3, 32.9] }, properties: { name: 'Tso Moriri' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [77.9833, 33.2833] }, properties: { name: 'Tso Kar' } }
    ]
  };

  const lakesSource = new VectorSource({
    features: new GeoJSON().readFeatures(lakesGeoJSON)
  });

  const lakesLayer = new VectorLayer({
    source: lakesSource,
    style: new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({ color: '#0066ff' }),
        stroke: new Stroke({ color: '#ffffff', width: 2 })
      })
    })
  });

  map.addLayer(lakesLayer);
});

const loadGeoTIFF = async () => {
  loading.value = true;

  try {
    const geotiffUrl = 'https://example.com/your_geotiff.tif';
    const geotiffSource = new GeoTIFFSource({
      sources: [{ url: geotiffUrl }]
    });
    const geotiffLayer = new TileLayer({
      source: geotiffSource,
      title: 'Snow/Glacier GeoTIFF'
    });
    map.addLayer(geotiffLayer);
    alert('GeoTIFF loaded!');
  } catch (err) {
    console.error('GeoTIFF load failed:', err);
    alert('Error: ' + err.message);
  } finally {
    loading.value = false;
  }
};

const searchMapplsFeatures = async () => {
  try {
    const keyword = 'lake OR glacier OR river';
    const response = await fetch(
      `https://atlas.mappls.com/api/places/search/json?query=${encodeURIComponent(keyword)}&bbox=76,32,80,36&api_key=${mapplsApiKey}`
    );
    const data = await response.json();

    if (data.suggestedResults && data.suggestedResults.length > 0) {
      const features = data.suggestedResults.map(item => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [item.longitude, item.latitude]
        },
        properties: {
          name: item.placeName,
          type: item.type || 'POI'
        }
      }));

      if (featureLayer) map.removeLayer(featureLayer);

      const featureSource = new VectorSource({
        features: new GeoJSON().readFeatures({
          type: 'FeatureCollection',
          features
        })
      });

      featureLayer = new VectorLayer({
        source: featureSource,
        style: new Style({
          image: new CircleStyle({
            radius: 6,
            fill: new Fill({ color: '#0066ff' }),
            stroke: new Stroke({
              color: '#ffffff',
              width: 2
            })
          })
        })
      });

      map.addLayer(featureLayer);

      alert(`Found ${features.length} features`);
    } else {
      alert('No features found');
    }
  } catch (err) {
    console.error('Mappls search failed:', err);
    alert('Error: ' + err.message);
  }
};
</script>

<style scoped>
.map-container { height: 100vh; position: relative; }
.map { height: 100%; width: 100%; }
.map-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  display: flex;
  gap: 10px;
}
.map-controls button {
  padding: 10px 16px;
  background: #004d99;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}
.map-controls button:disabled {
  background: #aaa;
  cursor: not-allowed;
}
</style>