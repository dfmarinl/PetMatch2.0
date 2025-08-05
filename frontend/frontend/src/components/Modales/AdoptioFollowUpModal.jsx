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
  const [errors, setErrors] = useState({});

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
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Asegurar que los checkboxes siempre manejen valores booleanos
    const newValue = type === "checkbox" ? Boolean(checked) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Limpiar errores cuando el usuario hace cambios
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);

    // Limpiar error de imagen si existe
    if (errors.images) {
      setErrors((prev) => ({
        ...prev,
        images: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar que los comentarios no estén vacíos
    if (!formData.comments.trim()) {
      newErrors.comments = "Los comentarios son obligatorios";
    }

    // Validar que se haya seleccionado al menos una imagen
    if (!images || images.length === 0) {
      newErrors.images = "Debe seleccionar al menos una imagen";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar formulario antes de enviar
    if (!validateForm()) {
      return;
    }

    const data = {
      // Garantizar explícitamente que todos los campos booleanos sean booleanos
      petIsHealthy: Boolean(formData.petIsHealthy),
      hasProperNutrition: Boolean(formData.hasProperNutrition),
      showsAffectionBond: Boolean(formData.showsAffectionBond),
      otherPetsAreFriendly: Boolean(formData.otherPetsAreFriendly), // Corregido para siempre ser booleano
      comments: formData.comments,
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
              checked={Boolean(formData[item.name])}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label className="text-sm font-medium text-gray-900">
              {item.label}
            </label>
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium">
            Comentarios adicionales *
          </label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            className={`w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.comments ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Describe el estado actual de la mascota, comportamiento, adaptación, etc."
          />
          {errors.comments && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.comments}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">
            Foto de la mascota *
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className={`w-full mt-1 ${errors.images ? "border-red-500" : ""}`}
          />
          {errors.images && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.images}
            </p>
          )}
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
