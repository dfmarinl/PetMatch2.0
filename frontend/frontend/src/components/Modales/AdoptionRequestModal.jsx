import React, { useState } from "react";
import { X } from "lucide-react";
import { createAdoptionRequest } from "../../api/requests";
import toast from "react-hot-toast";


const AdoptionRequestModal = ({ isOpen, onClose, pet ,navigate  }) => {
  const [form, setForm] = useState({
    reasonForAdoption: "",
    hadPetsBefore: false,
    dailyTimeForPet: "",
    livesAlone: false,
    hasChildrenAtHome: false,
    residenceType: "",
    otherPetsAtHome: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen || !pet) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await createAdoptionRequest({
        petId: pet.id,
        ...form,
        dailyTimeForPet: parseFloat(form.dailyTimeForPet),
      });

      setMessage("¡Solicitud enviada con éxito!");
      setForm({
        reasonForAdoption: "",
        hadPetsBefore: false,
        dailyTimeForPet: "",
        livesAlone: false,
        hasChildrenAtHome: false,
        residenceType: "",
        otherPetsAtHome: false,
      });
      toast.success("¡Solicitud enviada con éxito!");
      onClose();
      setTimeout(() => {
      navigate(0); // recarga la página después de mostrar el toast
      }, 1500);
      

    } catch (error) {
      setMessage("Error al enviar la solicitud.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Solicitud de Adopción para {pet.name}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            name="reasonForAdoption"
            placeholder="¿Por qué quieres adoptar esta mascota?"
            value={form.reasonForAdoption}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />

          <input
            type="number"
            name="dailyTimeForPet"
            step="1"
            min="0"
            max="15"
            placeholder="¿Cuántas horas al día dedicarías a la mascota?"
            value={form.dailyTimeForPet}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="hadPetsBefore"
              checked={form.hadPetsBefore}
              onChange={handleChange}
            />
            <label htmlFor="hadPetsBefore">¿Has tenido mascotas antes?</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="livesAlone"
              checked={form.livesAlone}
              onChange={handleChange}
            />
            <label htmlFor="livesAlone">¿Vives solo/a?</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="hasChildrenAtHome"
              checked={form.hasChildrenAtHome}
              onChange={handleChange}
            />
            <label htmlFor="hasChildrenAtHome">¿Hay niños en casa?</label>
          </div>

          <select
            name="residenceType"
            value={form.residenceType}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          >
            <option value="">Tipo de vivienda</option>
            <option value="house">Casa</option>
            <option value="apartment">Apartamento</option>
            <option value="farm">Finca</option>
            <option value="other">Otro</option>
          </select>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="otherPetsAtHome"
              checked={form.otherPetsAtHome}
              onChange={handleChange}
            />
            <label htmlFor="otherPetsAtHome">
              ¿Tienes otras mascotas en casa?
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
          >
            {loading ? "Enviando..." : "Enviar Solicitud"}
          </button>

          {message && (
            <p
              className={`text-sm mt-2 text-center ${
                message.includes("éxito") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdoptionRequestModal;
