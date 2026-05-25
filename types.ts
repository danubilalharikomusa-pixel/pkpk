export interface SensorData {
  temp: number;
  rain1: number;
  rain2: number;
  ldr: number;
  kondisi: "CERAH" | "GERIMIS" | "HUJAN" | string;
  lastUpdate: string | null;
}

export interface HistoryData {
  time: string;
  temp: number;
  rain1: number;
  rain2: number;
  ldr: number;
  kondisi: string;
}

export interface AppState {
  sensor: SensorData;
  modeJemuran: "AUTO" | "MANUAL";
  modeFan: "AUTO" | "MANUAL";
  targetJemuran: "masuk" | "keluar";
  targetFan: "ON" | "OFF";
  statusJemuran: "masuk" | "keluar" | "move-in" | "move-out";
  riwayat: HistoryData[];
}
