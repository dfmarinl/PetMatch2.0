const { Pet } = require("../../../../../models");

// Crear una nueva mascota
const createPet = async (req, res) => {
  try {
    const { name, species, breed, age, gender, description, available, image } =
      req.body;

    if (!name || !species || !age || !gender) {
      return res.status(400).json({ message: "Faltan campos obligatorios." });
    }

    const newPet = await Pet.create({
      name,
      species,
      breed,
      age,
      gender,
      description,
      available,
      image,
    });

    res.status(201).json(newPet);
  } catch (error) {
    console.error("Error al crear la mascota:", error);
    res
      .status(400)
      .json({ message: "Error al crear la mascota: " + error.message });
  }
};

// Obtener todas las mascotas
const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.findAll();
    res.status(200).json(pets);
  } catch (error) {
    console.error("Error al obtener las mascotas:", error);
    res
      .status(400)
      .json({ message: "Error al obtener las mascotas: " + error.message });
  }
};

// Obtener mascotas paginadas
const getPetsPages = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: pets } = await Pet.findAndCountAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [["id", "DESC"]],
    });

    res.status(200).json({
      pets,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error al paginar mascotas:", error);
    res
      .status(400)
      .json({ message: "Error al paginar mascotas: " + error.message });
  }
};

// Obtener una mascota por ID
const getPetById = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findByPk(id);

    if (!pet) {
      return res.status(404).json({ message: "Mascota no encontrada" });
    }

    res.status(200).json(pet);
  } catch (error) {
    console.error("Error al obtener la mascota:", error);
    res
      .status(400)
      .json({ message: "Error al obtener la mascota: " + error.message });
  }
};

// Actualizar una mascota
const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const pet = await Pet.findByPk(id);
    if (!pet) {
      return res.status(404).json({ message: "Mascota no encontrada" });
    }

    await pet.update(data);
    res.status(200).json(pet);
  } catch (error) {
    console.error("Error al actualizar la mascota:", error);
    res
      .status(400)
      .json({ message: "Error al actualizar la mascota: " + error.message });
  }
};

// Eliminar una mascota
const deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findByPk(id);
    if (!pet) {
      return res.status(404).json({ message: "Mascota no encontrada" });
    }

    await pet.destroy();
    res.status(200).json({ message: "Mascota eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la mascota:", error);
    res
      .status(400)
      .json({ message: "Error al eliminar la mascota: " + error.message });
  }
};

module.exports = {
  createPet,
  getAllPets,
  getPetsPages,
  getPetById,
  updatePet,
  deletePet,
};
