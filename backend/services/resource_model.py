from models.development_schema import DevelopmentInput, SpatialBaselineData

def calculate_resource_impact(dev: DevelopmentInput, baseline: SpatialBaselineData, mobility_data: dict, pollution_data: dict):
    # Water Demand: Commercial Mall ~ 45 L/visitor/day; Residential ~ 135 L/capita/day (CPHEEO norms)
    if dev.dev_type in ["residential"]:
        per_unit_capita = 4.0
        residents = (dev.housing_units or int(dev.built_up_area_sqft / 900)) * per_unit_capita
        water_daily_litres = residents * 135.0
    elif dev.dev_type in ["mall", "mixed_use", "office_complex"]:
        water_daily_litres = dev.visitor_capacity_daily * 45.0 + (dev.built_up_area_sqft * 0.15)
    elif dev.dev_type in ["hospital"]:
        water_daily_litres = dev.visitor_capacity_daily * 350.0  # Hospital per bed / staff norm
    else:
        water_daily_litres = dev.visitor_capacity_daily * 30.0
        
    sewage_daily_litres = water_daily_litres * 0.80
    
    # Power Demand (kWh/day) & Peak Cooling Load
    power_kwh_daily = (dev.built_up_area_sqft * 0.22) * (dev.operating_hours_per_day / 12.0)
    solid_waste_tonnes_year = (dev.visitor_capacity_daily * 0.45 * 365.0) / 1000.0
    
    # Baseline Stress Adjustments
    water_stress_multiplier = {"Critical": 1.4, "High": 1.25, "Moderate": 1.1, "Safe": 1.0}.get(baseline.water_stress_level, 1.2)
    water_capacity_impact_pct = min(45.0, (water_daily_litres / 1000000.0) * 12.0 * water_stress_multiplier)
    power_capacity_impact_pct = min(35.0, (power_kwh_daily / 10000.0) * 1.5)
    sewer_capacity_impact_pct = min(40.0, (sewage_daily_litres / 1000000.0) * 10.0)
    
    # Composite Infrastructure Stress Score (0 to 100)
    # ISS = 0.35 * Traffic + 0.25 * Water + 0.20 * Power + 0.20 * AQI Burden
    iss = (
        0.35 * mobility_data["post_dev_road_capacity_pct"] +
        0.25 * (baseline.road_capacity_pct * 0.4 + water_capacity_impact_pct * 2.0) +
        0.20 * (50.0 + power_capacity_impact_pct * 1.2) +
        0.20 * (baseline.baseline_aqi_pm25 / 3.0 + pollution_data["operational_pm25_increase_pct"] * 2.0)
    )
    iss = max(10.0, min(98.0, iss))
    
    return {
        "water_daily_litres": round(water_daily_litres),
        "water_daily_mld": round(water_daily_litres / 1000000.0, 2),
        "sewage_daily_litres": round(sewage_daily_litres),
        "power_kwh_daily": round(power_kwh_daily),
        "power_mwh_annual": round(power_kwh_daily * 365.0 / 1000.0, 1),
        "solid_waste_tonnes_year": round(solid_waste_tonnes_year, 1),
        "water_capacity_impact_pct": round(water_capacity_impact_pct, 1),
        "power_capacity_impact_pct": round(power_capacity_impact_pct, 1),
        "sewer_capacity_impact_pct": round(sewer_capacity_impact_pct, 1),
        "infrastructure_stress_index": round(iss, 1)
    }
