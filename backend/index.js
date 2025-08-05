// index.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { sequelize } = require("./models");

// Rutas
const userRoutes = require("./services/usuario/src/api/routes/userRoutes");
const authRoutes = require("./services/usuario/src/api/routes/authRoutes");
const petRoutes = require("./services/mascota/src/api/routes/petRoutes");
const adoptionRoutes = require("./services/adopcion/src/api/routes/adoptionRoutes");
const followUpRoutes = require("./services/adopcion/src/api/routes/followUpRoutes");
const notificationRoutes = require("./services/notificacion/src/api/routes/notificationRoutes");

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

// Configuración CORS más permisiva para debugging
app.use(cors({
  origin: function (origin, callback) {
    console.log("🔍 CORS Origin check:", origin);
    
    // Permitir solicitudes sin origen (como curl, Postman, o requests del servidor)
    if (!origin) {
      console.log("✅ Permitiendo request sin origen");
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      console.log("✅ Origen permitido:", origin);
      return callback(null, true);
    } else {
      console.log("❌ Origen no permitido:", origin);
      return callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200, // Para navegadores legacy
}));

// Middleware adicional para logs
app.use((req, res, next) => {
  console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'No Origin'}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === SOCKET.IO ===
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  allowEIO3: true, // Compatibilidad con versiones anteriores
});

// Compartir io en la app
app.set("io", io);

// Ruta raíz
app.get("/", (req, res) => {
  res.json({
    message: "✅ API funcionando correctamente",
    port: PORT,
    timestamp: new Date().toISOString(),
    cors_origins: allowedOrigins
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: "connected" // Puedes verificar la conexión a la DB aquí
  });
});

// Usar rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/adoption", adoptionRoutes);
app.use("/api/follow", followUpRoutes);
app.use("/api/notificaciones", notificationRoutes);

// Middleware para manejar rutas no encontradas
app.use("*", (req, res) => {
  console.log("❌ Ruta no encontrada:", req.method, req.originalUrl);
  res.status(404).json({
    error: "Endpoint no encontrado",
    method: req.method,
    path: req.originalUrl,
    availableRoutes: [
      "GET /",
      "GET /health",
      "/api/auth/*",
      "/api/users/*",
      "/api/pets/*",
      "/api/adoption/*",
      "/api/follow/*",
      "/api/notificaciones/*"
    ]
  });
});

// Middleware global de manejo de errores
app.use((error, req, res, next) => {
  console.error("💥 Error global:", error.message);
  res.status(500).json({
    error: "Error interno del servidor",
    message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

// Eventos de socket
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

  socket.on("error", (error) => {
    console.error("💥 Socket error:", error);
  });
});

// Manejo de errores del servidor
server.on("error", (error) => {
  console.error("💥 Server error:", error);
});

// Inicializar servidor
sequelize.sync({ alter: true })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`🌍 CORS habilitado para:`, allowedOrigins);
      console.log(`📡 Socket.IO habilitado`);
    });
  })
  .catch((error) => {
    console.error("💥 Error al conectar con la base de datos:", error);
    process.exit(1);
  });