<template>
  <div :id="mapId" class="h-96 rounded-xl shadow-lg overflow-hidden border border-gray-200"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, nextTick } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// @ts-ignore
import 'leaflet-routing-machine';
// @ts-ignore
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
// @ts-ignore
import 'leaflet-control-geocoder';

interface Coordinate {
  lat?: number;
  lng?: number;
  name: string;
  city?: string; // Nuevo campo opcional para la ciudad
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
let routingControl: any = null;

// Función auxiliar para normalizar y comparar nombres
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '');
}

async function geocodePlace(coord: Coordinate): Promise<{lat: number, lng: number, name: string} | null> {
  const place = coord.name;
  const city = coord.city || ''; // Ciudad opcional
  console.log(`Geocodificando: ${place}${city ? `, ${city}` : ''}`);

  // Construir parámetros base para Nominatim
  const baseParams = {
    format: 'json',
    limit: '1',
    addressdetails: '1',
    countrycodes: 'co', // Limitar a Colombia
    'accept-language': 'es'
  };

  // Función auxiliar para realizar la búsqueda
  async function searchNominatim(query: string, extraParams: Record<string, string> = {}): Promise<any> {
    const searchParams = new URLSearchParams({ ...baseParams, ...extraParams, q: query });
    const url = `https://nominatim.openstreetmap.org/search?${searchParams.toString()}`;
    
    try {
      const res = await fetch(url, {
        headers: {
          'Accept-Language': 'es',
          'User-Agent': 'TravelApp/1.0'
        }
      });
      const data = await res.json();
      console.log(`Resultados para "${query}":`, data);
      return data?.[0] || null;
    } catch (error) {
      console.error(`Error en búsqueda para "${query}":`, error);
      return null;
    }
  }

  // Paso 1: Buscar por el nombre exacto del destino
  let result = await searchNominatim(place, { namedetails: '1' });
  
  // Validar si el resultado es relevante
  const isValidResult = (res: any) => {
    if (!res) return false;
    const importance = parseFloat(res.importance || 0);
    const displayName = normalizeString(res.display_name || '');
    const queryName = normalizeString(place);
    const isSimilar = displayName.includes(queryName) || queryName.includes(displayName.split(',')[0]);
    return importance > 0.3 && isSimilar; // Umbral de importancia y similitud
  };

  if (result && isValidResult(result)) {
    return {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      name: result.display_name
    };
  }

  // Paso 2: Si no hay resultados válidos y hay ciudad, buscar por ciudad
  if (city) {
    console.log(`No se encontró "${place}", intentando con ciudad: ${city}`);
    result = await searchNominatim(city, { namedetails: '1' });
    
    if (result && isValidResult(result)) {
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        name: result.display_name
      };
    }
  }

  // Si no se encuentra nada, devolver null
  console.warn(`No se encontraron resultados válidos para "${place}"${city ? ` ni "${city}"` : ''}`);
  return null;
}

async function setupMap() {
  if (!props.coordinates.length) return;
  
  // Limpiar mapa y controles
  if (routingControl) {
    try {
      routingControl.remove();
    } catch (e) {
      console.warn('Error al limpiar routingControl:', e);
    }
    routingControl = null;
  }
  if (map) {
    map.remove();
    map = null;
  }

  const mapContainer = document.getElementById(props.mapId);
  if (mapContainer) {
    mapContainer.innerHTML = '';
  }

  // Caso: Un solo destino
  if (props.coordinates.length === 1) {
    const coord = props.coordinates[0];
    let result = null;
    let foundBy = 'destino';
    if (coord.lat != null && coord.lng != null) {
      result = { lat: coord.lat, lng: coord.lng, name: coord.name };
      foundBy = 'coordenadas';
    } else {
      result = await geocodePlace(coord);
    }
    if (result) {
      map = L.map(props.mapId).setView([result.lat, result.lng], props.zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      
      const customIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      
      const marker = L.marker([result.lat, result.lng], { 
        icon: customIcon, 
        alt: coord.name 
      }).addTo(map);
      
      let popupContent = `<div class='font-semibold text-gray-800'>`;
      popupContent += `<p class='text-lg'>${coord.name}</p>`;
      popupContent += `<p class='text-sm text-gray-600'>Lat: ${result.lat.toFixed(6)}, Lng: ${result.lng.toFixed(6)}</p>`;
      if (foundBy === 'coordenadas') {
        popupContent += `<p class='text-xs text-green-600'>Ubicación exacta</p>`;
      } else {
        popupContent += `<p class='text-xs text-blue-600'>Ubicación encontrada por nombre</p>`;
      }
      popupContent += `</div>`;
      marker.bindPopup(popupContent);
    } else {
      // Fallback: Centro de Colombia
      map = L.map(props.mapId).setView([4.5709, -74.2973], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      
      L.marker([4.5709, -74.2973]).addTo(map)
        .bindPopup(`No se pudo encontrar "${coord.name}"`);
    }
    return;
  }

  // Caso: Ruta con múltiples destinos
  if (props.showRoute && props.coordinates.length > 1) {
    map = L.map(props.mapId).setView([4.5709, -74.2973], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Crear waypoints
    const waypoints = props.coordinates.map(coord => {
      if (coord.lat != null && coord.lng != null) {
        // @ts-ignore
        return L.Routing.waypoint([coord.lat, coord.lng], coord.name);
      }
      return null;
    }).filter(Boolean);

    if (waypoints.length > 1) {
      // @ts-ignore
      routingControl = L.Routing.control({
        waypoints,
        // @ts-ignore
        router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
        // @ts-ignore
        geocoder: L.Control.Geocoder.nominatim(),
        routeWhileDragging: false,
        showAlternatives: true,
        lineOptions: { styles: [{ color: '#3388ff', weight: 5 }] },
        language: 'es',
        collapsible: true
      }).addTo(map);
    }
  }
}

onMounted(() => setupMap());

watch(() => props.coordinates, () => {
  nextTick(() => {
    setupMap();
  });
}, { deep: true });

onUnmounted(() => {
  if (routingControl) {
    try {
      routingControl.remove();
    } catch (e) {
      console.warn('Error al limpiar routingControl:', e);
    }
    routingControl = null;
  }
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

// Declaraciones mínimas para evitar errores de TS
// @ts-ignore
declare module 'leaflet' {
  namespace Routing {
    function waypoint(latLng: [number, number], name?: string): any;
    function control(options: any): any;
    function osrmv1(options: any): any;
  }
}
// @ts-ignore
declare module 'leaflet' {
  namespace Control {
    namespace Geocoder {
      function nominatim(): any;
    }
  }
}