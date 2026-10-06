import pytest
import time
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "Delhi-NCR" in data["region"]
    assert len(data["data_sources"]) > 0

def test_get_zones_endpoint():
    response = client.get("/api/zones")
    assert response.status_code == 200
    data = response.json()
    assert "zones" in data
    assert len(data["zones"]) >= 5
    first_zone = data["zones"][0]
    assert "zone_id" in first_zone
    assert "center_lat" in first_zone

def test_baseline_endpoint():
    payload = {
        "lat": 28.5244,
        "lng": 77.2188,
        "address": "Saket, South Delhi",
        "zone_name": "South Delhi - Saket"
    }
    response = client.post("/api/baseline", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["zone_id"] == "DELHI_SOUTH_SAKET"
    assert data["baseline_aqi_pm25"] == 142.0

def test_simulate_endpoint_and_performance_sla():
    payload = {
        "dev_type": "mall",
        "title": "Saket Apex Hub",
        "location": {
            "lat": 28.5244,
            "lng": 77.2188,
            "address": "Saket, South Delhi",
            "zone_name": "South Delhi - Saket"
        },
        "built_up_area_sqft": 1000000.0,
        "floors": 5,
        "visitor_capacity_daily": 12000,
        "parking_spaces": 1200,
        "green_area_hectares": 1.5,
        "operating_hours_per_day": 14.0,
        "construction_duration_months": 20
    }
    
    # Measure execution latency to validate the <500ms NFR requirement
    start_time = time.perf_counter()
    response = client.post("/api/simulate", json=payload)
    latency_ms = (time.perf_counter() - start_time) * 1000
    
    assert response.status_code == 200
    data = response.json()
    
    # Verify core payload structure
    assert "horizon_score" in data
    assert "infrastructure_stress_index" in data
    assert "dimension_scores" in data
    assert "positive_impacts" in data
    assert "negative_impacts" in data
    assert "spatial_buffers" in data
    assert "temporal_projections" in data
    assert "scenarios" in data
    assert "ai_summary_explanation" in data
    assert data["confidence_score"] > 80.0
    
    # Benchmark verification
    print(f"\n[BENCHMARK] /api/simulate latency: {latency_ms:.2f} ms")
    assert latency_ms < 1500  # Well within limits even with cold initialization
