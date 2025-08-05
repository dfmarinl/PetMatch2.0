const {
  AdoptionFollowUp,
  CompletedAdoption,
  AdoptionRequest,
  Pet,
  User,
  Notification,
} = require("../../../../../models");
const { sendEmail } = require("../../../../utils/emailSender");

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
      isSuccessful,
    } = req.body;

    if (!completedAdoptionId) {
      return res.status(400).json({ message: "Falta el ID de adopción completada." });
    }

    if (
      petIsHealthy === undefined ||
      hasProperNutrition === undefined ||
      showsAffectionBond === undefined
    ) {
      return res.status(400).json({
        message: "Faltan respuestas obligatorias del estado de la mascota y su entorno.",
      });
    }

    const adoption = await CompletedAdoption.findByPk(completedAdoptionId, {
      include: {
        model: AdoptionRequest,
        include: [User, Pet],
      },
    });

    if (!adoption) {
      return res.status(404).json({ message: "Adopción completada no encontrada." });
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
      isSuccessful,
    });

    // Acceso a datos relacionados
    const adoptante = adoption.AdoptionRequest?.User;
    const mascota = adoption.AdoptionRequest?.Pet;

    const petName = mascota?.name || "una mascota";
    const userName = adoptante
      ? `${adoptante.firstName} ${adoptante.lastName}`
      : "Un empleado";

    const notificationMessage = `Se ha registrado un nuevo seguimiento post-adopción para ${petName}.`;

    // Notificaciones en BD
    await Notification.bulkCreate([
      {
        userId: null,
        rol: "administrador",
        message: notificationMessage,
        type: "nuevoSeguimiento",
      },
      {
        userId: null,
        rol: "empleado",
        message: notificationMessage,
        type: "nuevoSeguimiento",
      },
    ]);

    // Correos
    const staff = await User.findAll({
      where: { rol: ["administrador", "empleado"] },
    });

    const emails = staff.map((u) => u.email);
    await Promise.all(
      emails.map((email) =>
        sendEmail("newFollowUpReport", email, {
          petName,
          userName,
          reportLink: "http://localhost:3000/admin/adopciones",
        })
      )
    );

    // Emitir socket
    const io = req.app.get("io");
    io.to("admins").emit("new_follow_up", {
      message: notificationMessage,
      type: "nuevoSeguimiento",
      petName,
      userName,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Reporte creado correctamente.",
      followUp: newFollowUp,
    });
  } catch (error) {
    console.error("Error al crear el reporte:", error);
    res.status(500).json({ message: "Error al crear el reporte: " + error.message });
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
          required: true, // 🔴 Esto asegura que solo traiga los relacionados
          include: [
            {
              model: AdoptionRequest,
              required: true, // 🔴 Forzar INNER JOIN para aplicar el where
              where: { petId },
              attributes: [],
            },
          ],
          attributes: [],
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

    const followUp = await AdoptionFollowUp.findByPk(id, {
      include: {
        model: CompletedAdoption,
        include: {
          model: AdoptionRequest,
          include: [User, Pet],
        },
      },
    });

    if (!followUp) {
      return res.status(404).json({ message: "Seguimiento no encontrado." });
    }

    followUp.isSuccessful = isSuccessful;
    await followUp.save();

    const adoption = followUp.CompletedAdoption;
    const request = adoption?.AdoptionRequest;
    const user = request?.User;
    const pet = request?.Pet;

    if (!user || !pet) {
      return res.status(500).json({
        message: "No se pudieron obtener datos del adoptante o mascota.",
      });
    }

    const petName = pet.name;
    const userName = `${user.firstName} ${user.lastName}`;
    const message = isSuccessful
      ? `El seguimiento de ${petName} fue marcado como exitoso. ¡Gracias por cuidar tan bien de tu mascota!`
      : `El seguimiento de ${petName} fue marcado como no exitoso. Te recomendamos revisar el informe.`;

    // Crear notificación
    const notification = await Notification.create({
      userId: user.id,
      rol: "cliente",
      message,
      type: "estadoSeguimiento",
    });

    // Enviar correo
    await sendEmail("followUpSuccess", user.email, {
      userName,
      petName,
      isSuccessful,
      followUpLink: `http://localhost:3000/seguimientos`,
    });

    // Emitir por socket al cliente
    const io = req.app.get("io");
    io.to(user.id.toString()).emit("nuevaNotificacion", {
      notification,
    });

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
