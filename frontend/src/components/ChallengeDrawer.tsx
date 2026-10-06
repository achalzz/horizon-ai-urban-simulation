import React from "react";
import { ScenarioOutput } from "@/types/horizon";
import { Sparkles, CheckCircle, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

interface ChallengeProps {
  scenarios: ScenarioOutput[];
  mitigations: string[];
  sacrifices: string[];
  aiSummary: string;
}

export const ChallengeDrawer: React.FC<ChallengeProps> = ({
  scenarios,
  mitigations,
  sacrifices,
  aiSummary,
}) => {
  return (
    <div className="w-full glass-panel rounded-2xl p-6 border border-borderDark space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-borderDark/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="h-5 w-5 text-slate-950 font-bold" />
          </div>
          <div>
            <h2 className="text-base font-extrabold uppercase tracking-wider text-slate-100 flex items-center space-x-2">
              <span>"CHALLENGE MY DECISION" — AI SCENARIO OPTIMIZER</span>
            </h2>
            <p className="text-xs text-slate-400">
              Automated alternative configuration generator seeking optimal benefit-to-externality ratio.
            </p>
          </div>
        </div>
      </div>

      {/* AI Synthesis Summary Box */}
      <div className="bg-cardDark border border-emerald-500/30 rounded-xl p-4 space-y-2">
        <div className="flex items-center space-x-2 text-primaryEmerald font-bold text-xs">
          <ShieldCheck className="h-4 w-4" />
          <span>HORIZON AI Strategic Analysis</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{aiSummary}</p>
      </div>

      {/* Scenario Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {scenarios.map((sc) => (
          <div
            key={sc.scenario_id}
            className={`rounded-xl p-4 border flex flex-col justify-between space-y-3 transition-all ${
              sc.is_recommended
                ? "bg-emerald-500/10 border-primaryEmerald shadow-xl shadow-emerald-500/10"
                : "bg-cardDark/80 border-borderDark hover:border-slate-600"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-xs px-2 py-0.5 rounded bg-panelDark text-slate-300">
                  {sc.scenario_id}
                </span>
                {sc.is_recommended && (
                  <span className="text-[9px] font-extrabold uppercase bg-primaryEmerald text-slate-950 px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>RECOMMENDED</span>
                  </span>
                )}
              </div>

              <h4 className="font-bold text-slate-100 text-xs leading-snug">{sc.scenario_name}</h4>
              <p className="text-[11px] text-slate-400 leading-tight">{sc.description}</p>
            </div>

            <div className="space-y-2 border-t border-borderDark/60 pt-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Horizon Score:</span>
                <span className="font-extrabold text-primaryEmerald">{sc.horizon_score} / 100</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Net Utility:</span>
                <span className={`font-bold ${sc.net_utility_score >= 0 ? "text-primaryEmerald" : "text-negativeRed"}`}>
                  {sc.net_utility_score >= 0 ? `+${sc.net_utility_score}` : sc.net_utility_score}
                </span>
              </div>

              <div className="text-[10px] text-slate-300 font-semibold space-y-1">
                {sc.key_changes.slice(0, 2).map((change, i) => (
                  <div key={i} className="flex items-start space-x-1">
                    <ArrowRight className="h-3 w-3 text-cyanBuffer shrink-0 mt-0.5" />
                    <span className="leading-tight">{change}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sacrifices vs Required Mitigations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="bg-cardDark/80 rounded-xl p-4 border border-rose-500/30 space-y-2">
          <h4 className="text-xs font-bold text-negativeRed uppercase tracking-wider flex items-center space-x-1.5">
            <AlertCircle className="h-4 w-4" />
            <span>Critical Externalities & Trade-Offs</span>
          </h4>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            {sacrifices.map((sac, i) => (
              <li key={i}>{sac}</li>
            ))}
          </ul>
        </div>

        <div className="bg-cardDark/80 rounded-xl p-4 border border-emerald-500/30 space-y-2">
          <h4 className="text-xs font-bold text-primaryEmerald uppercase tracking-wider flex items-center space-x-1.5">
            <ShieldCheck className="h-4 w-4" />
            <span>Statutory Mitigation Conditions</span>
          </h4>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            {mitigations.map((mit, i) => (
              <li key={i}>{mit}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
