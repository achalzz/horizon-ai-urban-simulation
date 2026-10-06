import pytest
from models.development_schema import LocationInput, SpatialBaselineData
from services.spatial_engine import get_spatial_baseline, haversine_distance, NCR_ZONES

def test_haversine_distance_zero():
    # Distance from a point to itself should be 0.0
    dist = haversine_distance(28.5244, 77.2188, 28.5244, 77.2188)
    assert pytest.approx(dist, abs=1e-4) == 0.0

def test_haversine_distance_delhi_to_noida():
    # Connaught Place to Noida Sec 62 is approx 15-18 km
    dist = haversine_distance(28.6315, 77.2167, 28.6280, 77.3670)
    assert 12.0 < dist < 20.0

def test_ncr_zones_integrity():
    # Verify all pre-configured NCR zones have required keys and sensible values
    assert len(NCR_ZONES) >= 5
    for zone in NCR_ZONES:
        assert "zone_id" in zone
        assert "center_lat" in zone and 28.0 <= zone["center_lat"] <= 29.0
        assert "center_lng" in zone and 76.5 <= zone["center_lng"] <= 77.8
        assert zone["baseline_aqi_pm25"] > 0
        assert zone["water_stress_level"] in ["Safe", "Moderate", "High", "Critical"]
        assert 0 < zone["road_capacity_pct"] <= 100

def test_get_spatial_baseline_exact_match():
    # Location exactly at Connaught Place
    loc = LocationInput(lat=28.6315, lng=77.2167, address="Connaught Place, New Delhi")
    baseline = get_spatial_baseline(loc)
    assert isinstance(baseline, SpatialBaselineData)
    assert baseline.zone_id == "DELHI_CENTRAL_CP"
    assert "Connaught Place" in baseline.zone_name
    assert baseline.metro_proximity_m == 150.0

def test_get_spatial_baseline_nearest_fallback():
    # Near Noida Sector 62 coordinates
    loc = LocationInput(lat=28.6250, lng=77.3650, address="Near Sector 62 Metro")
    baseline = get_spatial_baseline(loc)
    assert baseline.zone_id == "NOIDA_SEC62"
    assert baseline.baseline_aqi_pm25 == 150.0
