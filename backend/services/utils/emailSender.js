const nodemailer = require("nodemailer");
require("dotenv").config();

// Transportador (ajustado según tu forgotPassword)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // ⚠️ para desarrollo local
  },
});

// Templates de correo centralizados
const emailTemplates = {
  adoptionApproved: ({ userName, petName, deliveryDate }) => ({
    subject: "¡Tu adopción fue aprobada! 🐾",
    html: `
      <h2>Hola ${userName},</h2>
      <p>¡Felicidades! Tu solicitud para adoptar a <strong>${petName}</strong> ha sido <strong>aprobada</strong>.</p>
      <p>La entrega está programada para el <strong>${deliveryDate.toLocaleDateString()}</strong>.</p>
      <p>Te contactaremos con más detalles pronto.</p>
      <br/>
      <p>Gracias por confiar en PetMatch 🐶</p>
    `,
  }),

  adoptionRejected: ({ userName, petName, observations }) => ({
    subject: "Tu solicitud fue rechazada 😢",
    html: `
      <h2>Hola ${userName},</h2>
      <p>Lamentamos informarte que tu solicitud para adoptar a <strong>${petName}</strong> ha sido <strong>rechazada</strong>.</p>
      ${observations ? `<p>Motivo: <em>${observations}</em></p>` : ""}
      <p>Gracias por tu interés. Te animamos a seguir explorando otras mascotas que buscan un hogar.</p>
      <br/>
      <p>El equipo de PetMatch 🐾</p>
    `,
  }),

  passwordReset: ({ userName, resetLink }) => ({
    subject: "Recuperación de contraseña - PetMatch",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <img src="https://res.cloudinary.com/djcnay2fx/image/upload/v1753202572/logo_fpycut.jpg" alt="Logo" width="100" />
        <h1>¡Hola de nuevo, ${userName}!</h1>
        <p>Recibimos una solicitud para restablecer tu contraseña. Si no fuiste tú, ignora este mensaje.</p>
        <a href="${resetLink}" style="display: inline-block; padding: 15px 30px; background-color: #ff5733; color: white; font-weight: bold; text-decoration: none; border-radius: 25px; margin-top: 20px;">
          Recuperar contraseña
        </a>
        <p style="margin-top: 30px;">Este enlace es válido durante 15 minutos.</p>
        <p><strong>¿No solicitaste esto?</strong></p>
        <p>Ignora este correo si no pediste restablecer tu contraseña.</p>
      </div>
    `,
  }),

  newAdoptionRequest: ({ userName, petName, requestLink }) => ({
  subject: "📢 Nueva solicitud de adopción recibida",
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Hola,</h2>
      <p>Se ha generado una nueva solicitud de adopción para la mascota <strong>${petName}</strong>.</p>
      <p>Por favor, revisa la solicitud lo antes posible.</p>

      <br/>
      <p style="margin-top: 20px;">Gracias por tu compromiso con PetMatch 🐾</p>
    </div>
  `,
  }),

  
};

// Función principal para enviar correos
const sendEmail = async (type, to, data) => {
  const template = emailTemplates[type];

  if (!template) {
    throw new Error(`No se encontró plantilla para el tipo: ${type}`);
  }

  const { subject, html } = template(data);

  try {
    await transporter.sendMail({
      from: `"PetMatch 🐾" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email enviado (${type}) a: ${to}`);
  } catch (error) {
    console.error("❌ Error al enviar el correo:", error);
    throw error;
  }
};

module.exports = { sendEmail };

