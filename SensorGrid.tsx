import React from "react";
import { Thermometer, CloudRain, Sun, Activity } from "lucide-react";
import { SensorData } from "../types";

interface SensorGridProps {
  sensor: SensorData;
}

export default function SensorGrid({ sensor }: SensorGridProps) {
  const temp = sensor.temp ?? 29.5;
  const ldr = sensor.ldr ?? 3200;
  const rain1 = sensor.rain1 ?? 4095;
  const rain2 = sensor.rain2 ?? 4095;
  
  // Calculate raw average of both rain physical sensors to match "Rain Sensor avg"
  const rainAvg = Math.round((rain1 + rain2) / 2);

  // Status indicators mapping matching the user's screenshot details
  const getTempStatus = (t: number) => {
    if (t < 22) return { text: "DINGIN", bg: "bg-blue-900/45 text-blue-300 border-blue-500/20" };
    if (t < 31) return { text: "NORMAL", bg: "bg-emerald-900/40 text-[#00ff88] border-emerald-500/20" };
    return { text: "PANAS", bg: "bg-red-950/45 text-red-300 border-red-500/20" };
  };

  const getRainStatus = (r: number) => {
    if (r < 1200) return { text: "DERAS", bg: "bg-red-950/45 text-red-300 border-red-500/20" };
    if (r < 2500) return { text: "GERIMIS", bg: "bg-amber-950/45 text-amber-300 border-amber-500/20" };
    return { text: "AMAN", bg: "bg-emerald-900/40 text-[#00ff88] border-emerald-500/20" };
  };

  const getLdrStatus = (l: number) => {
    if (l < 1000) return { text: "GELAP", bg: "bg-red-950/20 text-red-400 border-red-500/20" };
    if (l < 2800) return { text: "MENDUNG", bg: "bg-amber-950/30 text-amber-400 border-amber-500/20" };
    return { text: "TERANG", bg: "bg-emerald-900/40 text-[#00ff88] border-emerald-500/20" };
  };

  const tStat = getTempStatus(temp);
  const rStat = getRainStatus(rainAvg);
  const lStat = getLdrStatus(ldr);

  return (
    <div id="recreated_metric_cards_row" className="grid grid-cols-1 md:grid-cols-3 gap-5">
      
      {/* 1. TEMPERATURE CARD */}
      <div className="bg-[#120e22] border border-[#1d1730] rounded-xl p-5 relative overflow-hidden shadow-md transition hover:border-violet-500/25">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-violet-600 via-indigo-600 to-transparent opacity-80" />
        
        <div className="flex items-center gap-2 text-violet-400 font-mono text-[10px] uppercase tracking-widest mb-3.5">
          <Thermometer className="w-3.5 h-3.5" />
          <span>TEMPERATURE</span>
        </div>

        <div className="flex items-baseline gap-1 text-white font-sans font-extrabold tracking-tight my-2.5">
          <span className="text-3xl md:text-4xl">{temp.toFixed(1)}</span>
          <span className="text-lg text-slate-400">°C</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className={`px-3 py-1 text-[8px] font-mono tracking-widest font-bold uppercase rounded-md border ${tStat.bg}`}>
            {tStat.text}
          </span>
          <span className="text-[9px] font-mono text-slate-500 uppercase">DHT22 NODE</span>
        </div>
      </div>

      {/* 2. RAIN SENSOR CARD */}
      <div className="bg-[#120e22] border border-[#1d1730] rounded-xl p-5 relative overflow-hidden shadow-md transition hover:border-violet-500/25">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-indigo-600 to-transparent opacity-80" />
        
        <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest mb-3.5">
          <CloudRain className="w-3.5 h-3.5" />
          <span>Rain Sensor</span>
        </div>

        <div className="flex items-baseline gap-1.5 text-white font-sans font-extrabold tracking-tight my-2.5">
          <span className="text-3xl md:text-4xl">{rainAvg}</span>
          <span className="text-xs text-slate-400 font-mono uppercase">avg</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className={`px-3 py-1 text-[8px] font-mono tracking-widest font-bold uppercase rounded-md border ${rStat.bg}`}>
            {rStat.text}
          </span>
          <span className="text-[9px] font-mono text-slate-500 uppercase">ADC DUAL</span>
        </div>
      </div>

      {/* 3. LIGHT SENSOR CARD */}
      <div className="bg-[#120e22] border border-[#1d1730] rounded-xl p-5 relative overflow-hidden shadow-md transition hover:border-violet-500/25">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-violet-600 to-transparent opacity-80" />
        
        <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest mb-3.5">
          <Sun className="w-3.5 h-3.5" />
          <span>LIGHT SENSOR</span>
        </div>

        <div className="flex items-baseline gap-1 text-white font-sans font-extrabold tracking-tight my-2.5">
          <span className="text-3xl md:text-4xl">{ldr}</span>
          <span className="text-xs text-slate-400 font-mono">lux</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className={`px-3 py-1 text-[8px] font-mono tracking-widest font-bold uppercase rounded-md border ${lStat.bg}`}>
            {lStat.text}
          </span>
          <span className="text-[9px] font-mono text-slate-500 uppercase">GL5539 CELL</span>
        </div>
      </div>

    </div>
  );
}
