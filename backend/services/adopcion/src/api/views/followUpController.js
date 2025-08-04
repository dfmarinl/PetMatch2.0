const {
  AdoptionFollowUp,
  CompletedAdoption,
  AdoptionRequest,
  Pet,
} = require("../../../../../models");

//Crear un reporte de seguimiento
const createFollowUp = async (req, res) => {
  try {
    const {
      completedAdoptionId,
      visitDate,
      petIsHealthy,
      hasProperNutrition,
      showsAffectionBond,
      otherPetsAreFriendly,
      comments,
      image,
      isSuccessful, // ✅ nuevo campo
    } = req.body;

    if (!completedAdoptionId) {
      return res
        .status(400)
        .json({ message: "Falta el ID de adopción completada." });
    }

    if (
      petIsHealthy === undefined ||
      hasProperNutrition === undefined ||
      showsAffectionBond === undefined
    ) {
      return res.status(400).json({
        message:
          "Faltan respuestas obligatorias del estado de la mascota y su entorno.",
      });
    }

    const adoption = await CompletedAdoption.findByPk(completedAdoptionId);
    if (!adoption) {
      return res
        .status(404)
        .json({ message: "Adopción completada no encontrada." });
    }

    const newFollowUp = await AdoptionFollowUp.create({
      completedAdoptionId,
      visitDate,
      petIsHealthy,
      hasProperNutrition,
      showsAffectionBond,
      otherPetsAreFriendly,
      comments,
      image,
      isSuccessful, // ✅ incluir
    });

    res.status(201).json({
      message: "Reporte creado correctamente.",
      followUp: newFollowUp,
    });
  } catch (error) {
    console.error("Error al crear el reporte:", error);
    res
      .status(500)
      .json({ message: "Error al crear el reporte: " + error.message });
  }
};

//Actualizar un reporte de seguimiento
const updateFollowUp = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      visitDate,
      petIsHealthy,
      hasProperNutrition,
      showsAffectionBond,
      otherPetsAreFriendly,
      comments,
      image,
      isSuccessful, // ✅ nuevo campo
    } = req.body;

    const followUp = await AdoptionFollowUp.findByPk(id);
    if (!followUp) {
      return res.status(404).json({ message: "Reporte no encontrado." });
    }

    await followUp.update({
      visitDate,
      petIsHealthy,
      hasProperNutrition,
      showsAffectionBond,
      otherPetsAreFriendly,
      comments,
      image,
      isSuccessful, // ✅ incluir
    });

    res.status(200).json({
      message: "Reporte actualizado correctamente.",
      followUp,
    });
  } catch (error) {
    console.error("Error al actualizar el reporte:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar el reporte: " + error.message });
  }
};

//Eliminar un reporte de seguimiento
const deleteFollowUp = async (req, res) => {
  try {
    const { id } = req.params;

    const followUp = await AdoptionFollowUp.findByPk(id);
    if (!followUp) {
      return res.status(404).json({ message: "Reporte no encontrado." });
    }

    await followUp.destroy();

    res.status(200).json({ message: "Reporte eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar el reporte:", error);
    res
      .status(500)
      .json({ message: "Error al eliminar el reporte: " + error.message });
  }
};

//Obtener todos los reportes de seguimineto
const getFollowUpsByAdoption = async (req, res) => {
  try {
    const { completedAdoptionId } = req.params;

    const followUps = await AdoptionFollowUp.findAll({
      where: { completedAdoptionId },
      order: [["visitDate", "DESC"]],
    });

    res.status(200).json(followUps);
  } catch (error) {
    console.error("Error al obtener los reportes:", error);
    res
      .status(500)
      .json({ message: "Error al obtener los reportes: " + error.message });
  }
};

//Obtener reporte de seguimiento por Id de mascota
const getFollowUpsByPetId = async (req, res) => {
  try {
    const { petId } = req.params;

    const followUps = await AdoptionFollowUp.findAll({
      include: [
        {
          model: CompletedAdoption,
          include: [
            {
              model: AdoptionRequest,
              where: { petId },
              attributes: [], // no incluir datos del request en la respuesta
            },
          ],
          attributes: [], // no incluir datos de completedAdoption
        },
      ],
      order: [["visitDate", "DESC"]],
    });

    res.status(200).json(followUps);
  } catch (error) {
    console.error("Error al obtener seguimientos por mascota:", error);
    res.status(500).json({
      message: "Error al obtener seguimientos: " + error.message,
    });
  }
};

//Establecer un valor para isSuccesful para un seguimiento
const setFollowUpSuccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { isSuccessful } = req.body;

    if (typeof isSuccessful !== "boolean") {
      return res.status(400).json({
        message: "El valor de isSuccessful debe ser booleano (true o false).",
      });
    }

    const followUp = await AdoptionFollowUp.findByPk(id);
    if (!followUp) {
      return res.status(404).json({ message: "Seguimiento no encontrado." });
    }

    followUp.isSuccessful = isSuccessful;
    await followUp.save();

    res.status(200).json({
      message: "Estado de éxito actualizado correctamente.",
      followUp,
    });
  } catch (error) {
    console.error("Error al actualizar isSuccessful:", error);
    res.status(500).json({
      message: "Error al actualizar estado: " + error.message,
    });
  }
};

module.exports = {
  createFollowUp,
  updateFollowUp,
  deleteFollowUp,
  getFollowUpsByAdoption,
  getFollowUpsByPetId,
  setFollowUpSuccess,
};
