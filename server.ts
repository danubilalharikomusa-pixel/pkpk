import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Global state holding system information
let state = {
  sensor: {
    temp: 29.5,
    rain1: 4095, // Dry (0 is wet/full rain, 4095 is totally dry)
    rain2: 4095, // Dry
    ldr: 3200,   // Bright (high value means bright outdoors in this ESP32 ldr setup, or reverse depending on circuit, let's keep it 0-4095)
    kondisi: "CERAH",
    lastUpdate: new Date().toISOString()
  },

  modeJemuran: "AUTO", // "AUTO" or "MANUAL"
  modeFan: "AUTO",     // "AUTO" or "MANUAL"

  targetJemuran: "keluar", // "masuk" or "keluar"
  targetFan: "OFF",        // "ON" or "OFF"

  statusJemuran: "keluar"  // "masuk", "keluar", "move-in", "move-out"
};

const MAX_RIWAYAT = 50;
let riwayat: any[] = [];

// Pre-populate with some beautiful mock historic data so the graph doesn't start empty
function prepopulateHistory() {
  const now = new Date();
  for (let i = 15; i >= 0; i--) {
    const historicalTime = new Date(now.getTime() - i * 60000); // 1 minute intervals
    const wave = Math.sin(i * 0.5);
    const mockTemp = 28.0 + wave * 2.0 + Math.random() * 0.5;
    const mockLdr = Math.round(3000 - i * 120 + Math.random() * 100);
    const mockRain1 = Math.round(4000 - Math.random() * 100);
    const mockRain2 = Math.round(4095 - Math.random() * 50);
    
    riwayat.push({
      time: historicalTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      temp: parseFloat(mockTemp.toFixed(1)),
      rain1: Math.max(0, Math.min(4095, mockRain1)),
      rain2: Math.max(0, Math.min(4095, mockRain2)),
      ldr: Math.max(0, Math.min(4095, mockLdr)),
      kondisi: "CERAH"
    });
  }
}
prepopulateHistory();

// Fuzzy/automatic logic function acting on newly reported sensor inputs
function processStateLogic() {
  const { temp, rain1, rain2, ldr } = state.sensor;

  // Determine weather conditions from raw sensor thresholds
  // If rain sensors show moisture (< 1800), weather is GERIMIS or HUJAN
  let calculatedKondisi = "CERAH";
  if (rain1 < 1200 || rain2 < 1200) {
    calculatedKondisi = "HUJAN";
  } else if (rain1 < 2800 || rain2 < 2800) {
    calculatedKondisi = "GERIMIS";
  } else {
    calculatedKondisi = "CERAH";
  }
  state.sensor.kondisi = calculatedKondisi;

  // AUTO Control logic for JEMURAN
  if (state.modeJemuran === "AUTO") {
    // Rain detected (rain < 1800 on either sensor) or it is dark night (ldr < 1000)
    const isRaining = rain1 < 2500 || rain2 < 2500;
    const isDark = ldr < 1200;

    if (isRaining || isDark) {
      if (state.statusJemuran === "keluar") {
        state.statusJemuran = "move-in";
      }
      state.targetJemuran = "masuk";
    } else {
      if (state.statusJemuran === "masuk") {
        state.statusJemuran = "move-out";
      }
      state.targetJemuran = "keluar";
    }
  }

  // AUTO Control logic for FAN
  if (state.modeFan === "AUTO") {
    // Fan is turned ON if rain is detected (to aid internal drying in damp conditions) or when the ambient temp is high (> 31°C)
    const isRaining = rain1 < 2500 || rain2 < 2500;
    const isDampOrHot = isRaining || temp > 31.0;

    if (isDampOrHot) {
      state.targetFan = "ON";
    } else {
      state.targetFan = "OFF";
    }
  }
  
  // Transition simulation
  // Ensure that statusJemuran eventually catches up to targetJemuran in our simulated environment
  if (state.statusJemuran === "move-in") {
    state.statusJemuran = "masuk";
  } else if (state.statusJemuran === "move-out") {
    state.statusJemuran = "keluar";
  }
}

