const {
  AdoptionRequest,
  Pet,
  CompletedAdoption,
  User,
  Notification,
} = require("../../../../../models");

const { sendEmail } = require("../../../../utils/emailSender");

// Crear solicitud de adopción
// Crear solicitud de adopción
const createAdoptionRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      petId,
      reasonForAdoption,
      hadPetsBefore,
      dailyTimeForPet,
      livesAlone,
      hasChildrenAtHome,
      residenceType,
      otherPetsAtHome,
    } = req.body;

    if (
      !petId ||
      !reasonForAdoption ||
      dailyTimeForPet == null ||
      livesAlone == null
    ) {
      return res.status(400).json({ message: "Faltan campos requeridos." });
    }

    const pet = await Pet.findByPk(petId);
    if (!pet || !pet.available) {
      return res
        .status(400)
        .json({ message: "Mascota no disponible para adopción." });
    }

    const newRequest = await AdoptionRequest.create({
      userId,
      petId,
      reasonForAdoption,
      hadPetsBefore,
      dailyTimeForPet,
      livesAlone,
      hasChildrenAtHome,
      residenceType,
      otherPetsAtHome,
      adoptionStatus: "pending",
    });

    const user = await User.findByPk(userId);

    // Notificación general para admins/empleados
    const notificationMessage = `${user.firstName} ${user.lastName} ha enviado una nueva solicitud de adopción para ${pet.name}`;

    // Crear notificación en la base de datos para admins
    await Notification.create({
      userId: null, // No es para un usuario específico
      role: "admin", // Se envía a los administradores y empleados
      message: notificationMessage,
      type: "nuevaSolicitud",
    });

    // Enviar correos a administradores y empleados
    const adminsAndEmployees = await User.findAll({
      where: {
        rol: ["empleado", "administrador"],
      },
    });

    const emails = adminsAndEmployees.map((u) => u.email);
    await Promise.all(
      emails.map((email) =>
        sendEmail("newAdoptionRequest", email, {
          userName: `${user.firstName} ${user.lastName}`,
          petName: pet.name,
          requestLink: "http://localhost:3000/admin/solicitudes",
        })
      )
    );

    // Emitir evento a canal general de admins/empleados
    const io = req.app.get("io");
    io.to("admins").emit("new_adoption_request", {
      message: notificationMessage,
      type: "nuevaSolicitud",
      petId: pet.id,
      userId: user.id,
      requestId: newRequest.id,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Solicitud enviada correctamente",
      request: newRequest,
    });
  } catch (error) {
    console.error("Error al crear solicitud:", error);
    res
      .status(500)
      .json({ message: "Error al crear solicitud: " + error.message });
  }
};








// Aprobar o rechazar una solicitud
const updateAdoptionRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, observations } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Estado inválido." });
    }

    const request = await AdoptionRequest.findByPk(id, {
      include: [{ model: User }, { model: Pet }],
    });

    if (!request) {
      return res.status(404).json({ message: "Solicitud no encontrada." });
    }

    request.adoptionStatus = status;
    request.observations = observations || null;
    await request.save();

    if (status === "approved") {
      const daysToAdd = Math.floor(Math.random() * (15 - 3 + 1)) + 3;
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);

      await CompletedAdoption.create({
        approvalDate: new Date(),
        deliveryDate,
        notes: "Adopción registrada automáticamente.",
        adoptionRequestId: request.id,
      });

      const pet = await Pet.findByPk(request.petId);
      if (pet) await pet.update({ available: false });

      // Enviar correo de aprobación
      await sendEmail("adoptionApproved", request.User.email, {
        userName: request.User.firstName,
        petName: request.Pet.name,
        deliveryDate,
      });

    } else if (status === "rejected") {
      // Enviar correo de rechazo
      await sendEmail("adoptionRejected", request.User.email, {
        userName: request.User.firstName,
        petName: request.Pet.name,
        observations,
      });
    }

    res
      .status(200)
      .json({ message: "Estado de la solicitud actualizado correctamente." });
  } catch (error) {
    console.error("Error al actualizar solicitud:", error);
    res.status(500).json({ message: "Error al actualizar solicitud: " + error.message });
  }
};

