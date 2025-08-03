import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

const AdoptionFollowUpModal = ({ isOpen, onClose, onSubmit, pet }) => {
  const [formData, setFormData] = useState({
    petIsHealthy: false,
    hasProperNutrition: false,
    showsAffectionBond: false,
    otherPetsAreFriendly: false,
    comments: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Resetear el formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setFormData({
        petIsHealthy: false,
        hasProperNutrition: false,
        showsAffectionBond: false,
        otherPetsAreFriendly: false,
        comments: "",
      });
      setImages([]);
      setImagePreviews([]);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      ...formData,
      // Asegurar que todos los campos booleanos tengan un valor explícito
      petIsHealthy: formData.petIsHealthy || false,
      hasProperNutrition: formData.hasProperNutrition || false,
      showsAffectionBond: formData.showsAffectionBond || false,
      otherPetsAreFriendly: formData.otherPetsAreFriendly || false,
      completedAdoptionId: pet?.completedAdoptionId,
      visitDate: new Date().toISOString(),
      images,
    };

    onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Seguimiento Post-Adopción"
      className="backdrop-blur-sm bg-white/90 rounded-xl shadow-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: "petIsHealthy", label: "La mascota está saludable" },
          {
            name: "hasProperNutrition",
            label: "La mascota tiene una nutrición adecuada",
          },
          {
            name: "showsAffectionBond",
            label: "Hay un vínculo afectivo adoptante-mascota",
          },
          {
            name: "otherPetsAreFriendly",
            label: "Otras mascotas conviven amigablemente",
          },
        ].map((item) => (
          <div key={item.name} className="flex items-center space-x-2">
            <input
              type="checkbox"
              name={item.name}
              checked={formData[item.name]}
              onChange={handleChange}
            />
            <label>{item.label}</label>
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium">
            Comentarios adicionales
          </label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Foto de la mascota
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full mt-1"
          />
          {imagePreviews.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {imagePreviews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`preview-${idx}`}
                  className="w-24 h-24 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-md"
          >
            Guardar Seguimiento
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdoptionFollowUpModal;
