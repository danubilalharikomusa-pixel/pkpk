import React from "react";
import { AppState } from "../types";
import { Zap, AlertTriangle, ArrowDown, ArrowUp, Wind } from "lucide-react";
import ClotheslineVisual from "./ClotheslineVisual";

interface ControlPanelsProps {
  appState: AppState;
  onControlAction: (type: string, value: string) => Promise<void>;
}

export default function ControlPanels({ appState, onControlAction }: ControlPanelsProps) {
  const { modeJemuran, modeFan, targetJemuran, targetFan, statusJemuran } = appState;

  // Active status of fan based on mode configuration
  const isFanOn = (modeFan === "AUTO") 
    ? (appState.sensor.temp > 31.0 || appState.sensor.rain1 < 2500 || appState.sensor.rain2 < 2500) 
    : (targetFan === "ON");

  // Toggle switch modes helpers
  const handleToggleJemuranMode = () => {
    const nextMode = modeJemuran === "AUTO" ? "MANUAL" : "AUTO";
    onControlAction("modeJemuran", nextMode);
  };

  const handleToggleFanMode = () => {
    const nextMode = modeFan === "AUTO" ? "MANUAL" : "AUTO";
    onControlAction("modeFan", nextMode);
  };

  const handleToggleFanTarget = () => {
    if (modeFan === "AUTO") return; // disabled
    const nextTarget = targetFan === "ON" ? "OFF" : "ON";
    onControlAction("targetFan", nextTarget);
  };

  return (
    <div id="smart_drying_interactive_controls" className="grid grid-cols-1 md:grid-cols-2 gap-5">
      
      {/* 1. STATUS JEMURAN PANEL (LEFT COLUMN) */}
      <div className="bg-[#120e22] border border-[#1d1730] rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg shadow-black/35">
        <div>
          {/* Header with Switch */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-cond font-bold text-base text-white tracking-widest uppercase">
              STATUS JEMURAN
            </h4>
            
            {/* Toggle Switch */}
            <div className="flex items-center gap-2">
              <span className={`font-mono text-[10px] tracking-wider uppercase ${modeJemuran === "AUTO" ? "text-violet-400" : "text-[#6b7f96]"}`}>
                AUTO
              </span>
              <button
                type="button"
                onClick={handleToggleJemuranMode}
                className="relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-1 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-[#2c1d4e]"
                style={{ backgroundColor: modeJemuran === "MANUAL" ? "#8b5cf6" : "#2c1d4e" }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-[1px] ml-[1px]"
                  style={{ transform: modeJemuran === "MANUAL" ? "translateX(20px)" : "translateX(0px)" }}
                />
              </button>
              <span className={`font-mono text-[10px] tracking-wider uppercase ${modeJemuran === "MANUAL" ? "text-violet-400" : "text-[#6b7f96]"}`}>
                MANUAL
              </span>
            </div>
          </div>

          {/* Interactive animated clothesline */}
          <div className="mb-3">
            <ClotheslineVisual statusJemuran={statusJemuran} />
          </div>

          {/* Central status subtitle */}
          <div className="text-center py-1">
            <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wide">
              {modeJemuran === "AUTO" 
                ? "Mode AUTO — dikontrol fuzzy ESP32" 
                : "Mode MANUAL — dikontrol dari web"
              }
            </p>
          </div>
        </div>

        {/* Foot Control Action Buttons */}
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onControlAction("targetJemuran", "masuk")}
              disabled={modeJemuran === "AUTO"}
              className={`py-3.5 px-4 font-cond font-bold text-sm tracking-widest uppercase rounded-lg border transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                modeJemuran === "AUTO"
                  ? "opacity-25 border-[#1d1730] text-[#3a2f5c] bg-[#0c0916] cursor-not-allowed"
                  : statusJemuran === "masuk"
                  ? "bg-red-950/25 border-red-500 text-red-400 font-black shadow-lg shadow-red-500/10"
                  : "bg-red-950/5 border-[#2c1a24] text-red-500/80 hover:bg-red-950/15 hover:border-red-500/40 hover:text-red-400"
              }`}
            >
              <ArrowDown className="w-4 h-4" />
              ↓ MASUK
            </button>

            <button
              onClick={() => onControlAction("targetJemuran", "keluar")}
              disabled={modeJemuran === "AUTO"}
              className={`py-3.5 px-4 font-cond font-bold text-sm tracking-widest uppercase rounded-lg border transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                modeJemuran === "AUTO"
                  ? "opacity-25 border-[#1d1730] text-[#3a2f5c] bg-[#0c0916] cursor-not-allowed"
                  : statusJemuran === "keluar"
                  ? "bg-green-950/25 border-emerald-500 text-green-400 font-black shadow-lg shadow-emerald-500/10"
                  : "bg-[#0f2118]/20 border-[#1f2d24] text-emerald-500/85 hover:bg-[#0f2118]/40 hover:border-emerald-500/45 hover:text-emerald-400"
              }`}
            >
              <ArrowUp className="w-4 h-4" />
              ↑ KELUAR
            </button>
          </div>
        </div>
      </div>

      {/* 2. EXHAUST FAN PANEL (RIGHT COLUMN) */}
      <div className="bg-[#120e22] border border-[#1d1730] rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg shadow-black/35">
        <div>
          {/* Header with Switch */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-cond font-bold text-base text-white tracking-widest uppercase">
              EXHAUST FAN
            </h4>
            
            {/* Toggle Switch */}
            <div className="flex items-center gap-2">
              <span className={`font-mono text-[10px] tracking-wider uppercase ${modeFan === "AUTO" ? "text-violet-400" : "text-[#6b7f96]"}`}>
                AUTO
              </span>
              <button
                type="button"
                onClick={handleToggleFanMode}
                className="relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-1 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-[#2c1d4e]"
                style={{ backgroundColor: modeFan === "MANUAL" ? "#8b5cf6" : "#2c1d4e" }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-[1px] ml-[1px]"
                  style={{ transform: modeFan === "MANUAL" ? "translateX(20px)" : "translateX(0px)" }}
                />
              </button>
              <span className={`font-mono text-[10px] tracking-wider uppercase ${modeFan === "MANUAL" ? "text-violet-400" : "text-[#6b7f96]"}`}>
                MANUAL
              </span>
            </div>
          </div>

          {/* Large Spinning Exhaust circular layout matching screenshot */}
          <div className="h-[180px] bg-[#0c0a1a] border border-[#211b3b] rounded-lg overflow-hidden flex flex-col items-center justify-center relative">
            
            {/* Outer neon violet ring */}
            <div className={`w-28 h-28 rounded-full border-3 flex items-center justify-center transition-all duration-300 relative ${
              isFanOn 
                ? "border-violet-500 shadow-[0_0_24px_rgba(139,92,246,0.4)] bg-violet-950/10" 
                : "border-[#25203f] bg-slate-950/30"
            }`}>
              
              {/* Spinner icon */}
              <Wind 
                className={`w-14 h-14 ${
                  isFanOn 
                    ? appState.sensor.temp > 31.0 ? "text-violet-400 animate-fan-spin-fast" : "text-violet-400 animate-fan-spin"
                    : "text-slate-600"
                }`} 
              />

              {/* Decorative dynamic velocity light dots around */}
              {isFanOn && (
                <div className="absolute inset-0 border border-dashed border-violet-400/40 rounded-full animate-spin" style={{ animationDuration: "12s" }} />
              )}
            </div>

            {/* Floating indicator tag in exact center matching screenshot */}
            <div className="mt-4">
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-mono tracking-widest font-black transition-all ${
                isFanOn 
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/20" 
                  : "bg-[#181330] text-slate-500 border border-[#231b46]"
              }`}>
                {isFanOn ? "EXHAUST ON" : "EXHAUST OFF"}
              </span>
            </div>
          </div>

          {/* Central status text */}
          <div className="text-center py-2 mt-1">
            <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wide">
              {modeFan === "AUTO" 
                ? "Mode AUTO — dikontrol fuzzy ESP32" 
                : "Mode MANUAL — dikontrol dari web"
              }
            </p>
          </div>
        </div>

        {/* Full-width Toggle control button at the foot */}
        <div className="mt-4">
          <button
            onClick={handleToggleFanTarget}
            disabled={modeFan === "AUTO"}
            className={`w-full py-3.5 font-cond font-bold text-sm tracking-widest uppercase rounded-lg border transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              modeFan === "AUTO"
                ? "opacity-25 border-[#1d1730] text-[#3a2f5c] bg-[#0c0916] cursor-not-allowed"
                : isFanOn
                ? "bg-violet-950/25 border-violet-500 text-violet-400 shadow-md shadow-violet-500/10"
                : "bg-violet-950/5 border-[#231a3b] text-violet-500 hover:bg-violet-950/15 hover:border-violet-500/30"
            }`}
          >
            🌀 ON / OFF FAN
          </button>
        </div>
      </div>

    </div>
  );
}
