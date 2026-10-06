import React, { useState } from "react";
import { DevelopmentInput, DevelopmentType, LocationInput } from "@/types/horizon";
import { Building2, Home, Navigation, Stethoscope, Factory, Train, Play, Layers } from "lucide-react";

interface FormDrawerProps {
  location: LocationInput;
  onSimulate: (input: DevelopmentInput) => void;
  isLoading: boolean;
}

const DEV_TYPES: { type: DevelopmentType; label: string; icon: any }[] = [
  { type: "mall", label: "Commercial Mall", icon: Building2 },
  { type: "residential", label: "Housing / Apartments", icon: Home },
  { type: "highway", label: "Highway / Road", icon: Navigation },
  { type: "hospital", label: "Hospital / Healthcare", icon: Stethoscope },
  { type: "factory", label: "Industrial Factory", icon: Factory },
  { type: "metro_station", label: "Metro Station Hub", icon: Train },
];

export const FormDrawer: React.FC<FormDrawerProps> = ({ location, onSimulate, isLoading }) => {
  const [devType, setDevType] = useState<DevelopmentType>("mall");
  const [title, setTitle] = useState("Horizon NCR Grand Commercial Mall");
  const [builtUpArea, setBuiltUpArea] = useState(1500000);
  const [floors, setFloors] = useState(6);
  const [visitors, setVisitors] = useState(25000);
  const [parking, setParking] = useState(2000);
  const [greenArea, setGreenArea] = useState(3.0);
  const [operatingHours, setOperatingHours] = useState(14);
  const [constructionDuration, setConstructionDuration] = useState(24);
  const [roadLanes, setRoadLanes] = useState(6);
  const [housingUnits, setHousingUnits] = useState(1800);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: DevelopmentInput = {
      dev_type: devType,
      title: title || `Proposed ${devType.toUpperCase()} Project`,
      location,
      built_up_area_sqft: Number(builtUpArea),
      floors: Number(floors),
      visitor_capacity_daily: Number(visitors),
      parking_spaces: Number(parking),
      green_area_hectares: Number(greenArea),
      operating_hours_per_day: Number(operatingHours),
      construction_duration_months: Number(constructionDuration),
      road_lanes: devType === "highway" ? Number(roadLanes) : undefined,
      housing_units: devType === "residential" ? Number(housingUnits) : undefined,
    };
    onSimulate(payload);
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-borderDark flex flex-col space-y-5">
      <div className="flex items-center justify-between border-b border-borderDark/60 pb-3">
        <div className="flex items-center space-x-2">
          <Layers className="h-5 w-5 text-primaryEmerald" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Propose Development
          </h2>
        </div>
        <span className="text-xs font-semibold text-cyanBuffer bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
          {location.address || "Delhi-NCR Site"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Development Type Grid */}
        <div>
          <label className="block text-slate-400 font-medium mb-2">Development Type</label>
          <div className="grid grid-cols-3 gap-2">
            {DEV_TYPES.map((item) => {
              const Icon = item.icon;
              const isSelected = devType === item.type;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => {
                    setDevType(item.type);
                    if (item.type === "residential") setTitle("Horizon Eco Housing Towers");
                    else if (item.type === "highway") setTitle("Dwarka-Gurugram Expressway Link");
                    else setTitle("Horizon NCR Grand Commercial Mall");
                  }}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-emerald-500/15 border-primaryEmerald text-primaryEmerald font-bold shadow-md shadow-emerald-500/10"
                      : "bg-cardDark/60 border-borderDark text-slate-400 hover:border-slate-600 hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-[10px] text-center leading-tight">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-slate-400 font-medium mb-1">Project Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-cardDark border border-borderDark rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-primaryEmerald"
            placeholder="e.g. Grand Horizon Mall"
          />
        </div>

        {/* Built-Up Area Slider */}
        <div>
          <div className="flex justify-between text-slate-300 font-medium mb-1">
            <span>Built-Up Area (sq ft)</span>
            <span suppressHydrationWarning className="text-primaryEmerald font-bold">{Number(builtUpArea).toLocaleString()} sq ft</span>
          </div>
          <input
            type="range"
            min={100000}
            max={5000000}
            step={50000}
            value={builtUpArea}
            onChange={(e) => setBuiltUpArea(Number(e.target.value))}
            className="w-full accent-primaryEmerald cursor-pointer"
          />
        </div>

        {/* Floors & Daily Visitors */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Floors / Height</label>
            <input
              type="number"
              min={1}
              max={60}
              value={floors}
              onChange={(e) => setFloors(Number(e.target.value))}
              className="w-full bg-cardDark border border-borderDark rounded-lg px-3 py-1.5 text-slate-200"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1">Daily Footfall / Visitors</label>
            <input
              type="number"
              min={500}
              max={100000}
              step={500}
              value={visitors}
              onChange={(e) => setVisitors(Number(e.target.value))}
              className="w-full bg-cardDark border border-borderDark rounded-lg px-3 py-1.5 text-slate-200"
            />
          </div>
        </div>

        {/* Parking & Green Area */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Parking Spaces</label>
            <input
              type="number"
              min={50}
              max={10000}
              step={50}
              value={parking}
              onChange={(e) => setParking(Number(e.target.value))}
              className="w-full bg-cardDark border border-borderDark rounded-lg px-3 py-1.5 text-slate-200"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1">Green Cover (Hectares)</label>
            <input
              type="number"
              min={0.1}
              max={25.0}
              step={0.5}
              value={greenArea}
              onChange={(e) => setGreenArea(Number(e.target.value))}
              className="w-full bg-cardDark border border-borderDark rounded-lg px-3 py-1.5 text-slate-200"
            />
          </div>
        </div>

        {/* Conditional Fields */}
        {devType === "highway" && (
          <div>
            <label className="block text-slate-400 font-medium mb-1">Road Lanes</label>
            <input
              type="number"
              min={2}
              max={16}
              value={roadLanes}
              onChange={(e) => setRoadLanes(Number(e.target.value))}
              className="w-full bg-cardDark border border-borderDark rounded-lg px-3 py-1.5 text-slate-200"
            />
          </div>
        )}

        {devType === "residential" && (
          <div>
            <label className="block text-slate-400 font-medium mb-1">Housing Apartments / Units</label>
            <input
              type="number"
              min={50}
              max={25000}
              step={50}
              value={housingUnits}
              onChange={(e) => setHousingUnits(Number(e.target.value))}
              className="w-full bg-cardDark border border-borderDark rounded-lg px-3 py-1.5 text-slate-200"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-extrabold hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Simulating Digital Twin...</span>
            </span>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" />
              <span>SIMULATE DEVELOPMENT IMPACT</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
