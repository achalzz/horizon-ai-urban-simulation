from models.development_schema import DevelopmentInput, SpatialBaselineData

def calculate_economic_impact(dev: DevelopmentInput, baseline: SpatialBaselineData):
    # Direct Construction Investment (₹ crore): Approx ₹4,500 / sq ft built-up cost
    construction_cost_cr = (dev.built_up_area_sqft * 4500.0) / 10000000.0
    
    # Direct Employment (Jobs created)
    if dev.dev_type in ["mall", "mixed_use", "office_complex"]:
        direct_jobs = int(dev.built_up_area_sqft / 350.0)
    elif dev.dev_type in ["residential"]:
        direct_jobs = int(dev.built_up_area_sqft / 2500.0)  # Maintenance & management
    elif dev.dev_type in ["hospital"]:
        direct_jobs = int(dev.built_up_area_sqft / 200.0)  # Doctors, nurses, admin
    else:
        direct_jobs = int(dev.built_up_area_sqft / 800.0)
        
    indirect_jobs = int(direct_jobs * 1.45)
    total_jobs = direct_jobs + indirect_jobs
    
    # Annual Economic Activity (₹ crore / year)
    if dev.dev_type in ["mall", "mixed_use"]:
        annual_gdp_cr = (dev.built_up_area_sqft * 9500.0) / 10000000.0
        retail_displacement_pct = min(18.0, 4.0 + (baseline.existing_commercial_1km * 0.8))
    elif dev.dev_type in ["residential"]:
        annual_gdp_cr = (dev.housing_units or 1500) * 0.08  # Local household consumption expenditure
        retail_displacement_pct = 0.0
    else:
        annual_gdp_cr = construction_cost_cr * 0.15
        retail_displacement_pct = 2.0
        
    # Annual Local Municipal Tax / GST Contribution (₹ crore / year)
    tax_contribution_cr = annual_gdp_cr * 0.09
    
    return {
        "construction_investment_cr": round(construction_cost_cr, 1),
        "direct_jobs": direct_jobs,
        "indirect_jobs": indirect_jobs,
        "total_jobs": total_jobs,
        "annual_economic_activity_cr": round(annual_gdp_cr, 1),
        "annual_tax_contribution_cr": round(tax_contribution_cr, 2),
        "retail_displacement_pct": round(retail_displacement_pct, 1)
    }
