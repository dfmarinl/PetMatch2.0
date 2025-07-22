const {
  User,
  AdoptionRequest,
  CompletedAdoption,
  Pet,
} = require("../../../../../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

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
    const userId = req.user.id;
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

//Actualizar contraseña
const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        message: "La nueva contraseña debe tener al menos 8 caracteres",
      });
    }

    const usuario = await User.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    usuario.password = hashedPassword;

    await usuario.save();

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar contraseña:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Actualizar información personal
const updateProfile = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const {
      firstName,
      lastName,
      identificationNumber,
      age,
      email,
      city,
      direction,
    } = req.body;

    // Validaciones básicas
    if (
      !firstName ||
      !lastName ||
      !identificationNumber ||
      !age ||
      !email ||
      !city ||
      !direction
    ) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const usuario = await User.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el nuevo email ya está en uso por otro usuario
    if (email !== usuario.email) {
      const emailExistente = await User.findOne({
        where: { email },
      });
      if (emailExistente) {
        return res.status(400).json({
          message: "El nuevo email ya está registrado por otro usuario",
        });
      }
    }

    // Actualizar campos permitidos
    usuario.firstName = firstName;
    usuario.lastName = lastName;
    usuario.identificationNumber = identificationNumber;
    usuario.age = age;
    usuario.email = email;
    usuario.city = city;
    usuario.direction = direction;

    await usuario.save();

    res.status(200).json({
      message: "Perfil actualizado correctamente",
      user: {
        id: usuario.id,
        firstName: usuario.firstName,
        lastName: usuario.lastName,
        email: usuario.email,
        city: usuario.city,
        direction: usuario.direction,
        identificationNumber: usuario.identificationNumber,
        age: usuario.age,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

//Enviar correo de recuperación
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Crear token de recuperación con vencimiento de 15 minutos
    const resetToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" }
    );

    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    // Transportador configurado (Gmail + tolerancia a certificados autofirmados)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // ⚠️ Solo para entorno de desarrollo
      },
    });

    // Enviar correo
   await transporter.sendMail({
  from: `"PetMatch" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Recuperación de contraseña - PetMatch",
  html: `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
      <img src="https://res.cloudinary.com/djcnay2fx/image/upload/v1753202572/logo_fpycut.jpg" alt="Logo" width="100" />
      <h1>¡Hola de nuevo, ${user.firstName}!</h1>
      <p>Recibimos una solicitud para restablecer tu contraseña. Si no fuiste tú, ignora este mensaje.</p>
      <a href="${resetLink}" style="display: inline-block; padding: 15px 30px; background-color: #ff5733; color: white; font-weight: bold; text-decoration: none; border-radius: 25px; margin-top: 20px;">
        Recuperar contraseña
      </a>
      <p style="margin-top: 30px;">Este enlace es válido durante 15 minutos.</p>
      <p><strong>¿No solicitaste esto?</strong></p>
      <p>Ignora este correo si no pediste restablecer tu contraseña.</p>
    </div>
  `,
});
    res
      .status(200)
      .json({ message: "Correo enviado para restablecer la contraseña" });
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    res.status(500).json({
      message: "Error al enviar el correo de recuperación",
      error: error.message,
    });
  }
};

//Verifica el token enviado y actualiza la contraseña
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword)
      return res
        .status(400)
        .json({ message: "Token y nueva contraseña requeridos" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findByPk(decoded.userId);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "La contraseña debe tener al menos 8 caracteres" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ message: "El enlace ha expirado. Solicita uno nuevo." });
    }
    res.status(500).json({ message: "Error al restablecer la contraseña" });
  }
};

module.exports = {
  register,
  login,
  getMe,
  verifyCurrentPassword,
  updatePassword,
  updateProfile,
  forgotPassword,
  resetPassword,
};
