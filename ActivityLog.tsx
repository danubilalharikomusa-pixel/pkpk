import React, { useState } from "react";
import { AppState } from "../types";
import { Terminal, Trash2, SlidersHorizontal, Info, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

export interface LogItem {
  id: string;
  time: string;
  msg: string;
  type: "info" | "warn" | "ok" | "error";
}

interface ActivityLogProps {
  logs: LogItem[];
  onClearLogs: () => void;
}

export default function ActivityLog({ logs, onClearLogs }: ActivityLogProps) {
  const [filter, setFilter] = useState<string>("ALL");

  const filteredLogs = logs.filter((log) => {
    if (filter === "ALL") return true;
    if (filter === "OK_INFO") return log.type === "ok" || log.type === "info";
    if (filter === "WARN_ERROR") return log.type === "warn" || log.type === "error";
    return true;
  });

  const getLogIcon = (type: string) => {
    switch (type) {
      case "ok":
        return <CheckCircle className="w-3.5 h-3.5 text-green-400" />;
      case "warn":
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case "error":
        return <AlertCircle className="w-3.5 h-3.5 text-red-400" />;
      case "info":
      default:
        return <Info className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  const getLogStyle = (type: string) => {
    switch (type) {
      case "ok":
        return "text-[#00ff88]/80 bg-green-950/10 border-green-500/10";
      case "warn":
        return "text-amber-400 bg-amber-950/10 border-amber-500/10";
      case "error":
        return "text-red-400 bg-red-950/10 border-red-500/10";
      case "info":
      default:
        return "text-cyan-400/80 bg-[#0f1318] border-[#252e3a]/40";
    }
  };

  return (
    <div id="smart_drying_activity_logs" className="bg-[#181e27] border border-[#1e2730] rounded-lg p-5">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <div>
            <h4 className="font-cond font-bold text-[#c8d6e5] text-base tracking-wider uppercase">
              Log Aktivitas Sistem
            </h4>
            <span className="font-mono text-[9px] text-[#6b7f96] tracking-wider block">
              REALTIME EVENT BUS — MAX 30 ENTRIES
            </span>
          </div>
        </div>

        {/* Filters and Tools */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-[#0f1318] border border-[#252e3a] p-0.5 rounded text-[10px] font-mono font-medium">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-2.5 py-1 rounded transition ${filter === "ALL" ? "bg-[#252e3a] text-white" : "text-[#6b7f96] hover:text-slate-300"}`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter("OK_INFO")}
              className={`px-2.5 py-1 rounded transition ${filter === "OK_INFO" ? "bg-[#252e3a] text-cyan-400" : "text-[#6b7f96] hover:text-slate-300"}`}
            >
              Info
            </button>
            <button
              onClick={() => setFilter("WARN_ERROR")}
              className={`px-2.5 py-1 rounded transition ${filter === "WARN_ERROR" ? "bg-[#252e3a] text-amber-400" : "text-[#6b7f96] hover:text-slate-300"}`}
            >
              Warning/Error
            </button>
          </div>

          <button
            onClick={onClearLogs}
            className="p-1.5 border border-[#252e3a] hover:bg-slate-800 text-[#6b7f96] hover:text-red-400 rounded transition"
            title="Clear Log History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Logs container */}
      <div className="border border-[#1e2730] bg-[#0c0e12] rounded-lg p-3">
        <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto pr-1">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`flex items-start gap-2.5 px-3 py-2 rounded border text-xs font-mono transition-all duration-200 ${getLogStyle(log.type)}`}
              >
                <span className="text-[#3a4a5c] whitespace-nowrap select-none font-bold">
                  {log.time}
                </span>
                <span className="flex-shrink-0 mt-0.5">{getLogIcon(log.type)}</span>
                <span className="leading-relaxed flex-1 break-words">{log.msg}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-10 font-mono text-xs text-[#3a4a5c]">
              // TIDAK ADA LOG COCOK DENGAN FILTER
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
