import math
from models.development_schema import SpatialBaselineData, LocationInput

# Reference Delhi-NCR Zones with geo-fenced baselines (DDA, CPCB, GTFS grounded)
NCR_ZONES = [
    {
        "zone_id": "DELHI_SOUTH_SAKET",
        "zone_name": "South Delhi - Saket / Pushp Vihar",
        "center_lat": 28.5244,
        "center_lng": 77.2188,
        "radius_km": 6.0,
        "master_plan_zone": "DDA Zone F (South Delhi Commercial/Residential)",
        "current_land_use": "Mixed-Use Commercial & High-Density Residential",
        "baseline_aqi_pm25": 142.0,
        "baseline_aqi_pm10": 268.0,
        "water_stress_level": "High",
        "road_capacity_pct": 78.0,
        "metro_proximity_m": 450.0,
        "bus_stop_proximity_m": 120.0,
        "population_density_per_sqkm": 14500.0,
        "existing_hospitals_1km": 3,
        "existing_schools_1km": 7,
        "existing_commercial_1km": 8,
    },
    {
        "zone_id": "GURUGRAM_CYBER_CITY",
        "zone_name": "Gurugram - Cyber City & NH-48 Corridor",
        "center_lat": 28.4950,
        "center_lng": 77.0895,
        "radius_km": 8.0,
        "master_plan_zone": "GMDA Commercial & Tech IT Hub Corridor",
        "current_land_use": "Commercial Office, IT Park & Retail",
        "baseline_aqi_pm25": 158.0,
        "baseline_aqi_pm10": 295.0,
        "water_stress_level": "Critical",
        "road_capacity_pct": 86.0,
        "metro_proximity_m": 300.0,
        "bus_stop_proximity_m": 250.0,
        "population_density_per_sqkm": 11200.0,
        "existing_hospitals_1km": 2,
        "existing_schools_1km": 4,
        "existing_commercial_1km": 14,
    },
    {
        "zone_id": "DWARKA_EXPRESSWAY",
        "zone_name": "Dwarka Expressway / IGI Airport Zone",
        "center_lat": 28.5490,
        "center_lng": 77.0120,
        "radius_km": 10.0,
        "master_plan_zone": "DDA Zone K-II (Dwarka Sub-City Extension)",
        "current_land_use": "Developing Residential & Transportation Corridor",
        "baseline_aqi_pm25": 165.0,
        "baseline_aqi_pm10": 310.0,
        "water_stress_level": "High",
        "road_capacity_pct": 62.0,
        "metro_proximity_m": 1200.0,
        "bus_stop_proximity_m": 400.0,
        "population_density_per_sqkm": 7800.0,
        "existing_hospitals_1km": 1,
        "existing_schools_1km": 3,
        "existing_commercial_1km": 3,
    },
    {
        "zone_id": "NOIDA_SEC62",
        "zone_name": "Noida Sector 62 / Electronic City",
        "center_lat": 28.6280,
        "center_lng": 77.3670,
        "radius_km": 7.0,
        "master_plan_zone": "NOIDA Master Plan 2031 Institutional/Commercial",
        "current_land_use": "Institutional, IT Parks & High-Rise Residential",
        "baseline_aqi_pm25": 150.0,
        "baseline_aqi_pm10": 282.0,
        "water_stress_level": "Moderate",
        "road_capacity_pct": 71.0,
        "metro_proximity_m": 350.0,
        "bus_stop_proximity_m": 180.0,
        "population_density_per_sqkm": 12400.0,
        "existing_hospitals_1km": 2,
        "existing_schools_1km": 5,
        "existing_commercial_1km": 6,
    },
    {
        "zone_id": "DELHI_CENTRAL_CP",
        "zone_name": "Central Delhi - Connaught Place & ITO",
        "center_lat": 28.6315,
        "center_lng": 77.2167,
        "radius_km": 5.0,
        "master_plan_zone": "DDA Zone D (Central Delhi Heritage/CBD)",
        "current_land_use": "Central Business District & Civic Administrative",
        "baseline_aqi_pm25": 138.0,
        "baseline_aqi_pm10": 255.0,
        "water_stress_level": "High",
        "road_capacity_pct": 91.0,
        "metro_proximity_m": 150.0,
        "bus_stop_proximity_m": 80.0,
        "population_density_per_sqkm": 16800.0,
        "existing_hospitals_1km": 4,
        "existing_schools_1km": 6,
        "existing_commercial_1km": 18,
    }
]

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def get_spatial_baseline(location: LocationInput) -> SpatialBaselineData:
    nearest_zone = None
    min_dist = float('inf')
    
    for zone in NCR_ZONES:
        dist = haversine_distance(location.lat, location.lng, zone["center_lat"], zone["center_lng"])
        if dist < min_dist:
            min_dist = dist
            nearest_zone = zone
            
    if not nearest_zone:
        nearest_zone = NCR_ZONES[0]
        
    return SpatialBaselineData(
        zone_id=nearest_zone["zone_id"],
        zone_name=nearest_zone["zone_name"],
        current_land_use=nearest_zone["current_land_use"],
        master_plan_zone=nearest_zone["master_plan_zone"],
        baseline_aqi_pm25=nearest_zone["baseline_aqi_pm25"],
        baseline_aqi_pm10=nearest_zone["baseline_aqi_pm10"],
        water_stress_level=nearest_zone["water_stress_level"],
        road_capacity_pct=nearest_zone["road_capacity_pct"],
        metro_proximity_m=nearest_zone["metro_proximity_m"],
        bus_stop_proximity_m=nearest_zone["bus_stop_proximity_m"],
        population_density_per_sqkm=nearest_zone["population_density_per_sqkm"],
        existing_hospitals_1km=nearest_zone["existing_hospitals_1km"],
        existing_schools_1km=nearest_zone["existing_schools_1km"],
        existing_commercial_1km=nearest_zone["existing_commercial_1km"]
    )
