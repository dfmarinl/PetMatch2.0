<div align="center">

# 🐾 PetMatch

**Plataforma web para la gestion de adopcion de mascotas**

Disenada para hacer el proceso mas seguro, transparente y responsable tanto para quienes adoptan como para las mascotas adoptadas.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Sequelize_6-4169E1?style=flat-square&logo=postgresql&logoColor=white)

</div>

---

## 📖 Sobre el proyecto

PetMatch conecta personas que desean adoptar una mascota con refugios y organizaciones. A diferencia de una simple lista de mascotas disponibles, la plataforma implementa un sistema completo de **seguimiento post-adopcion** que garantiza el bienestar del animal despues de ser entregado a su nuevo hogar.

El proceso comienza con una solicitud de adopcion que incluye un cuestionario detallado sobre las condiciones del adoptante. Personal capacitado revisa y aprueba o rechaza cada solicitud. Una vez aprobada la adopcion, el adoptante debe completar informes de seguimiento periodicos que evaluan la salud, nutricion y vinculo afectivo de la mascota, brindando seguridad a ambas partes.

## ✨ Caracteristicas principales

| | Caracteristica |
|---|---|
| 🐶 | **Catalogo de mascotas** — Exploracion publica de mascotas disponibles con filtros y paginacion |
| 📝 | **Solicitudes de adopcion** — Formulario con cuestionario detallado (experiencia previa, tipo de vivienda, tiempo disponible, etc.) |
| ✅ | **Aprobacion por personal** — Empleados y administradores revisan, aprueban o rechazan solicitudes con observaciones |
| 🩺 | **Seguimiento post-adopcion** — Informes periodicos del adoptante sobre salud, nutricion, vinculo afectivo y convivencia con otras mascotas |
| 🔔 | **Notificaciones en tiempo real** — Alertas instantaneas via Socket.IO para actualizaciones de estado, nuevas solicitudes y reportes de seguimiento |
| 🔐 | **Recuperacion de contrasena** — Flujo completo con envio de enlace por correo electronico |
| 👥 | **Control de roles** — Tres niveles de acceso: cliente, empleado y administrador, cada uno con permisos diferenciados |
| 📧 | **Notificaciones por correo** — Correos automaticos para aprobaciones, rechazos, nuevas solicitudes y reportes de seguimiento |
| 📊 | **Panel de administracion** — Dashboard con estadisticas, gestion de mascotas, solicitudes, adopciones y usuarios |

## 🛠️ Stack tecnologico

| Capa | Tecnologia |
|------|-----------|
| **Frontend** | React 19, Vite 6, Tailwind CSS 4 |
| **Routing** | react-router-dom 7 |
| **HTTP Client** | Axios |
| **Backend** | Node.js, Express 5 |
| **ORM** | Sequelize 6 |
| **Base de datos** | PostgreSQL |
| **Autenticacion** | JWT, bcrypt |
| **Tiempo real** | Socket.IO |
| **Email** | Nodemailer |
| **Despliegue frontend** | Vercel |
| **Despliegue backend** | Render |
| **Base de datos (produccion)** | Neon PostgreSQL |

## 📂 Estructura del proyecto

```
PetMatch2.0/
├── backend/
│   ├── index.js                    # Punto de entrada de Express
│   ├── config/
│   │   └── database.js             # Configuracion de Sequelize + PostgreSQL
│   ├── models/                     # Modelos de Sequelize (User, Pet, AdoptionRequest, etc.)
│   │   └── index.js                # Asociaciones entre modelos
│   └── services/
│       ├── usuario/                # Autenticacion y gestion de usuarios
│       ├── mascota/                # CRUD de mascotas
│       ├── adopcion/               # Solicitudes y adopciones completadas
│       ├── notificacion/           # Notificaciones in-app
│       └── utils/                  # Utilidades (envio de emails)
└── frontend/
    └── frontend/                   # Aplicacion React (Vite)
        └── src/
            ├── Pages/              # Paginas principales
            ├── components/         # Componentes reutilizables
            ├── api/                # Modulos de comunicacion con la API
            ├── context/            # React Context (auth, socket, notificaciones)
            └── utils/              # Utilidades del frontend
```

## 🚀 Instalacion local

### Prerequisitos

- Node.js 18 o superior
- PostgreSQL local o un servicio de base de datos en la nube

### Backend

```bash
cd PetMatch2.0/backend
npm install
```

Crea un archivo `.env` en el directorio `backend/` con las variables de entorno (ver [Variables de entorno](#-variables-de-entorno)).

```bash
node index.js
```

> El servidor estara disponible en `http://localhost:3001`.

### Frontend

```bash
cd PetMatch2.0/frontend/frontend
npm install
npm run dev
```

> El frontend estara disponible en `http://localhost:5173`.

## 🔑 Variables de entorno

| Variable | Descripcion | Ejemplo |
|----------|------------|---------|
| `DATABASE_URL` | URL de conexion a PostgreSQL | `postgresql://user:pass@host:5432/dbname` |
| `JWT_SECRET_KEY` | Secreto para firmar tokens JWT | `tu_clave_secreta` |
| `EMAIL_USER` | Correo electronico para envio de notificaciones | `usuario@gmail.com` |
| `EMAIL_PASS` | Contrasena de aplicacion del correo | `contrasena_de_app` |
| `PORT` | Puerto del servidor backend | `3001` |

## 🌐 API

La API esta organizada por dominios y todas las rutas comienzan con `/api`.

| Grupo de rutas | Metodo | Descripcion |
|----------------|--------|-------------|
| `/api/auth` | `POST` | Registro, login, recuperacion de contrasena, perfil |
| `/api/users` | `CRUD` | Gestion de usuarios (solo empleado/admin) |
| `/api/pets` | `CRUD` | Gestion de mascotas (crear/editar: empleado/admin, lectura: publico) |
| `/api/adoption` | `POST/PUT/GET` | Solicitudes de adopcion, actualizacion de estado, adopciones completadas |
| `/api/follow` | `POST/PUT/GET` | Reportes de seguimiento post-adopcion |
| `/api/notificaciones` | `POST/GET/PATCH` | Notificaciones in-app por usuario o rol |

> La autenticacion se realiza via JWT en el header `Authorization: Bearer <token>`. Cada endpoint indica los roles permitidos.

## 🚢 Despliegue

| Servicio | URL |
|----------|-----|
| **Frontend** | [pet-match2-0.vercel.app](https://pet-match2-0.vercel.app) |
| **Backend** | [petmatch2-0.onrender.com](https://petmatch2-0.onrender.com) |
