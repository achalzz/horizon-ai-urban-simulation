import React from "react";
import { DimensionScores } from "@/types/horizon";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { BarChart3 } from "lucide-react";

interface RadarProps {
  dimensionScores: DimensionScores;
}

export const RadarMetrics: React.FC<RadarProps> = ({ dimensionScores }) => {
  const data = [
    { dimension: "Economic", score: dimensionScores.economic },
    { dimension: "Social", score: dimensionScores.social },
    { dimension: "Environment", score: dimensionScores.environmental },
    { dimension: "Mobility", score: dimensionScores.mobility },
    { dimension: "Resources", score: dimensionScores.resources },
    { dimension: "Infrastructure", score: dimensionScores.infrastructure },
    { dimension: "Climate", score: dimensionScores.climate_resilience },
  ];

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-borderDark space-y-3">
      <div className="flex items-center space-x-2 border-b border-borderDark/80 pb-2">
        <BarChart3 className="h-5 w-5 text-primaryEmerald" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">
          7-Dimension Impact Radar
        </h3>
      </div>

      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#232e47" />
            <PolarAngleAxis dataKey="dimension" stroke="#94a3b8" fontSize={11} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
            <Radar
              name="Scores"
              dataKey="score"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.35}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
