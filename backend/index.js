require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const userRoutes = require("./services/usuario/src/api/routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
//app.use("/api/pets", require("./routes/pets")); // ejemplo
app.use("/api/users", userRoutes);
const PORT = process.env.PORT || 3001;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
});
