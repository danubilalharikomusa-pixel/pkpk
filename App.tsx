import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Flame, 
  Sun, 
  CloudRain, 
  Cpu, 
  Clock, 
  RefreshCw, 
  Power, 
  Activity, 
  Check, 
  Wifi, 
  WifiOff, 
  Zap, 
  RotateCcw,
  LayoutDashboard,
  LineChart,
  History
} from "lucide-react";

import { AppState, SensorData, HistoryData } from "./types";
import SensorGrid from "./components/SensorGrid";
import ControlPanels from "./components/ControlPanels";
import HistoryCharts from "./components/HistoryCharts";
import ActivityLog, { LogItem } from "./components/ActivityLog";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "monitoring" | "history">("dashboard");
  const [appState, setAppState] = useState<AppState>({
    sensor: {
      temp: 30.1,
      rain1: 4095,
      rain2: 4095,
      ldr: 431,
      kondisi: "CERAH",
      lastUpdate: null
    },
    modeJemuran: "AUTO",
    modeFan: "AUTO",
    targetJemuran: "keluar",
    targetFan: "OFF",
    statusJemuran: "keluar",
    riwayat: []
  });

  const [logs, setLogs] = useState<LogItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  // Populate startup log info
  useEffect(() => {
    const startupLogs: LogItem[] = [
      {
        id: "start-1",
        time: new Date(Date.now() - 4000).toLocaleTimeString("id-ID"),
        msg: "Smart Drying Web API gateway online. Listening on port 3000.",
        type: "info"
      },
      {
        id: "start-2",
        time: new Date(Date.now() - 2000).toLocaleTimeString("id-ID"),
        msg: "ESP32 telemetry data synced successfully. System state updated.",
        type: "ok"
      }
    ];
    setLogs(startupLogs);
  }, []);

  // Sync clock ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("id-ID", { weekday: "short", day: "2-digit", month: "short" }) + 
        " | " + 
        now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // API State Synchronization pull
  const pullStateFromServer = async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true);
    try {
      const res = await fetch("/api/state");
      if (!res.ok) throw new Error("Connection failed");
      const data: AppState = await res.json();
      
      setAppState((prev) => {
        // Track changes and push smart event logs
        if (data.sensor.kondisi !== prev.sensor.kondisi && prev.sensor.kondisi) {
          pushLocalLog(
            `Kondisi Cuaca Berubah: ${prev.sensor.kondisi} ➔ ${data.sensor.kondisi}`, 
            data.sensor.kondisi === "HUJAN" ? "error" : data.sensor.kondisi === "GERIMIS" ? "warn" : "ok"
          );
        }
        if (data.modeJemuran !== prev.modeJemuran) {
          pushLocalLog(`Mode Rel Jemuran beralih: ${data.modeJemuran}`, "info");
        }
        if (data.statusJemuran !== prev.statusJemuran) {
          pushLocalLog(`Posisi Jemuran Bergeser: Aktif Berada di ${data.statusJemuran.toUpperCase()}`, "ok");
        }
        if (data.modeFan !== prev.modeFan) {
          pushLocalLog(`Exhaust blower disetel ke Mode: ${data.modeFan}`, "info");
        }
        return data;
      });

      setIsOnline(true);
    } catch (err) {
      setIsOnline(false);
    } finally {
      if (showLoading) {
        setTimeout(() => setIsRefreshing(false), 300);
      }
    }
  };

  // Poll server state every 2 seconds
  useEffect(() => {
    pullStateFromServer();
    const poller = setInterval(() => {
      pullStateFromServer();
    }, 2000);
    return () => clearInterval(poller);
  }, []);

  const pushLocalLog = (message: string, type: "info" | "warn" | "ok" | "error" = "info") => {
    setLogs((prev) => {
      const newLog: LogItem = {
        id: `log-${Date.now()}-${Math.random()}`,
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        msg: message,
        type: type
      };
      return [newLog, ...prev].slice(0, 30);
    });
  };

  // Control dispatcher
  const handleControlAction = async (type: string, value: string) => {
    try {
      const res = await fetch("/api/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, value })
      });
      const resJson = await res.json();
      if (resJson.ok) {
        setAppState((prev) => ({
          ...prev,
          ...resJson.state
        }));
        pushLocalLog(`Web Dispatcher: ${type} ➔ ${value}`, "ok");
      }
    } catch (e) {
      pushLocalLog("Koneksi gagal mengirim control", "error");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070510] text-[#c8d6e5] font-sans antialiased overflow-x-hidden flex flex-col md:flex-row">
      
      {/* SCANLINE OVERLAY */}
      <div className="pointer-events-none fixed inset-0 bg-repeat-linear z-50 opacity-[0.02]"
        style={{
          backgroundImage: "linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)"
        }}
      />

      {/* ======= SIDEBAR PANEL MENU ======= */}
      <aside className="w-full md:w-64 lg:w-72 bg-[#06040b] border-b md:border-b-0 md:border-r border-[#1d1730] flex flex-col justify-between p-6 md:p-8 flex-shrink-0">
        <div className="space-y-8">
          
          {/* Main big neon title matching screenshot closely */}
          <div>
            <div className="font-cond font-black tracking-wider leading-none text-2xl text-white select-none">
              <span className="block tracking-widest text-[#8b5cf6]">SMART</span>
              <span className="block tracking-wider">DRYING</span>
              <span className="block text-[#8b5cf6] tracking-widest">SYSTEM</span>
            </div>
            <span className="font-mono text-[9px] text-slate-500 tracking-widest block uppercase mt-2">
              IoT Automatic Clothesline
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-row md:flex-col gap-2.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 font-mono">
            
            {/* 1. Dashboard */}
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-3.5 py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 w-full text-left whitespace-nowrap cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-[#8b5cf6] text-white font-bold shadow-lg shadow-[#8b5cf6]/35"
                  : "text-slate-400 hover:text-white hover:bg-[#120e22]/50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
              <span>Dashboard</span>
            </button>

            {/* 2. Monitoring */}
            <button
              onClick={() => setActiveTab("monitoring")}
              className={`flex items-center gap-3.5 py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 w-full text-left whitespace-nowrap cursor-pointer ${
                activeTab === "monitoring"
                  ? "bg-[#8b5cf6] text-white font-bold shadow-lg shadow-[#8b5cf6]/35"
                  : "text-slate-400 hover:text-white hover:bg-[#120e22]/50"
              }`}
            >
              <LineChart className="w-4 h-4 flex-shrink-0" />
              <span>Monitoring</span>
            </button>

            {/* 3. History Logs */}
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-3.5 py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 w-full text-left whitespace-nowrap cursor-pointer ${
                activeTab === "history"
                  ? "bg-[#8b5cf6] text-white font-bold shadow-lg shadow-[#8b5cf6]/35"
                  : "text-slate-400 hover:text-white hover:bg-[#120e22]/50"
              }`}
            >
              <History className="w-4 h-4 flex-shrink-0" />
              <span>History</span>
            </button>
          </nav>
        </div>

        {/* System Online Badge card at sidebar foot */}
        <div className="mt-8 pt-6 border-t border-[#1d1730]">
          <div className="bg-[#120e22]/70 border border-[#1d1730] rounded-xl p-4 flex flex-col gap-2">
            
            {/* Status indicator line with pulsing dot */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]" />
              </span>
              <span className="font-sans font-bold text-xs text-white uppercase tracking-wider">
                SYSTEM ONLINE
              </span>
            </div>

            <div className="space-y-1 text-[10px] font-mono text-[#6b7f96]">
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>ESP32 Connected</span>
              </div>
              <div className="flex items-center gap-1.5 pl-0.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>WiFi Connected</span>
              </div>
            </div>
          </div>
        </div>

      </aside>

      {/* ======= CORE WORKSPACE MAIN CONTENT ======= */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        
        {/* Top Navbar Header */}
        <header className="h-16 border-b border-[#1d1730] px-6 md:px-8 flex items-center justify-between bg-[#0c0a18]/60 backdrop-blur-md sticky top-0 z-30">
          <div>
            <h2 className="text-[#a0aec0] font-sans font-medium text-xs tracking-wide">
              Realtime IoT Monitoring Dashboard
            </h2>
          </div>

          {/* Right indicator widgets row matching screenshot exactly */}
          <div className="flex items-center gap-4">
            
            {/* Indicator 1: Condition Status */}
            <div className="bg-[#120e22] border border-[#1d1730] px-3.5 py-1.5 rounded-lg flex flex-col items-end leading-none">
              <span className="text-[#ffb300] font-cond font-black text-[10px] uppercase tracking-wider block">
                {appState.sensor.kondisi}
              </span>
              <span className="text-[10px] font-mono text-[#6b7f96] block mt-0.5">
                {appState.sensor.temp.toFixed(1)}°C
              </span>
            </div>

            {/* Indicator 2: Engine Status */}
            <div className="bg-[#120e22] border border-[#1d1730] px-3.5 py-1.5 rounded-lg flex flex-col items-end leading-none">
              <span className="text-[#00ff88] font-cond font-black text-[10px] uppercase tracking-wider block flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" />
                ACTIVE
              </span>
              <span className="text-[9px] font-mono text-[#6b7f96] block mt-0.5">
                Auto System Running
              </span>
            </div>

            {/* Manual manual refresh */}
            <button
              onClick={() => pullStateFromServer(true)}
              disabled={isRefreshing}
              className="p-2.5 bg-[#120e22] hover:bg-[#252e3a] border border-[#252e3a] rounded-lg transition text-slate-300 hover:text-white cursor-pointer"
              title="Sync sensor values"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </header>

        {/* Dynamic Multi-Tab Content Router */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              
              {/* === VIEW 1: DASHBOARD (MAIN TELEMETRY & ANIMATIONS) === */}
              {activeTab === "dashboard" && (
                <>
                  {/* Realtime Sensors */}
                  <section className="space-y-3">
                    <SensorGrid sensor={appState.sensor} />
                  </section>

                  {/* Controller Board actutations */}
                  <section className="space-y-3 pt-2">
                    <ControlPanels appState={appState} onControlAction={handleControlAction} />
                  </section>

                  {/* Realtime Monitoring graph teaser at bottom */}
                  <section className="space-y-3 pt-4 border-t border-[#1d1730]">
                    <div className="flex items-center justify-between pb-1">
                      <span className="font-mono text-xs text-[#8b5cf6] uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#8b5cf6]" />
                        REALTIME MONITORING
                      </span>
                      <button
                        onClick={() => setActiveTab("monitoring")}
                        className="font-mono text-[9px] text-[#8b5cf6]/80 hover:text-white uppercase transition-all"
                      >
                        Lihat Grafik Lengkap ➔
                      </button>
                    </div>
                    
                    {/* Small preview of temperature correlation graph */}
                    <div className="p-1 bg-[#120e22]/50 border border-[#1d1730] rounded-xl overflow-hidden shadow-inner">
                      <HistoryCharts riwayat={appState.riwayat.slice(-12)} />
                    </div>
                  </section>
                </>
              )}

              {/* === VIEW 2: MONITORING CHARTS === */}
              {activeTab === "monitoring" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-cond font-bold text-xl text-white tracking-widest uppercase">
                      Grafik Analisis Telemetri Realtime
                    </h3>
                    <p className="font-mono text-[10px] text-slate-500 tracking-wider mt-0.5">
                      Suhu Lingkungan, Kelembapan Hujan, dan Intensitas Cahaya LDR
                    </p>
                  </div>
                  <div className="p-2 bg-[#120e22]/50 border border-[#1d1730] rounded-xl shadow-lg">
                    <HistoryCharts riwayat={appState.riwayat} />
                  </div>
                </div>
              )}

              {/* === VIEW 3: SYSTEM HISTORIC EVENT LOGS === */}
              {activeTab === "history" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-cond font-bold text-xl text-white tracking-widest uppercase">
                      Log Sejarah Bus Kontrol
                    </h3>
                    <p className="font-mono text-[10px] text-slate-500 tracking-wider mt-0.5">
                      Catatan Event Sistem Berbasis Mikro detik
                    </p>
                  </div>
                  <ActivityLog logs={logs} onClearLogs={() => setLogs([])} />
                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </main>

        {/* Small copyright tag footer */}
        <footer className="h-10 border-t border-[#1d1730] px-8 flex items-center justify-center text-[9px] font-mono text-slate-600 tracking-wider bg-[#06040b]/40">
          SMART DRYING SYSTEM &nbsp;|&nbsp; ESP32 AUTOMATIC CLOTHESLINE HUB &copy; {new Date().getFullYear()}
        </footer>

      </div>

    </div>
  );
}
