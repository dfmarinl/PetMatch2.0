const bcrypt = require("bcrypt");
require("dotenv").config();
const { sequelize } = require("./models");
const User = require("./models/user");
const Pet = require("./models/pet");
const AdoptionRequest = require("./models/adoptionRequest");
const CompletedAdoption = require("./models/completedAdoption");
const AdoptionFollowUp = require("./models/adoptionFollowUp");
const Notification = require("./models/Notification");

const HASH_PASSWORD = bcrypt.hashSync("Password123!", 10);

const users = [
  {
    firstName: "Carlos",
    lastName: "Mendoza",
    identificationNumber: "1010101010",
    age: 35,
    email: "carlos.admin@petmatch.com",
    city: "Bogota",
    direction: "Cra 7 #45-12",
    password: HASH_PASSWORD,
    rol: "administrador",
  },
  {
    firstName: "Maria",
    lastName: "Lopez",
    identificationNumber: "2020202020",
    age: 28,
    email: "maria.empleado@petmatch.com",
    city: "Medellin",
    direction: "Calle 30 #15-8",
    password: HASH_PASSWORD,
    rol: "empleado",
  },
  {
    firstName: "Juan",
    lastName: "Perez",
    identificationNumber: "3030303030",
    age: 30,
    email: "juan.cliente@petmatch.com",
    city: "Cali",
    direction: "Av 6N #23-45",
    password: HASH_PASSWORD,
    rol: "cliente",
  },
  {
    firstName: "Ana",
    lastName: "Garcia",
    identificationNumber: "4040404040",
    age: 25,
    email: "ana.cliente@petmatch.com",
    city: "Barranquilla",
    direction: "Cra 53 #68-20",
    password: HASH_PASSWORD,
    rol: "cliente",
  },
  {
    firstName: "Pedro",
    lastName: "Rodriguez",
    identificationNumber: "5050505050",
    age: 42,
    email: "pedro.cliente@petmatch.com",
    city: "Bucaramanga",
    direction: "Calle 45 #10-30",
    password: HASH_PASSWORD,
    rol: "cliente",
  },
];

const pets = [
  {
    name: "Luna",
    species: "Perro",
    breed: "Labrador Retriever",
    age: 3,
    gender: "female",
    description: "Luna es una perrita muy carinosa y juguetona. Le encanta pasear y es excelente con los ninos.",
    available: true,
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
  },
  {
    name: "Max",
    species: "Perro",
    breed: "Pastor Aleman",
    age: 5,
    gender: "male",
    description: "Max es un perro leal y protector. Ideal para familias con espacio. Conocimiento basico de obediencia.",
    available: true,
    image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400&h=300&fit=crop",
  },
  {
    name: "Simba",
    species: "Gato",
    breed: "Mestizo",
    age: 2,
    gender: "male",
    description: "Simba es un gato independiente pero muy afectuoso. Usa el arenero correctamente y le gusta trepar.",
    available: true,
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop",
  },
  {
    name: "Milo",
    species: "Gato",
    breed: "Siamés",
    age: 1,
    gender: "male",
    description: "Milo es un gatito curioso y activo. Se lleva bien con otros gatos y es muy vocales.",
    available: true,
    image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop",
  },
  {
    name: "Coco",
    species: "Perro",
    breed: "Caniche",
    age: 4,
    gender: "female",
    description: "Coco es una perrita pequena y elegante. No muda mucho pelo, ideal para apartamentos.",
    available: true,
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop",
  },
  {
    name: "Nieve",
    species: "Conejo",
    breed: "Angora",
    age: 1,
    gender: "female",
    description: "Nieve es una conejita blanca y suave. Tranquila y limpia, perfecta para interior.",
    available: true,
    image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop",
  },
  {
    name: "Rayo",
    species: "Perro",
    breed: "Beagle",
    age: 2,
    gender: "male",
    description: "Rayo es un beagle lleno de energia. Le encanta seguir rastros y jugar a buscar la pelota.",
    available: true,
    image: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400&h=300&fit=crop",
  },
  {
    name: "Kiwi",
    species: "Ave",
    breed: "Canario",
    age: 3,
    gender: "male",
    description: "Kiwi es un canario con un canto hermoso. Activo y saludable, necesita una jaula amplia.",
    available: true,
    image: "https://images.unsplash.com/photo-1452857297128-d9c29adba80b?w=400&h=300&fit=crop",
  },
  {
    name: "Nala",
    species: "Gato",
    breed: "Maine Coon",
    age: 4,
    gender: "female",
    description: "Nala es una gata grande y elegante. Muy dulce con la familia y tolerante con los ninos.",
    available: true,
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop",
  },
  {
    name: "Toby",
    species: "Perro",
    breed: "Golden Retriever",
    age: 6,
    gender: "male",
    description: "Toby es un golden senior, muy calmado y carinoso. Ya esta entrenado y es ideal para hogares tranquilos.",
    available: true,
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop",
  },
];

