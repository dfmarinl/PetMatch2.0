const { User } = require("../../../../../models");

const bcrypt = require("bcrypt"); // asegúrate de que esté importado arriba

const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      identificationNumber,
      age,
      email,
      password,
      rol,
      city,
      direction,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !identificationNumber ||
      !age ||
      !email ||
      !password ||
      !city ||
      !direction
    ) {
      return res.status(400).json({ message: "Faltan campos obligatorios." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado." });
    }

    // Encriptar contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      identificationNumber,
      age,
      email,
      password: hashedPassword,
      rol,
      city,
      direction,
    });

    const { password: _, ...userWithoutPassword } = newUser.toJSON();

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res
      .status(400)
      .json({ message: "Error al crear el usuario: " + error.message });
  }
};

// Obtener usuarios paginados
const getUsersPages = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: users } = await User.findAndCountAll({
      attributes: { exclude: ["password"] },
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [["id", "DESC"]],
    });

    res.status(200).json({
      users,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res
      .status(400)
      .json({ message: "Error al obtener los usuarios: " + error.message });
  }
};

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res
      .status(400)
      .json({ message: "Error al obtener los usuarios: " + error.message });
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res
      .status(400)
      .json({ message: "Error al obtener el usuario: " + error.message });
  }
};

// Actualizar usuario
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await user.update(data);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res
      .status(400)
      .json({ message: "Error al actualizar el usuario: " + error.message });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await user.destroy();
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res
      .status(400)
      .json({ message: "Error al eliminar el usuario: " + error.message });
  }
};

module.exports = {
  createUser,
  getUsersPages,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
