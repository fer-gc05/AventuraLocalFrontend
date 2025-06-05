<template>
  <div :id="mapId" class="h-96 rounded-xl shadow-lg overflow-hidden border border-gray-200"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Coordinate {
  lat: number;
  lng: number;
  name: string;
}

interface Props {
  coordinates: Coordinate[];
  mapId?: string;
  zoom?: number;
  showRoute?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  mapId: 'map',
  zoom: 12,
  showRoute: false
});

let map: L.Map | null = null;

onMounted(() => {
  if (props.coordinates.length === 0) return;

  // Crear el mapa centrado en el primer destino
  map = L.map(props.mapId).setView([props.coordinates[0].lat, props.coordinates[0].lng], props.zoom);

  // Añadir capa de OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Icono personalizado para los marcadores
  const customIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Añadir marcadores para cada coordenada
  props.coordinates.forEach((coord) => {
    L.marker([coord.lat, coord.lng], { 
      icon: customIcon,
      alt: coord.name
    })
      .addTo(map!)
      .bindPopup(`
        <div class="font-semibold text-gray-800">${coord.name}</div>
        <div class="text-sm text-gray-600 mt-1">${coord.lat.toFixed(4)}, ${coord.lng.toFixed(4)}</div>
      `);
  });

  // Dibujar polilínea para conectar los destinos si showRoute es true
  if (props.showRoute && props.coordinates.length > 1) {
    const latLngs = props.coordinates.map(coord => [coord.lat, coord.lng] as [number, number]);
    L.polyline(latLngs, { 
      color: '#3B82F6',
      weight: 4,
      opacity: 0.8,
      dashArray: '5, 5'
    }).addTo(map!);
  }

  // Ajustar el mapa para mostrar todos los marcadores con un poco de padding
  if (props.coordinates.length > 0) {
    const bounds = L.latLngBounds(props.coordinates.map(coord => [coord.lat, coord.lng]));
    map.fitBounds(bounds, { padding: [50, 50] });
  }
});

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script> 