const adoptionRequests = [
  {
    reasonForAdoption: "Quiero darle un hogar a Luna, me encantan los labradores y tengo experiencia previa con la raza.",
    hadPetsBefore: true,
    dailyTimeForPet: 5,
    livesAlone: false,
    hasChildrenAtHome: true,
    residenceType: "house",
    otherPetsAtHome: false,
    adoptionStatus: "approved",
    observations: "Familia idonea, buena experiencia con mascotas. Aprobado.",
  },
  {
    reasonForAdoption: "Siempre he querido un gato siames. Mi apartamento es tranquilo y tengo tiempo para jugar con el.",
    hadPetsBefore: false,
    dailyTimeForPet: 4,
    livesAlone: true,
    hasChildrenAtHome: false,
    residenceType: "apartment",
    otherPetsAtHome: false,
    adoptionStatus: "approved",
    observations: "Adoptante soltero pero responsable. Buen perfil.",
  },
  {
    reasonForAdoption: "Quiero adoptar a Rayo para que compania a mis hijos. Tenemos un patio grande.",
    hadPetsBefore: true,
    dailyTimeForPet: 6,
    livesAlone: false,
    hasChildrenAtHome: true,
    residenceType: "house",
    otherPetsAtHome: false,
    adoptionStatus: "pending",
    observations: null,
  },
  {
    reasonForAdoption: "Me interesa adoptar a Max, tengo experiencia con pastores alemanes.",
    hadPetsBefore: true,
    dailyTimeForPet: 3,
    livesAlone: false,
    hasChildrenAtHome: false,
    residenceType: "farm",
    otherPetsAtHome: true,
    adoptionStatus: "rejected",
    observations: "El tiempo diario dedicado es insuficiente para un pastor aleman. Se recomienda otra raza.",
  },
  {
    reasonForAdoption: "Quiero adoptar a Coco para mi mama que vive sola. Ella ama los caniches.",
    hadPetsBefore: true,
    dailyTimeForPet: 7,
    livesAlone: false,
    hasChildrenAtHome: false,
    residenceType: "apartment",
    otherPetsAtHome: false,
    adoptionStatus: "suspended",
    observations: "Solicitud suspendida pendiente de verificacion de domicilio.",
  },
  {
    reasonForAdoption: "Nala me parece una gata maravillosa. Tengo experiencia con maine coon y un hogar apto.",
    hadPetsBefore: true,
    dailyTimeForPet: 5,
    livesAlone: false,
    hasChildrenAtHome: false,
    residenceType: "house",
    otherPetsAtHome: true,
    adoptionStatus: "pending",
    observations: null,
  },
];

const completedAdoptions = [
  {
    approvalDate: "2025-12-15",
    deliveryDate: "2025-12-20",
    notes: "Entrega realizada exitosamente. La familia esta encantada con Luna.",
  },
  {
    approvalDate: "2026-01-10",
    deliveryDate: "2026-01-15",
    notes: "Milo entregado a su nuevo hogar. Se entregaron instrucciones de cuidado.",
  },
];

const followUps = [
  {
    visitDate: "2026-02-15",
    petIsHealthy: true,
    hasProperNutrition: true,
    showsAffectionBond: true,
    otherPetsAreFriendly: null,
    isSuccessful: true,
    comments: "Luna esta excelente, muy adaptada a la familia. Juega mucho con los ninos.",
    image: null,
  },
  {
    visitDate: "2026-03-20",
    petIsHealthy: true,
    hasProperNutrition: true,
    showsAffectionBond: true,
    otherPetsAreFriendly: null,
    isSuccessful: true,
    comments: "Segundo seguimiento: Luna sigue muy bien. Ha ganado un poco de peso, se recomienda mas ejercicio.",
    image: null,
  },
  {
    visitDate: "2026-02-20",
    petIsHealthy: true,
    hasProperNutrition: true,
    showsAffectionBond: true,
    otherPetsAreFriendly: null,
    isSuccessful: true,
    comments: "Milo esta adaptado perfectamente. Es carinoso y usa su arenero sin problemas.",
    image: null,
  },
];