// Obtener todas las solicitudes
const getAllRequests = async (req, res) => {
  try {
    const requests = await AdoptionRequest.findAll({
      include: [
        { model: Pet, attributes: ["name"] },
        { model: CompletedAdoption, attributes: ["approvalDate", "deliveryDate"] },
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error al obtener todas las solicitudes:", error);
    res.status(500).json({ message: "Error al obtener solicitudes: " + error.message });
  }
};

// Obtener solicitudes por usuario
const getRequestsByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await AdoptionRequest.findAll({
      where: { userId },
      include: [
        {
          model: Pet,
          attributes: ["name", "species", "breed", "image"],
        },
        {
          model: CompletedAdoption,
          attributes: ["approvalDate", "deliveryDate"],
        },
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error al obtener solicitudes del usuario:", error);
    res.status(500).json({ message: "Error al obtener solicitudes del usuario: " + error.message });
  }
};

// Obtener todas las adopciones de un usuario
const getCompletedAdoptionsByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const adoptions = await CompletedAdoption.findAll({
      include: [
        {
          model: AdoptionRequest,
          where: { userId },
          include: [
            { model: Pet, attributes: ["name", "species", "breed", "image"] },
          ],
        },
      ],
      order: [["deliveryDate", "DESC"]],
    });

    res.status(200).json(adoptions);
  } catch (error) {
    console.error("Error al obtener adopciones completadas:", error);
    res.status(500).json({ message: "Error al obtener adopciones completadas: " + error.message });
  }
};

// Eliminar una solicitud de adopción
const deleteAdoptionRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const request = await AdoptionRequest.findOne({
      where: {
        id,
        userId,
        adoptionStatus: "pending",
      },
    });

    if (!request) {
      return res
        .status(404)
        .json({ message: "Solicitud no encontrada o no puede eliminarse." });
    }

    await request.destroy();
    res.status(200).json({ message: "Solicitud eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar solicitud:", error);
    res.status(500).json({ message: "Error al eliminar solicitud: " + error.message });
  }
};

// Obtener solicitudes paginadas
const getRequestsPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: requests } = await AdoptionRequest.findAndCountAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [["id", "DESC"]],
      include: [
        { model: Pet, attributes: ["name", "species", "image"] },
        { model: CompletedAdoption, attributes: ["deliveryDate"] },
      ],
    });

    res.status(200).json({
      requests,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error al paginar solicitudes:", error);
    res.status(500).json({ message: "Error al paginar solicitudes: " + error.message });
  }
};

// Obtener todas las adopciones completadas
const getAllCompletedAdoptions = async (req, res) => {
  try {
    const completedAdoptions = await CompletedAdoption.findAll({
      include: [
        {
          model: AdoptionRequest,
          include: [
            {
              model: User,
              attributes: [
                "id",
                "firstName",
                "lastName",
                "identificationNumber",
                "email",
              ],
            },
            {
              model: Pet,
              attributes: ["id", "name", "species", "breed", "image"],
            },
          ],
        },
      ],
      order: [["deliveryDate", "DESC"]],
    });

    res.status(200).json(completedAdoptions);
  } catch (error) {
    console.error("Error al obtener adopciones completadas:", error);
    res.status(500).json({ message: "Error al obtener adopciones completadas: " + error.message });
  }
};

// Obtener adopciones completadas paginadas
const getCompletedAdoptionsPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: completedAdoptions } =
      await CompletedAdoption.findAndCountAll({
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [["deliveryDate", "DESC"]],
        include: [
          {
            model: AdoptionRequest,
            include: [
              {
                model: User,
                attributes: [
                  "id",
                  "firstName",
                  "lastName",
                  "identificationNumber",
                  "email",
                ],
              },
              {
                model: Pet,
                attributes: ["id", "name", "species", "breed", "image"],
              },
            ],
          },
        ],
      });

    res.status(200).json({
      completedAdoptions,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error al obtener adopciones paginadas:", error);
    res.status(500).json({
      message:
        "Error al obtener adopciones completadas paginadas: " + error.message,
    });
  }
};

// Obtener adopciones completadas por ID de usuario
const getCompletedAdoptionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const completedAdoptions = await CompletedAdoption.findAll({
      include: [
        {
          model: AdoptionRequest,
          where: { userId },
          include: [
            {
              model: User,
              attributes: [
                "id",
                "firstName",
                "lastName",
                "identificationNumber",
                "email",
              ],
            },
            {
              model: Pet,
              attributes: ["id", "name", "species", "breed", "image"],
            },
          ],
        },
      ],
      order: [["deliveryDate", "DESC"]],
    });

    res.status(200).json(completedAdoptions);
  } catch (error) {
    console.error("Error al obtener adopciones por usuario:", error);
    res.status(500).json({
      message:
        "Error al obtener adopciones completadas del usuario: " + error.message,
    });
  }
};

module.exports = {
  createAdoptionRequest,
  updateAdoptionRequestStatus,
  getAllRequests,
  getRequestsByUser,
  getCompletedAdoptionsByUser,
  deleteAdoptionRequest,
  getRequestsPaginated,
  getAllCompletedAdoptions,
  getCompletedAdoptionsPaginated,
  getCompletedAdoptionsByUserId,
};
