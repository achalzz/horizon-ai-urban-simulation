from models.development_schema import DevelopmentInput, SpatialBaselineData

def calculate_mobility_impact(dev: DevelopmentInput, baseline: SpatialBaselineData):
    # ITE Trip Generation rates per 1,000 sq ft built-up area or per unit / length
    if dev.dev_type in ["mall", "mixed_use", "office_complex"]:
        trip_rate_per_1k = 32.5
    elif dev.dev_type in ["residential"]:
        trip_rate_per_1k = 6.8
    elif dev.dev_type in ["highway"]:
        trip_rate_per_1k = 85.0 * max(1, dev.road_lanes or 2)
    elif dev.dev_type in ["hospital"]:
        trip_rate_per_1k = 18.2
    else:
        trip_rate_per_1k = 12.0
        
    area_units = dev.built_up_area_sqft / 1000.0
    total_daily_trips = area_units * trip_rate_per_1k + (dev.visitor_capacity_daily * 0.45)
    
    # Delhi NCR Modal split factor adjustment
    metro_dist = baseline.metro_proximity_m
    if metro_dist < 400:
        transit_share = 0.45
        auto_car_share = 0.35
    elif metro_dist < 1000:
        transit_share = 0.28
        auto_car_share = 0.55
    else:
        transit_share = 0.15
        auto_car_share = 0.70
        
    vehicular_trips = total_daily_trips * auto_car_share
    peak_hour_trips = vehicular_trips * 0.12  # Peak hour 12% factor
    
    # Existing road capacity load delta
    current_capacity = baseline.road_capacity_pct
    traffic_delta_pct = (peak_hour_trips / 1200.0) * 10.0  # Approx PCU load impact
    new_capacity_pct = min(99.0, current_capacity + traffic_delta_pct)
    
    # Parking deficit
    required_parking = int(total_daily_trips * 0.10)
    parking_deficit = max(0, required_parking - dev.parking_spaces)
    
    # Accessibility improvement (positive outcome)
    accessibility_increase_pct = min(35.0, (dev.built_up_area_sqft / 100000.0) * 1.8 + (transit_share * 20.0))
    
    return {
        "daily_total_trips": round(total_daily_trips),
        "vehicular_trips": round(vehicular_trips),
        "peak_hour_trips": round(peak_hour_trips),
        "baseline_road_capacity_pct": round(current_capacity, 1),
        "post_dev_road_capacity_pct": round(new_capacity_pct, 1),
        "traffic_increase_pct": round(traffic_delta_pct, 1),
        "parking_deficit": parking_deficit,
        "accessibility_increase_pct": round(accessibility_increase_pct, 1),
        "transit_share_pct": round(transit_share * 100, 1)
    }