const notifications = [
  {
    userId: 1,
    rol: "administrador",
    message: "Nueva solicitud de adopcion recibida de Juan Perez para Luna.",
    type: "nuevaSolicitud",
    isRead: true,
  },
  {
    userId: 3,
    rol: "cliente",
    message: "Tu solicitud de adopcion para Luna ha sido aprobada. Felicidades!",
    type: "aprobacion",
    isRead: true,
  },
  {
    userId: 2,
    rol: "empleado",
    message: "Nuevo reporte de seguimiento disponible para la adopcion de Luna.",
    type: "seguimiento",
    isRead: false,
  },
  {
    userId: 5,
    rol: "cliente",
    message: "Tu solicitud de adopcion para Coco ha sido suspendida pendiente de verificacion.",
    type: "suspension",
    isRead: false,
  },
  {
    userId: 1,
    rol: "administrador",
    message: "Nueva solicitud de adopcion recibida de Ana Garcia para Nala.",
    type: "nuevaSolicitud",
    isRead: false,
  },
];

async function seed() {
  try {
    console.log("Conectando a la base de datos...");
    await sequelize.authenticate();
    console.log("Conexion establecida.");

    console.log("Sincronizando tablas (force: true)...");
    await sequelize.sync({ force: true });
    console.log("Tablas creadas.");

    console.log("Insertando usuarios...");
    const createdUsers = await User.bulkCreate(users);
    console.log(`  ${createdUsers.length} usuarios creados.`);

    console.log("Insertando mascotas...");
    const createdPets = await Pet.bulkCreate(pets);
    console.log(`  ${createdPets.length} mascotas creadas.`);

    console.log("Insertando solicitudes de adopcion...");
    const requestsWithIds = adoptionRequests.map((req, i) => ({
      ...req,
      userId: i < 3 ? createdUsers[2].id : (i < 5 ? createdUsers[i].id : createdUsers[4].id),
      petId: i === 0 ? createdUsers[2].id : createdPets[i].id,
    }));

    const fixedRequests = [
      { ...adoptionRequests[0], userId: createdUsers[2].id, petId: createdPets[0].id },
      { ...adoptionRequests[1], userId: createdUsers[3].id, petId: createdPets[3].id },
      { ...adoptionRequests[2], userId: createdUsers[2].id, petId: createdPets[6].id },
      { ...adoptionRequests[3], userId: createdUsers[4].id, petId: createdPets[1].id },
      { ...adoptionRequests[4], userId: createdUsers[2].id, petId: createdPets[4].id },
      { ...adoptionRequests[5], userId: createdUsers[3].id, petId: createdPets[8].id },
    ];

    const createdRequests = await AdoptionRequest.bulkCreate(fixedRequests);
    console.log(`  ${createdRequests.length} solicitudes creadas.`);

    console.log("Insertando adopciones completadas...");
    const completions = [
      { ...completedAdoptions[0], adoptionRequestId: createdRequests[0].id },
      { ...completedAdoptions[1], adoptionRequestId: createdRequests[1].id },
    ];
    const createdCompletions = await CompletedAdoption.bulkCreate(completions);
    console.log(`  ${createdCompletions.length} adopciones completadas creadas.`);

    console.log("Insertando seguimientos...");
    const followUpsData = [
      { ...followUps[0], completedAdoptionId: createdCompletions[0].id },
      { ...followUps[1], completedAdoptionId: createdCompletions[0].id },
      { ...followUps[2], completedAdoptionId: createdCompletions[1].id },
    ];
    const createdFollowUps = await AdoptionFollowUp.bulkCreate(followUpsData);
    console.log(`  ${createdFollowUps.length} seguimientos creados.`);

    console.log("Insertando notificaciones...");
    const notifsWithIds = [
      { ...notifications[0], userId: createdUsers[0].id },
      { ...notifications[1], userId: createdUsers[2].id },
      { ...notifications[2], userId: createdUsers[1].id },
      { ...notifications[3], userId: createdUsers[2].id },
      { ...notifications[4], userId: createdUsers[0].id },
    ];
    const createdNotifs = await Notification.bulkCreate(notifsWithIds);
    console.log(`  ${createdNotifs.length} notificaciones creadas.`);

    console.log("\n--- RESUMEN ---");
    console.log(`Usuarios:          ${createdUsers.length}`);
    console.log(`Mascotas:          ${createdPets.length}`);
    console.log(`Solicitudes:       ${createdRequests.length}`);
    console.log(`Adopciones:        ${createdCompletions.length}`);
    console.log(`Seguimientos:      ${createdFollowUps.length}`);
    console.log(`Notificaciones:    ${createdNotifs.length}`);
    console.log("\nSeed completado exitosamente.");

    process.exit(0);
  } catch (error) {
    console.error("Error durante el seed:", error);
    process.exit(1);
  }
}

seed();
