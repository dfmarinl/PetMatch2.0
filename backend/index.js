// index.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { sequelize } = require("./models");

// === RUTAS ===
const userRoutes = require("./services/usuario/src/api/routes/userRoutes");
const authRoutes = require("./services/usuario/src/api/routes/authRoutes");
const petRoutes = require("./services/mascota/src/api/routes/petRoutes");
const adoptionRoutes = require("./services/adopcion/src/api/routes/adoptionRoutes");
const followUpRoutes = require("./services/adopcion/src/api/routes/followUpRoutes");
const notificationRoutes = require("./services/notificacion/src/api/routes/notificationRoutes");

// === CONFIGURACIÓN ===
const PORT = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);

// === CORS ===
const allowedOrigins = [
  "http://localhost:5173",
  "https://pet-match2-0.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
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

// === RUTA DE PRUEBA ===
app.get("/", (req, res) => {
  res.send("✅ API funcionando correctamente en el puerto " + PORT);
});

// === USO DE RUTAS ===
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/adoption", adoptionRoutes);
app.use("/api/follow", followUpRoutes);
app.use("/api/notificaciones", notificationRoutes);

// === EVENTOS DE SOCKET.IO ===
io.on("connection", (socket) => {
  console.log("🟢 Socket conectado:", socket.id);

  socket.on("join", (userId) => {
    if (userId) {
      socket.join(userId.toString());
      console.log(`👤 Cliente con ID ${userId} unido a su sala privada`);
    }
  });

  socket.on("admin_join", () => {
    socket.join("admins");
    console.log("👮 Admin/Empleado unido al canal de difusión general");
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket desconectado:", socket.id);
  });
});

// === INICIO DEL SERVIDOR ===
sequelize.sync({ alter: true })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error al conectar con la base de datos:", error);
  });


