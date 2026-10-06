import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any

from models.development_schema import (
    DevelopmentInput, LocationInput, SpatialBaselineData, SimulationResponse
)
from services.spatial_engine import get_spatial_baseline, NCR_ZONES
from services.mobility_model import calculate_mobility_impact
from services.pollution_model import calculate_pollution_impact
from services.resource_model import calculate_resource_impact
from services.economic_model import calculate_economic_impact
from services.scenario_engine import build_simulation_engine
from services.llm_explainer import generate_ai_explanation

app = FastAPI(
    title="HORIZON NCR Engine API",
    description="AI Development Impact & Future Simulation Platform for Delhi-NCR",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "system": "HORIZON NCR Engine v1.0",
        "region": "Delhi-NCR",
        "data_sources": ["OpenStreetMap", "DDA Draft MPD-2041", "CPCB AQI", "Delhi Open Transit Data"]
    }

@app.post("/api/baseline", response_model=SpatialBaselineData)
def get_location_baseline(location: LocationInput):
    return get_spatial_baseline(location)

@app.post("/api/simulate", response_model=SimulationResponse)
def run_development_simulation(dev: DevelopmentInput):
    # 1. Fetch spatial baseline for selected coordinates
    baseline = get_spatial_baseline(dev.location)
    
    # 2. Run modular causal simulation engines
    mobility = calculate_mobility_impact(dev, baseline)
    pollution = calculate_pollution_impact(dev, baseline, mobility)
    resource = calculate_resource_impact(dev, baseline, mobility, pollution)
    economic = calculate_economic_impact(dev, baseline)
    
    # 3. Build scenarios, ledgers, temporal curves & scores
    sim_results = build_simulation_engine(dev, baseline, mobility, pollution, resource, economic)
    
    # 4. Generate local AI explanation (Ollama / Deterministic Synthesizer)
    ai_explanation = generate_ai_explanation(
        dev=dev,
        baseline=baseline,
        horizon_score=sim_results["horizon_score"],
        iss=sim_results["infrastructure_stress_index"],
        positive_score=sim_results["positive_score"],
        negative_score=sim_results["negative_score"],
        mitigations=sim_results["mitigation_recommendations"],
        sacrifices=sim_results["sacrifices_summary"]
    )
    
    return SimulationResponse(
        development=dev,
        spatial_baseline=baseline,
        horizon_score=sim_results["horizon_score"],
        infrastructure_stress_index=sim_results["infrastructure_stress_index"],
        positive_score=sim_results["positive_score"],
        negative_score=sim_results["negative_score"],
        net_utility_score=sim_results["net_utility_score"],
        dimension_scores=sim_results["dimension_scores"],
        positive_impacts=sim_results["positive_impacts"],
        negative_impacts=sim_results["negative_impacts"],
        spatial_buffers=pollution["spatial_buffers"],
        temporal_projections=sim_results["temporal_projections"],
        scenarios=sim_results["scenarios"],
        mitigation_recommendations=sim_results["mitigation_recommendations"],
        sacrifices_summary=sim_results["sacrifices_summary"],
        ai_summary_explanation=ai_explanation,
        confidence_score=86.5,
        data_sources=[
            "OpenStreetMap Vector Data (Delhi-NCR)",
            "DDA Draft Master Plan 2041 Spatial Zoning",
            "CPCB National Air Quality Index (OGD Sameer)",
            "Delhi Open Transit Data (GTFS DMRC & Bus Network)",
            "ITE Trip Generation Manual 10th Edition (Delhi Adjusted)"
        ]
    )

@app.get("/api/zones")
def get_ncr_zones():
    return {"zones": NCR_ZONES}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
