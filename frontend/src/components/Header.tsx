import React from "react";
import { Compass, ShieldCheck, Activity, MapPin, Database } from "lucide-react";
import { SpatialBaselineData } from "@/types/horizon";

interface HeaderProps {
  baseline?: SpatialBaselineData;
  horizonScore?: number;
  confidenceScore?: number;
}

export const Header: React.FC<HeaderProps> = ({ baseline, horizonScore, confidenceScore = 86.5 }) => {
  return (
    <header className="w-full glass-panel border-b border-borderDark px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Compass className="h-6 w-6 text-slate-950 font-bold" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              HORIZON <span className="text-primaryEmerald font-extrabold">NCR</span>
            </h1>
            <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-emerald-500/10 text-primaryEmerald border border-emerald-500/30">
              Delhi-NCR Digital Twin v1.0
            </span>
          </div>
          <p className="text-xs text-slate-400">AI Development Impact & Spatial Future Simulator</p>
        </div>
      </div>

      {baseline && (
        <div className="hidden lg:flex items-center space-x-6 text-xs text-slate-300">
          <div className="flex items-center space-x-2 bg-cardDark/80 border border-borderDark px-3 py-1.5 rounded-lg">
            <MapPin className="h-4 w-4 text-cyanBuffer" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Zone</div>
              <div className="font-medium text-slate-200">{baseline.zone_name}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-cardDark/80 border border-borderDark px-3 py-1.5 rounded-lg">
            <Activity className="h-4 w-4 text-warningAmber" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Baseline AQI (PM2.5)</div>
              <div className="font-medium text-warningAmber">{baseline.baseline_aqi_pm25} µg/m³</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-cardDark/80 border border-borderDark px-3 py-1.5 rounded-lg">
            <Database className="h-4 w-4 text-primaryEmerald" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Data Confidence</div>
              <div className="font-medium text-primaryEmerald">{confidenceScore}% Verified</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3">
        {horizonScore !== undefined && (
          <div className="flex items-center space-x-3 bg-cardDark border border-borderDark px-4 py-1.5 rounded-xl">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">HORIZON Score</div>
              <div className="text-lg font-extrabold text-primaryEmerald">{horizonScore} / 100</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primaryEmerald" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
