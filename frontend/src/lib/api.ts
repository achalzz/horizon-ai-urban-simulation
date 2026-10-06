import { DevelopmentInput, SimulationResponse, SpatialBaselineData } from "@/types/horizon";

const API_BASE = "http://127.0.0.1:8000/api";

export async function fetchBaseline(lat: number, lng: number): Promise<SpatialBaselineData> {
  try {
    const res = await fetch(`${API_BASE}/baseline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lng }),
    });
    if (!res.ok) throw new Error("Failed to fetch baseline");
    return await res.json();
  } catch (err) {
    console.warn("Using fallback spatial baseline", err);
    return {
      zone_id: "GURUGRAM_CYBER_CITY",
      zone_name: "Gurugram - Cyber City & NH-48 Corridor",
      current_land_use: "Commercial Office, IT Park & Retail",
      master_plan_zone: "GMDA Commercial & Tech IT Hub Corridor",
      baseline_aqi_pm25: 158.0,
      baseline_aqi_pm10: 295.0,
      water_stress_level: "Critical",
      road_capacity_pct: 86.0,
      metro_proximity_m: 300.0,
      bus_stop_proximity_m: 250.0,
      population_density_per_sqkm: 11200.0,
      existing_hospitals_1km: 2,
      existing_schools_1km: 4,
      existing_commercial_1km: 14,
    };
  }
}

export async function runSimulation(input: DevelopmentInput): Promise<SimulationResponse> {
  const res = await fetch(`${API_BASE}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Simulation request failed: ${errText}`);
  }
  return await res.json();
}
