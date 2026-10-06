"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { FormDrawer } from "@/components/FormDrawer";
import { MapContainer } from "@/components/MapContainer";
import { PositiveNegativeLedger } from "@/components/PositiveNegativeLedger";
import { TemporalTimeline } from "@/components/TemporalTimeline";
import { RadarMetrics } from "@/components/RadarMetrics";
import { StressGauge } from "@/components/StressGauge";
import { ChallengeDrawer } from "@/components/ChallengeDrawer";

import { DevelopmentInput, LocationInput, SimulationResponse } from "@/types/horizon";
import { runSimulation, fetchBaseline } from "@/lib/api";

export default function HorizonWorkbench() {
  const [location, setLocation] = useState<LocationInput>({
    lat: 28.4950,
    lng: 77.0895,
    address: "Gurugram Cyber City / NH-48 Corridor",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [simData, setSimData] = useState<SimulationResponse | null>(null);

  // Initial simulation load for default Gurugram Commercial Mall proposal
  useEffect(() => {
    handleSimulate({
      dev_type: "mall",
      title: "Grand Horizon Commercial Mall",
      location,
      built_up_area_sqft: 1500000,
      floors: 6,
      visitor_capacity_daily: 25000,
      parking_spaces: 2000,
      green_area_hectares: 3.0,
      operating_hours_per_day: 14,
      construction_duration_months: 24,
    });
  }, []);

  const handleSimulate = async (input: DevelopmentInput) => {
    setIsLoading(true);
    try {
      const result = await runSimulation(input);
      setSimData(result);
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = async (loc: LocationInput) => {
    setLocation(loc);
    if (simData) {
      handleSimulate({
        ...simData.development,
        location: loc,
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col space-y-6 pb-12">
      {/* Platform Header */}
      <Header
        baseline={simData?.spatial_baseline}
        horizonScore={simData?.horizon_score}
        confidenceScore={simData?.confidence_score}
      />

      <div className="max-w-[1700px] w-full mx-auto px-4 md:px-6 space-y-6">
        {/* Top Grid: Form Drawer (Left), 2D/3D Map (Center), Stress & Radar (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Input Form Drawer (3 cols) */}
          <div className="lg:col-span-3">
            <FormDrawer
              location={location}
              onSimulate={handleSimulate}
              isLoading={isLoading}
            />
          </div>

          {/* Center 2D/3D Interactive Map (6 cols) */}
          <div className="lg:col-span-6">
            <MapContainer
              location={location}
              onLocationSelect={handleLocationSelect}
              spatialBuffers={simData?.spatial_buffers}
              devTitle={simData?.development.title}
            />
          </div>

          {/* Right Metrics Panel (3 cols) */}
          <div className="lg:col-span-3 flex flex-col space-y-6">
            {simData && (
              <>
                <StressGauge iss={simData.infrastructure_stress_index} />
                <RadarMetrics dimensionScores={simData.dimension_scores} />
              </>
            )}
          </div>
        </div>

        {/* Results Workspace: Ledger, Timeline, and Challenge Optimizer */}
        {simData && (
          <div className="space-y-6">
            {/* Positive vs Negative Impact Ledger */}
            <PositiveNegativeLedger
              positiveScore={simData.positive_score}
              negativeScore={simData.negative_score}
              netUtilityScore={simData.net_utility_score}
              positiveImpacts={simData.positive_impacts}
              negativeImpacts={simData.negative_impacts}
            />

            {/* 50-Year Temporal Projection Timeline (2026-2070) */}
            <TemporalTimeline temporalProjections={simData.temporal_projections} />

            {/* Challenge My Decision AI Optimizer */}
            <ChallengeDrawer
              scenarios={simData.scenarios}
              mitigations={simData.mitigation_recommendations}
              sacrifices={simData.sacrifices_summary}
              aiSummary={simData.ai_summary_explanation}
            />
          </div>
        )}
      </div>
    </main>
  );
}
