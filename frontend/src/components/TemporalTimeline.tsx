import React from "react";
import { TemporalPoint } from "@/types/horizon";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Clock, TrendingUp } from "lucide-react";

interface TimelineProps {
  temporalProjections: TemporalPoint[];
}

export const TemporalTimeline: React.FC<TimelineProps> = ({ temporalProjections }) => {
  return (
    <div className="w-full glass-panel rounded-2xl p-6 border border-borderDark space-y-4">
      <div className="flex items-center justify-between border-b border-borderDark/80 pb-3">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-cyanBuffer" />
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">
              50-Year Temporal Projection (2026 – 2070)
            </h3>
            <p className="text-xs text-slate-400">
              Long-term trajectory comparing cumulative positive economic utility vs. compounding environmental externalities.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-xs font-semibold">
          <span className="flex items-center space-x-1.5 text-primaryEmerald">
            <span className="w-3 h-3 rounded-full bg-primaryEmerald inline-block" />
            <span>Positive Growth</span>
          </span>
          <span className="flex items-center space-x-1.5 text-negativeRed">
            <span className="w-3 h-3 rounded-full bg-negativeRed inline-block" />
            <span>Compounding Externalities</span>
          </span>
        </div>
      </div>

      <div className="h-[260px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={temporalProjections} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="negGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#232e47" />
            <XAxis dataKey="year" stroke="#94a3b8" tickLine={false} fontSize={12} />
            <YAxis stroke="#94a3b8" tickLine={false} fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111726",
                borderColor: "#232e47",
                borderRadius: "12px",
                color: "#f3f4f6",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="positive_score"
              name="Positive Growth"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#posGrad)"
            />
            <Area
              type="monotone"
              dataKey="negative_score"
              name="Negative Externalities"
              stroke="#f43f5e"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#negGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
