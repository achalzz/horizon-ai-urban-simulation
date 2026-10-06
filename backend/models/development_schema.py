from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Literal, Any

DevelopmentType = Literal[
    "mall",
    "residential",
    "highway",
    "hospital",
    "school",
    "factory",
    "data_center",
    "logistics_park",
    "office_complex",
    "metro_station",
    "solar_farm",
    "mixed_use"
]

class LocationInput(BaseModel):
    lat: float = Field(..., description="Latitude in Delhi-NCR", json_schema_extra={"example": 28.5355})
    lng: float = Field(..., description="Longitude in Delhi-NCR", json_schema_extra={"example": 77.3910})
    address: Optional[str] = Field("Sector 62, Noida, Delhi-NCR", description="Human readable address")
    zone_name: Optional[str] = Field("Noida Commercial Corridor", description="Planning zone identifier")

class DevelopmentInput(BaseModel):
    dev_type: DevelopmentType = Field(..., description="Development category", json_schema_extra={"example": "mall"})
    title: str = Field("Proposed Shopping Mall", description="Project title", json_schema_extra={"example": "Grand Horizon Mall"})
    location: LocationInput
    built_up_area_sqft: float = Field(1500000.0, description="Built up area in sq ft")
    floors: int = Field(5, description="Number of floors / height scale")
    visitor_capacity_daily: int = Field(20000, description="Expected daily visitors / residents / users")
    parking_spaces: int = Field(1800, description="Proposed vehicle parking capacity")
    green_area_hectares: float = Field(2.5, description="Dedicated open / green area in hectares")
    operating_hours_per_day: float = Field(14.0, description="Operating hours per day")
    construction_duration_months: int = Field(24, description="Construction timeline in months")
    
    # Specific optional fields for highway / residential
    road_length_km: Optional[float] = Field(0.0, description="Road / highway corridor length in km")
    road_lanes: Optional[int] = Field(0, description="Number of lanes for highway projects")
    housing_units: Optional[int] = Field(0, description="Number of residential apartments")

class SpatialBufferMetrics(BaseModel):
    distance_m: int
    pm25_increase_pct: float
    pm10_increase_pct: float
    noise_increase_db: float
    traffic_increase_pct: float

class PositiveImpactItem(BaseModel):
    id: str
    category: str  # Economy, Society, Mobility, Infrastructure
    title: str
    value: str
    numeric_value: float
    unit: str
    description: str

class NegativeImpactItem(BaseModel):
    id: str
    category: str  # Environment, Traffic, Resources, Community
    title: str
    value: str
    numeric_value: float
    unit: str
    description: str
    severity: Literal["low", "medium", "high", "critical"]

class DimensionScores(BaseModel):
    economic: float
    social: float
    environmental: float
    mobility: float
    resources: float
    infrastructure: float
    climate_resilience: float

class TemporalPoint(BaseModel):
    year: int
    positive_score: float
    negative_score: float
    net_utility: float
    traffic_index: float
    pm25_index: float
    water_stress_pct: float
    economic_cr: float

class ScenarioOutput(BaseModel):
    scenario_id: str
    scenario_name: str
    description: str
    horizon_score: float
    infrastructure_stress_index: float
    positive_score: float
    negative_score: float
    net_utility_score: float
    key_changes: List[str]
    is_recommended: bool = False

class SpatialBaselineData(BaseModel):
    zone_id: str
    zone_name: str
    current_land_use: str
    master_plan_zone: str  # DDA MPD-2041 reference
    baseline_aqi_pm25: float
    baseline_aqi_pm10: float
    water_stress_level: str  # Critical, High, Moderate, Safe
    road_capacity_pct: float
    metro_proximity_m: float
    bus_stop_proximity_m: float
    population_density_per_sqkm: float
    existing_hospitals_1km: int
    existing_schools_1km: int
    existing_commercial_1km: int

class SimulationResponse(BaseModel):
    development: DevelopmentInput
    spatial_baseline: SpatialBaselineData
    horizon_score: float  # 0 to 100
    infrastructure_stress_index: float  # 0 to 100
    positive_score: float
    negative_score: float
    net_utility_score: float
    dimension_scores: DimensionScores
    positive_impacts: List[PositiveImpactItem]
    negative_impacts: List[NegativeImpactItem]
    spatial_buffers: List[SpatialBufferMetrics]
    temporal_projections: List[TemporalPoint]
    scenarios: List[ScenarioOutput]
    mitigation_recommendations: List[str]
    sacrifices_summary: List[str]
    ai_summary_explanation: str
    confidence_score: float = 84.0
    data_sources: List[str]
