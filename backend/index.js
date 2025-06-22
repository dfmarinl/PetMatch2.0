require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const PORT = process.env.PORT || 3001;
const userRoutes = require("./services/usuario/src/api/routes/userRoutes");
const authRoutes = require("./services/usuario/src/api/routes/authRoutes");
const petRoutes = require("./services/mascota/src/api/routes/petRoutes");
const adoptionRoutes = require("./services/adopcion/src/api/routes/adoptionRoutes");
const followUpRoutes = require("./services/adopcion/src/api/routes/followUpRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API funcionando correctamente en localhost 3001");
});

// Rutas
//app.use("/api/pets", require("./routes/pets")); // ejemplo
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/adoption", adoptionRoutes);
app.use("/api/follow", followUpRoutes);

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
});
