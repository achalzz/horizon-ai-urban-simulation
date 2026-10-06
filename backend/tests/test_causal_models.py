import pytest
from models.development_schema import DevelopmentInput, LocationInput, SpatialBaselineData
from services.spatial_engine import get_spatial_baseline
from services.mobility_model import calculate_mobility_impact
from services.pollution_model import calculate_pollution_impact
from services.resource_model import calculate_resource_impact
from services.economic_model import calculate_economic_impact
from services.scenario_engine import build_simulation_engine

@pytest.fixture
def sample_location():
    return LocationInput(
        lat=28.6280,
        lng=77.3670,
        address="Sector 62, Noida, Delhi-NCR",
        zone_name="Noida Sector 62 / Electronic City"
    )

@pytest.fixture
def sample_development(sample_location):
    return DevelopmentInput(
        dev_type="mall",
        title="Noida Horizon Center",
        location=sample_location,
        built_up_area_sqft=1200000.0,
        floors=6,
        visitor_capacity_daily=15000,
        parking_spaces=1500,
        green_area_hectares=2.0,
        operating_hours_per_day=14.0,
        construction_duration_months=24
    )

@pytest.fixture
def sample_baseline(sample_location):
    return get_spatial_baseline(sample_location)

def test_mobility_trip_generation(sample_development, sample_baseline):
    res = calculate_mobility_impact(sample_development, sample_baseline)
    assert res["daily_total_trips"] > 0
    assert res["vehicular_trips"] <= res["daily_total_trips"]
    assert res["peak_hour_trips"] <= res["vehicular_trips"]
    assert res["post_dev_road_capacity_pct"] >= res["baseline_road_capacity_pct"]
    assert res["transit_share_pct"] > 0

def test_mobility_typology_differences(sample_location, sample_baseline):
    # Highway / Residential vs Mall
    mall_dev = DevelopmentInput(
        dev_type="mall", title="Mall", location=sample_location,
        built_up_area_sqft=500000.0, floors=4, visitor_capacity_daily=10000,
        parking_spaces=500, green_area_hectares=1.0, operating_hours_per_day=12.0,
        construction_duration_months=18
    )
    res_dev = DevelopmentInput(
        dev_type="residential", title="Apts", location=sample_location,
        built_up_area_sqft=500000.0, floors=4, visitor_capacity_daily=2000,
        parking_spaces=500, green_area_hectares=1.0, operating_hours_per_day=24.0,
        construction_duration_months=18
    )
    res_mall = calculate_mobility_impact(mall_dev, sample_baseline)
    res_res = calculate_mobility_impact(res_dev, sample_baseline)
    # Mall should produce more trips than residential of same sqft
    assert res_mall["daily_total_trips"] > res_res["daily_total_trips"]

def test_pollution_gaussian_dispersion(sample_development, sample_baseline):
    mob = calculate_mobility_impact(sample_development, sample_baseline)
    poll = calculate_pollution_impact(sample_development, sample_baseline, mob)
    
    assert poll["construction_pm10_tonnes"] > 0
    assert poll["operational_pm25_increase_pct"] >= 0
    assert poll["annual_co2_tonnes"] > 0
    
    buffers = poll["spatial_buffers"]
    assert len(buffers) == 4
    # Radial decay check: 250m > 500m > 1000m > 3000m
    pm25_rings = [b.pm25_increase_pct for b in buffers]
    assert pm25_rings[0] >= pm25_rings[1] >= pm25_rings[2] >= pm25_rings[3]

def test_resource_demands(sample_development, sample_baseline):
    mob = calculate_mobility_impact(sample_development, sample_baseline)
    poll = calculate_pollution_impact(sample_development, sample_baseline, mob)
    res = calculate_resource_impact(sample_development, sample_baseline, mob, poll)
    
    assert res["water_daily_litres"] > 0
    assert res["sewage_daily_litres"] == pytest.approx(res["water_daily_litres"] * 0.80)
    assert res["power_kwh_daily"] > 0
    assert 0.0 <= res["infrastructure_stress_index"] <= 100.0

def test_economic_gva_and_jobs(sample_development, sample_baseline):
    econ = calculate_economic_impact(sample_development, sample_baseline)
    assert econ["construction_investment_cr"] > 0
    assert econ["direct_jobs"] > 0
    assert econ["total_jobs"] > econ["direct_jobs"]
    assert econ["annual_economic_activity_cr"] > 0

def test_scenario_engine_scoring_and_scenarios(sample_development, sample_baseline):
    mob = calculate_mobility_impact(sample_development, sample_baseline)
    poll = calculate_pollution_impact(sample_development, sample_baseline, mob)
    res = calculate_resource_impact(sample_development, sample_baseline, mob, poll)
    econ = calculate_economic_impact(sample_development, sample_baseline)
    
    sim = build_simulation_engine(sample_development, sample_baseline, mob, poll, res, econ)
    
    assert 0.0 <= sim["horizon_score"] <= 100.0
    assert 0.0 <= sim["infrastructure_stress_index"] <= 100.0
    assert len(sim["scenarios"]) == 4
    # Check that recommended scenario is flagged
    assert any(s.is_recommended for s in sim["scenarios"])
    assert len(sim["temporal_projections"]) == 5
    assert len(sim["positive_impacts"]) > 0
    assert len(sim["negative_impacts"]) > 0
    assert len(sim["mitigation_recommendations"]) > 0
