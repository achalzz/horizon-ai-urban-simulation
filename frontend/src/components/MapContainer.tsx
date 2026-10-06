import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { LocationInput, SpatialBufferMetrics } from "@/types/horizon";
import { MapPin, Box, Eye, Flame, Wind, Droplets, Globe, Layers } from "lucide-react";

interface MapContainerProps {
  location: LocationInput;
  onLocationSelect: (loc: LocationInput) => void;
  spatialBuffers?: SpatialBufferMetrics[];
  devTitle?: string;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  location,
  onLocationSelect,
  spatialBuffers,
  devTitle,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  const [is3D, setIs3D] = useState(true);
  const [mapMode, setMapMode] = useState<"satellite" | "dark">("satellite");
  const [activeLayer, setActiveLayer] = useState<"traffic" | "aqi" | "water">("traffic");

  // Helper to generate GeoJSON Circle polygon
  const createGeoJSONCircle = (center: [number, number], radiusInKm: number, points: number = 64) => {
    const coords = { latitude: center[1], longitude: center[0] };
    const km = radiusInKm;
    const ret: [number, number][] = [];
    const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
    const distanceY = km / 110.574;

    for (let i = 0; i < points; i++) {
      const theta = (i / points) * (2 * Math.PI);
      const x = distanceX * Math.cos(theta);
      const y = distanceY * Math.sin(theta);
      ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]);
    return {
      type: "Feature" as const,
      geometry: {
        type: "Polygon" as const,
        coordinates: [ret],
      },
      properties: {},
    };
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    // Base map sources: ESRI Satellite Imagery & CARTO Dark Vector
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "satellite-tiles": {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
            attribution: "© Esri World Imagery, DigitalGlobe, GeoEye",
          },
          "carto-dark": {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
              "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution: "© CARTO, OpenStreetMap",
          },
        },
        layers: [
          {
            id: "satellite-layer",
            type: "raster",
            source: "satellite-tiles",
            minzoom: 0,
            maxzoom: 19,
            paint: { "raster-opacity": mapMode === "satellite" ? 1.0 : 0.0 },
          },
          {
            id: "dark-layer",
            type: "raster",
            source: "carto-dark",
            minzoom: 0,
            maxzoom: 19,
            paint: { "raster-opacity": mapMode === "dark" ? 0.95 : 0.0 },
          },
        ],
      },
      center: [location.lng, location.lat],
      zoom: 14,
      pitch: is3D ? 50 : 0,
      bearing: is3D ? -20 : 0,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      // Add Sources for Dynamic Layers
      map.addSource("dynamic-rings", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            { ...createGeoJSONCircle([location.lng, location.lat], 0.25), properties: { ring: "250m", color: "#f43f5e" } },
            { ...createGeoJSONCircle([location.lng, location.lat], 0.50), properties: { ring: "500m", color: "#f59e0b" } },
            { ...createGeoJSONCircle([location.lng, location.lat], 1.00), properties: { ring: "1000m", color: "#eab308" } },
            { ...createGeoJSONCircle([location.lng, location.lat], 3.00), properties: { ring: "3000m", color: "#06b6d4" } },
          ],
        },
      });

      // Layer Fill
      map.addLayer({
        id: "dynamic-rings-fill",
        type: "fill",
        source: "dynamic-rings",
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": activeLayer === "traffic" ? 0.22 : activeLayer === "aqi" ? 0.35 : 0.18,
        },
      });

      // Layer Outline
      map.addLayer({
        id: "dynamic-rings-line",
        type: "line",
        source: "dynamic-rings",
        paint: {
          "line-color": ["get", "color"],
          "line-width": 2.5,
          "line-dasharray": [2, 2],
        },
      });

      // 3D Massing Extrusion Source & Layer
      map.addSource("proposed-building-3d", {
        type: "geojson",
        data: createGeoJSONCircle([location.lng, location.lat], 0.08),
      });

      map.addLayer({
        id: "building-3d-layer",
        type: "fill-extrusion",
        source: "proposed-building-3d",
        paint: {
          "fill-extrusion-color": "#10b981",
          "fill-extrusion-height": 45,
          "fill-extrusion-base": 0,
          "fill-extrusion-opacity": 0.85,
        },
      });
    });

    // Click map to reposition site
    map.on("click", (e) => {
      onLocationSelect({
        lat: e.lngLat.lat,
        lng: e.lngLat.lng,
        address: `Coords: ${e.lngLat.lat.toFixed(4)}, ${e.lngLat.lng.toFixed(4)}`,
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Update map state dynamically on toggle / location change
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    map.flyTo({
      center: [location.lng, location.lat],
      pitch: is3D ? 50 : 0,
      bearing: is3D ? -20 : 0,
      duration: 1000,
    });

    // Update Basemap Opacities
    if (map.getLayer("satellite-layer")) {
      map.setPaintProperty("satellite-layer", "raster-opacity", mapMode === "satellite" ? 1.0 : 0.0);
    }
    if (map.getLayer("dark-layer")) {
      map.setPaintProperty("dark-layer", "raster-opacity", mapMode === "dark" ? 0.95 : 0.0);
    }

    // Update Dynamic GeoJSON Sources
    const ringsSource = map.getSource("dynamic-rings") as maplibregl.GeoJSONSource;
    if (ringsSource) {
      const trafficColors = ["#f43f5e", "#f59e0b", "#10b981", "#06b6d4"];
      const aqiColors = ["#ef4444", "#f97316", "#eab308", "#fde047"];
      const waterColors = ["#0284c7", "#06b6d4", "#38bdf8", "#7dd3fc"];

      const activeColors = activeLayer === "traffic" ? trafficColors : activeLayer === "aqi" ? aqiColors : waterColors;

      ringsSource.setData({
        type: "FeatureCollection",
        features: [
          { ...createGeoJSONCircle([location.lng, location.lat], 0.25), properties: { ring: "250m", color: activeColors[0] } },
          { ...createGeoJSONCircle([location.lng, location.lat], 0.50), properties: { ring: "500m", color: activeColors[1] } },
          { ...createGeoJSONCircle([location.lng, location.lat], 1.00), properties: { ring: "1000m", color: activeColors[2] } },
          { ...createGeoJSONCircle([location.lng, location.lat], 3.00), properties: { ring: "3000m", color: activeColors[3] } },
        ],
      });
    }

    const bldgSource = map.getSource("proposed-building-3d") as maplibregl.GeoJSONSource;
    if (bldgSource) {
      bldgSource.setData(createGeoJSONCircle([location.lng, location.lat], 0.08));
    }

    // Update Marker
    if (markerRef.current) {
      markerRef.current.setLngLat([location.lng, location.lat]);
    } else {
      const el = document.createElement("div");
      el.className = "relative flex items-center justify-center";
      el.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-emerald-500/40 border-2 border-emerald-300 flex items-center justify-center animate-ping absolute"></div>
        <div class="w-9 h-9 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center shadow-2xl text-slate-950 font-black text-sm z-10">
          📍
        </div>
      `;
      markerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([location.lng, location.lat])
        .addTo(map);
    }
  }, [location, is3D, mapMode, activeLayer]);

  return (
    <div className="relative w-full h-[540px] rounded-2xl overflow-hidden border border-borderDark shadow-2xl">
      {/* MapLibre Canvas Container */}
      <div ref={mapContainer} className="w-full h-full bg-[#090d16]" />

      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-cardDark/90 border border-borderDark backdrop-blur-md px-3 py-2 rounded-xl text-xs">
        <MapPin className="h-4 w-4 text-primaryEmerald" />
        <span className="font-semibold text-slate-200">{devTitle || "Proposed Development Site"}</span>
        <span className="text-slate-500">|</span>
        <span className="text-slate-400">Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</span>
      </div>

      {/* Satellite vs Dark Vector Switcher */}
      <div className="absolute top-4 right-14 z-10 flex items-center bg-cardDark/90 border border-borderDark backdrop-blur-md p-1 rounded-xl text-xs">
        <button
          type="button"
          onClick={() => setMapMode("satellite")}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
            mapMode === "satellite"
              ? "bg-cyanBuffer text-slate-950 shadow-md shadow-cyan-500/20"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          <span>Satellite View</span>
        </button>
        <button
          type="button"
          onClick={() => setMapMode("dark")}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
            mapMode === "dark"
              ? "bg-primaryEmerald text-slate-950 shadow-md shadow-emerald-500/20"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Dark Vector</span>
        </button>
      </div>

      {/* Bottom Controls: 2D/3D & Functional Layer Switchers */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-wrap items-center gap-2 bg-cardDark/90 border border-borderDark backdrop-blur-md p-1.5 rounded-xl text-xs">
        <button
          type="button"
          onClick={() => setIs3D(!is3D)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            is3D
              ? "bg-primaryEmerald text-slate-950 font-extrabold shadow-md shadow-emerald-500/20"
              : "bg-panelDark text-slate-400 hover:text-slate-200"
          }`}
        >
          <Box className="h-4 w-4" />
          <span>{is3D ? "3D Extrusion" : "2D Flat Map"}</span>
        </button>

        <span className="text-borderDark hidden sm:inline">|</span>

        {/* Traffic Heatmap Button */}
        <button
          type="button"
          onClick={() => setActiveLayer("traffic")}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeLayer === "traffic"
              ? "bg-rose-500 text-slate-950 shadow-lg shadow-rose-500/30"
              : "bg-panelDark text-slate-400 hover:text-slate-200"
          }`}
        >
          <Flame className="h-4 w-4" />
          <span>Traffic Heatmap</span>
        </button>

        {/* AQI Dispersion Plume Button */}
        <button
          type="button"
          onClick={() => setActiveLayer("aqi")}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeLayer === "aqi"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30"
              : "bg-panelDark text-slate-400 hover:text-slate-200"
          }`}
        >
          <Wind className="h-4 w-4" />
          <span>AQI Dispersion Plume</span>
        </button>

        {/* Water Stress Zones Button */}
        <button
          type="button"
          onClick={() => setActiveLayer("water")}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeLayer === "water"
              ? "bg-cyanBuffer text-slate-950 shadow-lg shadow-cyan-500/30"
              : "bg-panelDark text-slate-400 hover:text-slate-200"
          }`}
        >
          <Droplets className="h-4 w-4" />
          <span>Water Stress Zones</span>
        </button>
      </div>

      {/* Spatial Buffers Overlay Card */}
      {spatialBuffers && spatialBuffers.length > 0 && (
        <div className="absolute top-16 right-4 z-10 bg-cardDark/90 border border-borderDark backdrop-blur-md p-3 rounded-xl text-xs space-y-2 max-w-[200px]">
          <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            <Eye className="h-3.5 w-3.5 text-primaryEmerald" />
            <span>Active Layer Rings</span>
          </div>
          <div className="space-y-1.5">
            {spatialBuffers.map((buf) => (
              <div key={buf.distance_m} className="flex justify-between items-center bg-panelDark/80 p-1.5 rounded border border-borderDark/40">
                <span className="font-semibold text-cyanBuffer">{buf.distance_m}m Ring</span>
                <span className="text-[10px] text-slate-300">
                  PM10: <strong className="text-warningAmber">+{buf.pm10_increase_pct}%</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
