import React from "react";
import { PositiveImpactItem, NegativeImpactItem } from "@/types/horizon";
import { TrendingUp, AlertTriangle, Scale, ShieldAlert, CheckCircle2 } from "lucide-react";

interface LedgerProps {
  positiveScore: number;
  negativeScore: number;
  netUtilityScore: number;
  positiveImpacts: PositiveImpactItem[];
  negativeImpacts: NegativeImpactItem[];
}

export const PositiveNegativeLedger: React.FC<LedgerProps> = ({
  positiveScore,
  negativeScore,
  netUtilityScore,
  positiveImpacts,
  negativeImpacts,
}) => {
  const isPositiveNet = netUtilityScore >= 0;

  return (
    <div className="w-full glass-panel rounded-2xl p-6 border border-borderDark space-y-6">
      {/* Header & Balance Ledger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-borderDark/80 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Scale className="h-6 w-6 text-primaryEmerald" />
            <h2 className="text-base font-extrabold uppercase tracking-wider text-slate-100">
              Positive vs. Negative Impact Ledger
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Explicit trade-off ledger separating gross economic utility from negative urban externalities.
          </p>
        </div>

        {/* Net Sustainable Utility Box */}
        <div className="flex items-center space-x-4 bg-cardDark border border-borderDark px-4 py-2.5 rounded-xl">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Net Sustainable Utility</div>
            <div className={`text-xl font-extrabold ${isPositiveNet ? "text-primaryEmerald" : "text-negativeRed"}`}>
              {isPositiveNet ? `+${netUtilityScore}` : netUtilityScore} Score
            </div>
          </div>
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center border ${
              isPositiveNet
                ? "bg-emerald-500/20 border-emerald-500/40 text-primaryEmerald"
                : "bg-rose-500/20 border-rose-500/40 text-negativeRed"
            }`}
          >
            {isPositiveNet ? <CheckCircle2 className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
          </div>
        </div>
      </div>

      {/* Side-by-Side Impact Ledger Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* POSITIVE IMPACT COLUMN */}
        <div className="bg-cardDark/90 rounded-xl p-4 border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
            <div className="flex items-center space-x-2 text-primaryEmerald font-bold text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>🟢 POSITIVE IMPACTS (+{positiveScore})</span>
            </div>
            <span className="text-xs font-extrabold text-primaryEmerald bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              Value Contribution
            </span>
          </div>

          <div className="space-y-3">
            {positiveImpacts.map((item) => (
              <div
                key={item.id}
                className="bg-panelDark/80 rounded-lg p-3 border border-borderDark/60 hover:border-emerald-500/40 transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 text-xs">{item.title}</span>
                  <span className="font-extrabold text-primaryEmerald text-xs">{item.value}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* NEGATIVE IMPACT COLUMN */}
        <div className="bg-cardDark/90 rounded-xl p-4 border border-rose-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-2">
            <div className="flex items-center space-x-2 text-negativeRed font-bold text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>🔴 NEGATIVE EXTERNALITIES (-{negativeScore})</span>
            </div>
            <span className="text-xs font-extrabold text-negativeRed bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
              Urban Burden
            </span>
          </div>

          <div className="space-y-3">
            {negativeImpacts.map((item) => {
              const severityColor =
                item.severity === "critical"
                  ? "border-rose-500/80 bg-rose-500/10"
                  : item.severity === "high"
                  ? "border-amber-500/60 bg-amber-500/10"
                  : "border-borderDark/60 bg-panelDark/80";

              return (
                <div
                  key={item.id}
                  className={`rounded-lg p-3 border transition-all space-y-1 ${severityColor}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 text-xs flex items-center space-x-1.5">
                      <span>{item.title}</span>
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-bold bg-slate-900 text-rose-400">
                        {item.severity}
                      </span>
                    </span>
                    <span className="font-extrabold text-negativeRed text-xs">{item.value}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
