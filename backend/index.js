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

const PORT = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);

// Socket.IO con CORS
const io = new Server(server, {
  cors: {
    origin: "https://pet-match2-0.vercel.app", // URL del frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Guardar instancia de io para los controladores
app.set("io", io);

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta básica
app.get("/", (req, res) => {
  res.send("API funcionando correctamente en localhost 3001");
});

// Rutas de API
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/adoption", adoptionRoutes);
app.use("/api/follow", followUpRoutes);
app.use("/api/notificaciones", notificationRoutes);

// === SOCKET.IO ===
io.on("connection", (socket) => {
  console.log("🟢 Socket conectado:", socket.id);

  // 🧩 Unión opcional a sala privada si es cliente
  socket.on("join", (userId) => {
    if (userId) {
      socket.join(userId.toString());
      console.log(`👤 Cliente con ID ${userId} unido a su sala privada`);
    }
  });

  // 🧩 Unión opcional a canal de broadcast para admins/empleados
  socket.on("admin_join", () => {
    socket.join("admins");
    console.log(`👮 Admin/Empleado unido al canal de difusión general`);
  });

  // 🔴 Desconexión
  socket.on("disconnect", () => {
    console.log("🔴 Socket desconectado:", socket.id);
  });
});

// === INICIAR SERVIDOR ===
sequelize.sync({ alter: true }).then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
  });
});