// =====================================================
// GET /api/hardware
// Endpoint for ESP32 Node MCU communication and polling
// =====================================================
app.get("/api/hardware", (req, res) => {
  const { temp, rain1, rain2, ldr, kondisi, jemuran } = req.query;

  // Update sensor records with query parameter data if supplied
  if (temp !== undefined) {
    state.sensor.temp = parseFloat(temp as string) || 0;
    state.sensor.rain1 = parseInt(rain1 as string) || 0;
    state.sensor.rain2 = parseInt(rain2 as string) || 0;
    state.sensor.ldr = parseInt(ldr as string) || 0;
    
    // Process internal fuzzy control states based on input
    processStateLogic();
    if (kondisi) {
      state.sensor.kondisi = kondisi as string;
    }
    state.sensor.lastUpdate = new Date().toISOString();

    // Store sample into history array
    riwayat.push({
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      temp: state.sensor.temp,
      rain1: state.sensor.rain1,
      rain2: state.sensor.rain2,
      ldr: state.sensor.ldr,
      kondisi: state.sensor.kondisi
    });
    
    if (riwayat.length > MAX_RIWAYAT) {
      riwayat.shift();
    }
  }

  // Update real mechanical status if reported by device
  if (jemuran) {
    state.statusJemuran = jemuran as string;
  }

  // Reply formatting in plain-text comma-separated list
  // "modeJemuran,targetJemuran,modeFan,targetFan"
  const reply = `${state.modeJemuran},${state.targetJemuran},${state.modeFan},${state.targetFan}`;
  res.send(reply);
});

// =====================================================
// GET /api/state
// State readout endpoint for client dashboard polling
// =====================================================
app.get("/api/state", (req, res) => {
  res.json({
    sensor: state.sensor,
    modeJemuran: state.modeJemuran,
    modeFan: state.modeFan,
    targetJemuran: state.targetJemuran,
    targetFan: state.targetFan,
    statusJemuran: state.statusJemuran,
    riwayat: riwayat.slice(-25) // Send the last 25 samples for beautiful graph rendering
  });
});

// =====================================================
// POST /api/control
// Handles web action events and switches modes/targets
// =====================================================
app.post("/api/control", (req, res) => {
  const { type, value } = req.body;

  switch (type) {
    case "modeJemuran":
      if (value === "AUTO" || value === "MANUAL") {
        state.modeJemuran = value;
        if (value === "AUTO") {
          processStateLogic();
        }
      }
      break;

    case "targetJemuran":
      if (value === "masuk" || value === "keluar") {
        state.targetJemuran = value;
        state.statusJemuran = value === "masuk" ? "move-in" : "move-out";
        // Auto resolve simulated mechanical moves in 1 second
        setTimeout(() => {
          if (state.statusJemuran === "move-in") state.statusJemuran = "masuk";
          if (state.statusJemuran === "move-out") state.statusJemuran = "keluar";
        }, 1500);
      }
      break;

    case "modeFan":
      if (value === "AUTO" || value === "MANUAL") {
        state.modeFan = value;
        if (value === "AUTO") {
          processStateLogic();
        }
      }
      break;

    case "targetFan":
      if (value === "ON" || value === "OFF") {
        state.targetFan = value;
      }
      break;

    default:
      return res.status(400).json({ error: "Unknown type" });
  }

  res.json({
    ok: true,
    state: {
      modeJemuran: state.modeJemuran,
      modeFan: state.modeFan,
      targetJemuran: state.targetJemuran,
      targetFan: state.targetFan,
      statusJemuran: state.statusJemuran
    }
  });
});

// Support resetting state to defaults for testing
app.post("/api/reset", (req, res) => {
  state = {
    sensor: {
      temp: 29.5,
      rain1: 4095,
      rain2: 4095,
      ldr: 3200,
      kondisi: "CERAH",
      lastUpdate: new Date().toISOString()
    },
    modeJemuran: "AUTO",
    modeFan: "AUTO",
    targetJemuran: "keluar",
    targetFan: "OFF",
    statusJemuran: "keluar"
  };
  riwayat = [];
  prepopulateHistory();
  res.json({ ok: true, state });
});

// Start listening system & handle development environment setups
async function startServer() {
  if (process.env.VERCEL) {
    // Di Vercel, serverless function hanya mengekspos API.
    // File statis dan routing frontend akan disajikan secara native oleh Vercel CDN.
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Ready on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
