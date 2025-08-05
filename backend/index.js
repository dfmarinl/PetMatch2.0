// index.js - Debug version to isolate problematic routes

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { sequelize } = require("./models");

// Configuración
const PORT = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);

// === CORS ===
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://pet-match2-0.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

// === SOCKET.IO ===
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.set("io", io);

// Ruta raíz
app.get("/", (req, res) => {
  res.json({
    message: "✅ API funcionando correctamente",
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Load routes one by one to identify the problematic one
console.log("🔍 Loading routes one by one...");

try {
  console.log("📝 Loading userRoutes...");
  const userRoutes = require("./services/usuario/src/api/routes/userRoutes");
  app.use("/api/users", userRoutes);
  console.log("✅ userRoutes loaded successfully");
} catch (error) {
  console.error("❌ Error loading userRoutes:", error.message);
}

try {
  console.log("📝 Loading authRoutes...");
  const authRoutes = require("./services/usuario/src/api/routes/authRoutes");
  app.use("/api/auth", authRoutes);
  console.log("✅ authRoutes loaded successfully");
} catch (error) {
  console.error("❌ Error loading authRoutes:", error.message);
}

try {
  console.log("📝 Loading petRoutes...");
  const petRoutes = require("./services/mascota/src/api/routes/petRoutes");
  app.use("/api/pets", petRoutes);
  console.log("✅ petRoutes loaded successfully");
} catch (error) {
  console.error("❌ Error loading petRoutes:", error.message);
}

try {
  console.log("📝 Loading adoptionRoutes...");
  const adoptionRoutes = require("./services/adopcion/src/api/routes/adoptionRoutes");
  app.use("/api/adoption", adoptionRoutes);
  console.log("✅ adoptionRoutes loaded successfully");
} catch (error) {
  console.error("❌ Error loading adoptionRoutes:", error.message);
}

try {
  console.log("📝 Loading followUpRoutes...");
  const followUpRoutes = require("./services/adopcion/src/api/routes/followUpRoutes");
  app.use("/api/follow", followUpRoutes);
  console.log("✅ followUpRoutes loaded successfully");
} catch (error) {
  console.error("❌ Error loading followUpRoutes:", error.message);
}

try {
  console.log("📝 Loading notificationRoutes...");
  const notificationRoutes = require("./services/notificacion/src/api/routes/notificationRoutes");
  app.use("/api/notificaciones", notificationRoutes);
  console.log("✅ notificationRoutes loaded successfully");
} catch (error) {
  console.error("❌ Error loading notificationRoutes:", error.message);
}

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint no encontrado",
    method: req.method,
    path: req.originalUrl
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("💥 Error:", error.message);
  res.status(500).json({
    error: "Error interno del servidor",
    message: error.message
  });
});

// Socket events
io.on("connection", (socket) => {
  console.log("🟢 Nuevo socket conectado:", socket.id);

  socket.on("join", (userId) => {
    if (userId) {
      socket.join(userId.toString());
      console.log(`📥 Usuario ${userId} unido a su sala privada`);
    }
  });

  socket.on("admin_join", () => {
    socket.join("admins");
    console.log("👮 Admin unido al canal general de admins");
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket desconectado:", socket.id);
  });
});

// Start server
sequelize.sync({ alter: true })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`🌍 CORS habilitado para:`, allowedOrigins);
    });
  })
  .catch((error) => {
    console.error("💥 Error al conectar con la base de datos:", error);
    process.exit(1);
  });