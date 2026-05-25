import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { HistoryData } from "../types";
import { LineChart as ChartIcon, Zap } from "lucide-react";

interface HistoryChartsProps {
  riwayat: HistoryData[];
}

export default function HistoryCharts({ riwayat }: HistoryChartsProps) {
  // Graceful fallback for empty history
  const hasData = riwayat && riwayat.length > 0;

  // Render a custom Tooltip for beautiful dark styles matching standard CSS
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#141920]/95 border border-[#252e3a] p-3 rounded shadow-md font-mono text-[11px]">
          <p className="text-slate-500 mb-1">{label}</p>
          {payload.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-2 justify-between">
              <span style={{ color: item.color }} className="capitalize font-semibold">
                {item.name}:
              </span>
              <span className="text-white font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="smart_drying_history_charts" className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      
      {/* 1. Temp Chart Panel (Takes 1 Col) */}
      <div className="lg:col-span-1 bg-[#181e27] border border-[#1e2730] rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[10px] tracking-wider text-[#6b7f96] uppercase block">
            Riwayat Suhu (°C)
          </span>
          <ChartIcon className="w-4 h-4 text-red-500" />
        </div>

        <div className="h-[200px] w-full font-mono text-[10px]">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riwayat} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff3d3d" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#ff3d3d" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e2730" strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  stroke="#3a4a5c" 
                  tick={{ fill: "#6b7f96", fontSize: 9 }}
                  interval="preserveEnd"
                  tickLine={false}
                />
                <YAxis 
                  stroke="#3a4a5c" 
                  tick={{ fill: "#6b7f96", fontSize: 9 }}
                  domain={[15, 45]}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="temp" 
                  name="Suhu"
                  stroke="#ff3d3d" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#tempGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-[#6b7f96]">
              Menunggu Data Sensor...
            </div>
          )}
        </div>
      </div>

      {/* 2. Light & Rain Levels Chart Panel (Takes 2 Cols) */}
      <div className="lg:col-span-2 bg-[#181e27] border border-[#1e2730] rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[10px] tracking-wider text-[#6b7f96] uppercase block">
            Korelasi Cahaya LDR & Indikator Hujan (ADC Output)
          </span>
          <div className="flex items-center gap-1 text-[#00ff88]">
            <Zap className="w-3.5 h-3.5" />
            <span className="font-mono text-[8px] uppercase text-[#6b7f96]">High-frequency Analyser</span>
          </div>
        </div>

        <div className="h-[200px] w-full font-mono text-[10px]">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riwayat} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="#1e2730" strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  stroke="#3a4a5c" 
                  tick={{ fill: "#6b7f96", fontSize: 9 }}
                  interval="preserveEnd"
                  tickLine={false}
                />
                <YAxis 
                  stroke="#3a4a5c" 
                  tick={{ fill: "#6b7f96", fontSize: 9 }}
                  domain={[0, 4095]}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={30} 
                  iconSize={8}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 9, fontFamily: "Share Tech Mono" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ldr" 
                  name="Intensitas LDR" 
                  stroke="#ffb300" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="rain1" 
                  name="Sensor Hujan 1" 
                  stroke="#00e5ff" 
                  strokeWidth={1.5}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="rain2" 
                  name="Sensor Hujan 2" 
                  stroke="#4d9fff" 
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-[#6b7f96]">
              Menunggu Data Sensor...
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
