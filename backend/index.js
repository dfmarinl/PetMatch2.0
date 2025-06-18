require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const PORT = process.env.PORT || 3001;
const userRoutes = require("./services/usuario/src/api/routes/userRoutes");
const authRoutes = require("./services/usuario/src/api/routes/authRoutes");

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

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
});
