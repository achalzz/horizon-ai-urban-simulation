export type DevelopmentType =
  | "mall"
  | "residential"
  | "highway"
  | "hospital"
  | "school"
  | "factory"
  | "data_center"
  | "logistics_park"
  | "office_complex"
  | "metro_station"
  | "solar_farm"
  | "mixed_use";

export interface LocationInput {
  lat: number;
  lng: number;
  address?: string;
  zone_name?: string;
}

export interface DevelopmentInput {
  dev_type: DevelopmentType;
  title: string;
  location: LocationInput;
  built_up_area_sqft: number;
  floors: number;
  visitor_capacity_daily: number;
  parking_spaces: number;
  green_area_hectares: number;
  operating_hours_per_day: number;
  construction_duration_months: number;
  road_length_km?: number;
  road_lanes?: number;
  housing_units?: number;
}

export interface SpatialBufferMetrics {
  distance_m: number;
  pm25_increase_pct: number;
  pm10_increase_pct: number;
  noise_increase_db: number;
  traffic_increase_pct: number;
}

export interface PositiveImpactItem {
  id: string;
  category: string;
  title: string;
  value: string;
  numeric_value: number;
  unit: string;
  description: string;
}

export interface NegativeImpactItem {
  id: string;
  category: string;
  title: string;
  value: string;
  numeric_value: number;
  unit: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
}

export interface DimensionScores {
  economic: number;
  social: number;
  environmental: number;
  mobility: number;
  resources: number;
  infrastructure: number;
  climate_resilience: number;
}

export interface TemporalPoint {
  year: number;
  positive_score: number;
  negative_score: number;
  net_utility: number;
  traffic_index: number;
  pm25_index: number;
  water_stress_pct: number;
  economic_cr: number;
}

export interface ScenarioOutput {
  scenario_id: string;
  scenario_name: string;
  description: string;
  horizon_score: number;
  infrastructure_stress_index: number;
  positive_score: number;
  negative_score: number;
  net_utility_score: number;
  key_changes: string[];
  is_recommended: boolean;
}

export interface SpatialBaselineData {
  zone_id: string;
  zone_name: string;
  current_land_use: string;
  master_plan_zone: string;
  baseline_aqi_pm25: number;
  baseline_aqi_pm10: number;
  water_stress_level: string;
  road_capacity_pct: number;
  metro_proximity_m: number;
  bus_stop_proximity_m: number;
  population_density_per_sqkm: number;
  existing_hospitals_1km: number;
  existing_schools_1km: number;
  existing_commercial_1km: number;
}

export interface SimulationResponse {
  development: DevelopmentInput;
  spatial_baseline: SpatialBaselineData;
  horizon_score: number;
  infrastructure_stress_index: number;
  positive_score: number;
  negative_score: number;
  net_utility_score: number;
  dimension_scores: DimensionScores;
  positive_impacts: PositiveImpactItem[];
  negative_impacts: NegativeImpactItem[];
  spatial_buffers: SpatialBufferMetrics[];
  temporal_projections: TemporalPoint[];
  scenarios: ScenarioOutput[];
  mitigation_recommendations: string[];
  sacrifices_summary: string[];
  ai_summary_explanation: string;
  confidence_score: number;
  data_sources: string[];
}
