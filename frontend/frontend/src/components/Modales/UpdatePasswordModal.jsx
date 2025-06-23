import React, { useState } from "react";
import { XCircle, CheckCircle } from "lucide-react";
import {
  verifyCurrentPasswordRequest,
  updatePasswordRequest,
} from "../../api/auth";

const UpdatePasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Nueva función para limpiar y cerrar el modal
  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsVerified(false);
    setError(null);
    setSuccessMsg(null);
    onClose();
  };

  const handleVerifyPassword = async () => {
    try {
      await verifyCurrentPasswordRequest(currentPassword);
      setIsVerified(true);
      setError(null);
    } catch (err) {
      setError(err.message || "Contraseña actual incorrecta");
      setIsVerified(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (newPassword.length < 8) {
      return setError("La nueva contraseña debe tener al menos 8 caracteres");
    }

    if (newPassword !== confirmPassword) {
      return setError("Las contraseñas no coinciden");
    }

    try {
      await updatePasswordRequest(newPassword);
      setSuccessMsg("Contraseña actualizada correctamente");

      // Esperar un momento antes de cerrar el modal
      setTimeout(() => {
        handleClose(); // limpia y cierra el modal
      }, 1000);
    } catch (err) {
      setError(err.message || "Error al actualizar la contraseña");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 border border-gray-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Actualizar Contraseña
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo de contraseña actual */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña actual
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                name="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <button
                type="button"
                onClick={handleVerifyPassword}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Verificar
              </button>
            </div>
            {isVerified && (
              <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Contraseña verificada
              </p>
            )}
          </div>

          {/* Nueva contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nueva contraseña
            </label>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={!isVerified}
              minLength={8}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!isVerified}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* Errores o confirmación */}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={!isVerified}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              Actualizar Contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordModal;
