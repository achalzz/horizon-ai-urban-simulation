import React from "react";
import { Activity, ShieldAlert } from "lucide-react";

interface GaugeProps {
  iss: number; // 0 to 100
}

export const StressGauge: React.FC<GaugeProps> = ({ iss }) => {
  const isCritical = iss >= 80;
  const isHigh = iss >= 65 && iss < 80;
  
  const statusLabel = isCritical
    ? "CRITICAL INFRASTRUCTURE STRESS"
    : isHigh
    ? "HIGH INFRASTRUCTURE LOAD"
    : "MODERATE CAPACITY MARGIN";

  const colorClass = isCritical
    ? "text-rose-500 border-rose-500/40 bg-rose-500/10"
    : isHigh
    ? "text-amber-500 border-amber-500/40 bg-amber-500/10"
    : "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-borderDark flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between border-b border-borderDark/80 pb-2">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-warningAmber" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">
            Infrastructure Stress Gauge
          </h3>
        </div>
        <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded border ${colorClass}`}>
          {statusLabel}
        </span>
      </div>

      <div className="flex items-center justify-center py-2 relative">
        <div className="relative flex items-center justify-center w-36 h-36 rounded-full border-8 border-panelDark bg-cardDark">
          <div
            className="absolute inset-0 rounded-full border-8 border-transparent"
            style={{
              borderTopColor: isCritical ? "#f43f5e" : isHigh ? "#f59e0b" : "#10b981",
              transform: `rotate(${(iss / 100) * 360 - 90}deg)`,
              transition: "transform 1s ease-out",
            }}
          />
          <div className="text-center z-10">
            <div className="text-3xl font-black text-slate-100">{iss}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ 100 Index</div>
          </div>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 text-center bg-cardDark/60 p-2 rounded-lg border border-borderDark/60">
        Weighted composite of regional Road Congestion (35%), Water Grid Drawdown (25%), Power Grid Load (20%), and AQI Burden (20%).
      </div>
    </div>
  );
};
