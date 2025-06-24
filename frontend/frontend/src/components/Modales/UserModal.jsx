import React, { useState, useEffect } from "react";
import { XCircle } from "lucide-react";

const UserModal = ({ isOpen, onClose, onSubmit, user }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    identificationNumber: "",
    age: "",
    email: "",
    city: "",
    direction: "",
    password: "",
    rol: "cliente",
  });

  const isEditMode = !!user;

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        identificationNumber: user.identificationNumber || "",
        age: user.age || "",
        email: user.email || "",
        city: user.city || "",
        direction: user.direction || "",
        rol: user.rol || "cliente",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        identificationNumber: "",
        age: "",
        email: "",
        city: "",
        direction: "",
        password: "",
        rol: "cliente",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = { ...formData };
    if (isEditMode) {
      delete dataToSend.password;
    }
    onSubmit(dataToSend);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {isEditMode ? "Editar Usuario" : "Registrar Usuario"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Número de identificación
              </label>
              <input
                type="text"
                name="identificationNumber"
                value={formData.identificationNumber}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Edad
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rol
                </label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="cliente">Cliente</option>
                  <option value="administrador">Administrador</option>
                  <option value="empleado">Empleado</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            {!isEditMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ciudad
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dirección
              </label>
              <input
                type="text"
                name="direction"
                value={formData.direction}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {isEditMode ? "Actualizar" : "Registrar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
