from models.development_schema import DevelopmentInput, SpatialBaselineData, SpatialBufferMetrics
from typing import List

def calculate_pollution_impact(dev: DevelopmentInput, baseline: SpatialBaselineData, mobility_data: dict):
    # Construction Phase Emissions (Dust, PM10, Diesel Equipment)
    duration_months = dev.construction_duration_months
    site_area_ha = (dev.built_up_area_sqft / 107639.0) / max(1, dev.floors)
    
    # PM10 Dust Factor: 1.2 tonnes/ha/month unmitigated
    construction_pm10_tonnes = site_area_ha * 1.2 * (duration_months / 12.0)
    construction_pm10_increase_pct = min(25.0, (site_area_ha * 2.4) + (dev.floors * 0.8))
    
    # Operational Emissions from Vehicular Trips & DG Sets
    daily_vehicular_trips = mobility_data["vehicular_trips"]
    operational_pm25_increase_pct = min(18.0, (daily_vehicular_trips / 1000.0) * 1.1)
    operational_nox_increase_pct = min(22.0, (daily_vehicular_trips / 1000.0) * 1.4)
    
    # CO2 Annual Operational Footprint (tonnes/year)
    annual_co2_tonnes = (daily_vehicular_trips * 12.5 * 365 * 0.18 / 1000.0) + (dev.built_up_area_sqft * 0.012)
    
    # Spatial Dispersion across rings (Gaussian Plume decay approximation)
    buffers: List[SpatialBufferMetrics] = [
        SpatialBufferMetrics(
            distance_m=250,
            pm25_increase_pct=round(operational_pm25_increase_pct * 0.9, 1),
            pm10_increase_pct=round(construction_pm10_increase_pct * 0.95, 1),
            noise_increase_db=round(min(12.0, 4.5 + (dev.floors * 0.6)), 1),
            traffic_increase_pct=round(mobility_data["traffic_increase_pct"], 1)
        ),
        SpatialBufferMetrics(
            distance_m=500,
            pm25_increase_pct=round(operational_pm25_increase_pct * 0.65, 1),
            pm10_increase_pct=round(construction_pm10_increase_pct * 0.60, 1),
            noise_increase_db=round(min(7.0, 2.5 + (dev.floors * 0.3)), 1),
            traffic_increase_pct=round(mobility_data["traffic_increase_pct"] * 0.75, 1)
        ),
        SpatialBufferMetrics(
            distance_m=1000,
            pm25_increase_pct=round(operational_pm25_increase_pct * 0.35, 1),
            pm10_increase_pct=round(construction_pm10_increase_pct * 0.30, 1),
            noise_increase_db=1.2,
            traffic_increase_pct=round(mobility_data["traffic_increase_pct"] * 0.45, 1)
        ),
        SpatialBufferMetrics(
            distance_m=3000,
            pm25_increase_pct=round(operational_pm25_increase_pct * 0.12, 1),
            pm10_increase_pct=round(construction_pm10_increase_pct * 0.08, 1),
            noise_increase_db=0.3,
            traffic_increase_pct=round(mobility_data["traffic_increase_pct"] * 0.20, 1)
        )
    ]
    
    return {
        "construction_pm10_tonnes": round(construction_pm10_tonnes, 1),
        "construction_pm10_increase_pct": round(construction_pm10_increase_pct, 1),
        "operational_pm25_increase_pct": round(operational_pm25_increase_pct, 1),
        "operational_nox_increase_pct": round(operational_nox_increase_pct, 1),
        "annual_co2_tonnes": round(annual_co2_tonnes, 1),
        "spatial_buffers": buffers
    }
