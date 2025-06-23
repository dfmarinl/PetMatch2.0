const {
  User,
  AdoptionRequest,
  CompletedAdoption,
  Pet,
} = require("../../../../../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Registro de usuario
const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      identificationNumber,
      age,
      email,
      city,
      direction,
      password,
      rol,
    } = req.body;

    // Verificar si ya existe un usuario con el mismo email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "El email ya está registrado" });

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = await User.create({
      firstName,
      lastName,
      identificationNumber,
      age,
      email,
      city,
      direction,
      password: hashedPassword,
      rol: rol || "cliente",
    });

    // Generar token JWT
    const token = jwt.sign(
      { userId: newUser.id, rol: newUser.rol },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Responder con los datos del usuario y el token
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        id: newUser.id,
        email: newUser.email,
        rol: newUser.rol,
        nombre: `${newUser.firstName} ${newUser.lastName}`,
      },
      token,
    });
  } catch (error) {
    console.error("Error al registrar:", error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await User.findOne({ where: { email } });

    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { userId: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: { id: usuario.id, firstName: usuario.firstName, rol: usuario.rol },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

// Obtener datos del usuario autenticado
const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const usuario = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Obtener solicitudes del usuario
    const adoptionRequests = await AdoptionRequest.findAll({
      where: { userId },
      include: [
        {
          model: Pet,
          attributes: ["id", "name", "species", "breed", "image"],
        },
      ],
      order: [["id", "DESC"]],
    });

    // Paso 1: Buscar las solicitudes aprobadas del usuario (solo IDs)
    const approvedRequests = await AdoptionRequest.findAll({
      where: {
        userId: userId,
        adoptionStatus: "approved",
      },
      attributes: ["id", "petId"], // Solo necesitamos estos campos
    });

    // Paso 2: Extraer los IDs de las mascotas de las solicitudes aprobadas
    const adoptedPetIds = approvedRequests.map((request) => request.petId);

    // Paso 3: Obtener la información de las mascotas adoptadas
    let adoptedPets = [];

    if (adoptedPetIds.length > 0) {
      adoptedPets = await Pet.findAll({
        where: {
          id: adoptedPetIds,
        },
        attributes: [
          "id",
          "name",
          "species",
          "breed",
          "image",
          "age",
          "gender",
        ],
      });
    }

    res.status(200).json({
      ...usuario.toJSON(),
      AdoptionRequests: adoptionRequests,
      AdoptedPets: adoptedPets, // Solo las mascotas adoptadas
    });
  } catch (error) {
    console.error("Error en getMe:", error);
    res.status(500).json({
      message: "Error al obtener datos del usuario",
      error: error.message,
    });
  }
};

// Verificar contraseña actual
const verifyCurrentPassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const { currentPassword } = req.body;

    const usuario = await User.findByPk(userId);
    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(currentPassword, usuario.password);
    if (!isMatch)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    res.status(200).json({ message: "Contraseña verificada correctamente" });
  } catch (error) {
    console.error("Error al verificar contraseña:", error);
    res.status(500).json({ message: "Error interno" });
  }
};

module.exports = {
  register,
  login,
  getMe,
  verifyCurrentPassword,
};
