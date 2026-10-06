from models.development_schema import (
    DevelopmentInput, SpatialBaselineData, DimensionScores, PositiveImpactItem,
    NegativeImpactItem, TemporalPoint, ScenarioOutput
)
from typing import List, Dict, Tuple

def build_simulation_engine(
    dev: DevelopmentInput,
    baseline: SpatialBaselineData,
    mobility: dict,
    pollution: dict,
    resource: dict,
    economic: dict
) -> dict:
    
    # 1. Dimension Scores (0 to 100)
    score_econ = min(96.0, max(20.0, 45.0 + (economic["total_jobs"] / 250.0) + (economic["annual_economic_activity_cr"] / 15.0)))
    score_soc = min(92.0, max(25.0, 50.0 + mobility["accessibility_increase_pct"] * 1.1 - (economic["retail_displacement_pct"] * 0.8)))
    
    score_env = max(15.0, min(95.0, 78.0 - pollution["operational_pm25_increase_pct"] * 2.2 - pollution["construction_pm10_increase_pct"] * 1.1 + (dev.green_area_hectares * 2.5)))
    score_mob = max(15.0, min(95.0, 85.0 - mobility["traffic_increase_pct"] * 2.4 - (mobility["parking_deficit"] / 100.0)))
    score_res = max(15.0, min(95.0, 82.0 - resource["water_capacity_impact_pct"] * 1.4 - resource["power_capacity_impact_pct"] * 0.8))
    score_infra = max(15.0, min(95.0, 100.0 - resource["infrastructure_stress_index"] * 0.85))
    score_climate = max(20.0, min(95.0, 72.0 - (pollution["annual_co2_tonnes"] / 2000.0) + (dev.green_area_hectares * 3.2)))

    dimension_scores = DimensionScores(
        economic=round(score_econ, 1),
        social=round(score_soc, 1),
        environmental=round(score_env, 1),
        mobility=round(score_mob, 1),
        resources=round(score_res, 1),
        infrastructure=round(score_infra, 1),
        climate_resilience=round(score_climate, 1)
    )

    # 2. Composite Horizon Score & Net Utility
    horizon_score = round((score_econ * 0.20 + score_soc * 0.15 + score_env * 0.20 + score_mob * 0.15 + score_res * 0.15 + score_infra * 0.15), 1)
    
    positive_raw_score = round((score_econ + score_soc + mobility["accessibility_increase_pct"] * 1.5 + (economic["total_jobs"] / 300.0)) / 2.2, 1)
    negative_raw_score = round((resource["infrastructure_stress_index"] * 0.55 + pollution["operational_pm25_increase_pct"] * 1.4 + mobility["traffic_increase_pct"] * 1.6 + resource["water_capacity_impact_pct"] * 0.8), 1)
    net_utility_score = round(positive_raw_score - negative_raw_score, 1)
    
    # 3. Itemized Positive & Negative Ledgers
    positive_items: List[PositiveImpactItem] = [
        PositiveImpactItem(
            id="p1",
            category="Economy",
            title="Employment Creation",
            value=f"+{economic['total_jobs']:,} Jobs",
            numeric_value=economic['total_jobs'],
            unit="jobs",
            description=f"Direct ({economic['direct_jobs']:,}) and indirect ({economic['indirect_jobs']:,}) livelihoods generated across Delhi-NCR."
        ),
        PositiveImpactItem(
            id="p2",
            category="Economy",
            title="Annual Economic Activity",
            value=f"+₹{economic['annual_economic_activity_cr']} Cr/yr",
            numeric_value=economic['annual_economic_activity_cr'],
            unit="INR Crore",
            description=f"Estimated GDP uplift and trade turnover generated annually."
        ),
        PositiveImpactItem(
            id="p3",
            category="Mobility",
            title="30-Min Catchment Accessibility",
            value=f"+{mobility['accessibility_increase_pct']}%",
            numeric_value=mobility['accessibility_increase_pct'],
            unit="percent",
            description=f"Expanded population reach within 30-minute travel radius."
        ),
        PositiveImpactItem(
            id="p4",
            category="Infrastructure",
            title="Municipal Revenue & GST",
            value=f"+₹{economic['annual_tax_contribution_cr']} Cr/yr",
            numeric_value=economic['annual_tax_contribution_cr'],
            unit="INR Crore",
            description=f"Annual civic revenue contribution for local infrastructure maintenance."
        )
    ]

    negative_items: List[NegativeImpactItem] = [
        NegativeImpactItem(
            id="n1",
            category="Traffic",
            title="Peak Road Congestion",
            value=f"+{mobility['traffic_increase_pct']}% Pressure",
            numeric_value=mobility['traffic_increase_pct'],
            unit="percent",
            description=f"Road capacity load increases from {mobility['baseline_road_capacity_pct']}% to {mobility['post_dev_road_capacity_pct']}%.",
            severity="high" if mobility['post_dev_road_capacity_pct'] > 85 else "medium"
        ),
        NegativeImpactItem(
            id="n2",
            category="Environment",
            title="Construction PM10 Burden",
            value=f"+{pollution['construction_pm10_increase_pct']}% Dust",
            numeric_value=pollution['construction_pm10_increase_pct'],
            unit="percent",
            description=f"Estimated {pollution['construction_pm10_tonnes']} tonnes of fugitive dust during {dev.construction_duration_months}-month build phase.",
            severity="critical" if pollution['construction_pm10_increase_pct'] > 18 else "high"
        ),
        NegativeImpactItem(
            id="n3",
            category="Resources",
            title="Daily Water Stress",
            value=f"{resource['water_daily_mld']} MLD Demand",
            numeric_value=resource['water_daily_mld'],
            unit="MLD",
            description=f"Adds {resource['water_capacity_impact_pct']}% additional burden on local groundwater/municipal water grid.",
            severity="critical" if baseline.water_stress_level == "Critical" else "high"
        ),
        NegativeImpactItem(
            id="n4",
            category="Community",
            title="Local Business Displacement",
            value=f"-{economic['retail_displacement_pct']}% Footfall",
            numeric_value=economic['retail_displacement_pct'],
            unit="percent",
            description="Potential retail traffic diversion away from traditional local markets within 1.5 km.",
            severity="medium"
        )
    ]

    # 4. Temporal Projection Points (2026 to 2070)
    temporal_points: List[TemporalPoint] = [
        TemporalPoint(
            year=2026,
            positive_score=round(positive_raw_score * 0.15, 1),
            negative_score=round(negative_raw_score * 0.85, 1), # High construction dust
            net_utility=round(positive_raw_score * 0.15 - negative_raw_score * 0.85, 1),
            traffic_index=mobility['baseline_road_capacity_pct'],
            pm25_index=baseline.baseline_aqi_pm25,
            water_stress_pct=15.0,
            economic_cr=economic['construction_investment_cr'] * 0.3
        ),
        TemporalPoint(
            year=2030,
            positive_score=round(positive_raw_score * 0.85, 1),
            negative_score=round(negative_raw_score * 0.65, 1),
            net_utility=round(positive_raw_score * 0.85 - negative_raw_score * 0.65, 1),
            traffic_index=mobility['post_dev_road_capacity_pct'],
            pm25_index=baseline.baseline_aqi_pm25 + pollution['operational_pm25_increase_pct'] * 0.8,
            water_stress_pct=35.0,
            economic_cr=economic['annual_economic_activity_cr'] * 0.9
        ),
        TemporalPoint(
            year=2040,
            positive_score=round(positive_raw_score * 1.05, 1),
            negative_score=round(negative_raw_score * 0.80, 1),
            net_utility=round(positive_raw_score * 1.05 - negative_raw_score * 0.80, 1),
            traffic_index=min(98.0, mobility['post_dev_road_capacity_pct'] * 1.08),
            pm25_index=baseline.baseline_aqi_pm25 + pollution['operational_pm25_increase_pct'] * 1.1,
            water_stress_pct=55.0,
            economic_cr=economic['annual_economic_activity_cr'] * 1.45
        ),
        TemporalPoint(
            year=2050,
            positive_score=round(positive_raw_score * 1.15, 1),
            negative_score=round(negative_raw_score * 0.95, 1),
            net_utility=round(positive_raw_score * 1.15 - negative_raw_score * 0.95, 1),
            traffic_index=min(99.0, mobility['post_dev_road_capacity_pct'] * 1.14),
            pm25_index=baseline.baseline_aqi_pm25 + pollution['operational_pm25_increase_pct'] * 1.3,
            water_stress_pct=72.0,
            economic_cr=economic['annual_economic_activity_cr'] * 1.9
        ),
        TemporalPoint(
            year=2070,
            positive_score=round(positive_raw_score * 1.25, 1),
            negative_score=round(negative_raw_score * 1.15, 1),
            net_utility=round(positive_raw_score * 1.25 - negative_raw_score * 1.15, 1),
            traffic_index=99.0,
            pm25_index=baseline.baseline_aqi_pm25 + pollution['operational_pm25_increase_pct'] * 1.4,
            water_stress_pct=88.0,
            economic_cr=economic['annual_economic_activity_cr'] * 2.8
        )
    ]

    # 5. Scenarios (S0, S1, S2, S3)
    s0 = ScenarioOutput(
        scenario_id="S0",
        scenario_name="Baseline (No Development)",
        description="Preserve site in current state. Zero new traffic or water demand, but no new job creation.",
        horizon_score=68.0,
        infrastructure_stress_index=round(baseline.road_capacity_pct * 0.7, 1),
        positive_score=22.0,
        negative_score=24.0,
        net_utility_score=-2.0,
        key_changes=["No land-use modification", "Baseline traffic & pollution remain unchanged", "Zero economic investment"],
        is_recommended=False
    )

    s1 = ScenarioOutput(
        scenario_id="S1",
        scenario_name="User Proposal (As Submitted)",
        description=f"Build {dev.title} ({dev.built_up_area_sqft:,.0f} sq ft) with requested parameters.",
        horizon_score=horizon_score,
        infrastructure_stress_index=resource['infrastructure_stress_index'],
        positive_score=positive_raw_score,
        negative_score=negative_raw_score,
        net_utility_score=net_utility_score,
        key_changes=["Full proposed scale", "Standard parking allocation", "Unmitigated construction dust"],
        is_recommended=False
    )

    # S2 AI-Optimized scenario
    opt_horizon = min(94.0, horizon_score + 14.5)
    opt_pos = round(positive_raw_score * 1.08, 1)
    opt_neg = round(negative_raw_score * 0.58, 1)
    s2 = ScenarioOutput(
        scenario_id="S2",
        scenario_name="AI-Optimized Configuration",
        description="18% massing optimization + direct skywalk to Metro + 45% rooftop solar & rainwater harvesting.",
        horizon_score=opt_horizon,
        infrastructure_stress_index=round(resource['infrastructure_stress_index'] * 0.72, 1),
        positive_score=opt_pos,
        negative_score=opt_neg,
        net_utility_score=round(opt_pos - opt_neg, 1),
        key_changes=[
            "Reduce built-up area by 18% to 1.23M sq ft",
            "Direct integrated pedestrian skywalk to Metro station (-32% car traffic)",
            "Mandatory anti-smog guns & wet-suppression dust barriers during construction",
            "Zero liquid discharge (ZLD) STPs cutting freshwater demand by 55%"
        ],
        is_recommended=True
    )

    # S3 Alternative land use
    alt_horizon = min(91.0, horizon_score + 10.0)
    alt_pos = round(positive_raw_score * 0.95, 1)
    alt_neg = round(negative_raw_score * 0.50, 1)
    s3 = ScenarioOutput(
        scenario_id="S3",
        scenario_name="Alternative (Mixed-Use Commercial & Solar Park)",
        description="Convert single-purpose development into high-density transit-oriented mixed-use with green urban forestry.",
        horizon_score=alt_horizon,
        infrastructure_stress_index=round(resource['infrastructure_stress_index'] * 0.65, 1),
        positive_score=alt_pos,
        negative_score=alt_neg,
        net_utility_score=round(alt_pos - alt_neg, 1),
        key_changes=["Balanced commercial retail + civic green plaza", "Integrated EV charging hub", "Enhanced public accessibility score"],
        is_recommended=False
    )

    scenarios = [s0, s1, s2, s3]

    mitigations = [
        "Construct dedicated high-capacity slip roads and deceleration lanes to prevent arterial highway queuing.",
        "Implement real-time AQI monitoring and continuous water misting systems during site excavation.",
        "Incorporate dual-plumbing recycled water systems for cooling towers and landscaping.",
        "Cap surface parking and establish dynamic variable pricing to incentivize metro transit usage."
    ]

    sacrifices = [
        f"Loss of {dev.built_up_area_sqft / 43560.0:.1f} acres of vacant / permeable land cover.",
        f"Local road network congestion increases by +{mobility['traffic_increase_pct']}%.",
        f"Additional daily water draw of {resource['water_daily_mld']} MLD in a {baseline.water_stress_level.lower()} water stress zone."
    ]

    return {
        "horizon_score": horizon_score,
        "infrastructure_stress_index": resource["infrastructure_stress_index"],
        "positive_score": positive_raw_score,
        "negative_score": negative_raw_score,
        "net_utility_score": net_utility_score,
        "dimension_scores": dimension_scores,
        "positive_impacts": positive_items,
        "negative_impacts": negative_items,
        "temporal_projections": temporal_points,
        "scenarios": scenarios,
        "mitigation_recommendations": mitigations,
        "sacrifices_summary": sacrifices
    }
