import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { uploadPetImage } from "../../api/petImage";
import { registerPet, updatePet } from "../../api/pet";
import { useNavigate } from "react-router-dom";

const PetModal = ({ isOpen, onClose, pet, loading = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
    description: "",
    available: true,
    image: "",
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || "",
        species: pet.species || "",
        breed: pet.breed || "",
        age: pet.age || "",
        gender: pet.gender || "",
        description: pet.description || "",
        available: pet.available !== undefined ? pet.available : true,
        image: pet.image || "",
      });
      setImagePreview(pet.image || null);
      setImageFile(null);
    } else {
      setFormData({
        name: "",
        species: "",
        breed: "",
        age: "",
        gender: "",
        description: "",
        available: true,
        image: "",
      });
      setImagePreview(null);
      setImageFile(null);
    }
    setErrors({});
  }, [pet, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    if (!formData.species) newErrors.species = "La especie es requerida";
    if (!formData.age || formData.age < 0) newErrors.age = "Edad inválida";
    if (!formData.gender) newErrors.gender = "El género es requerido";
    if (!formData.description.trim())
      newErrors.description = "La descripción es requerida";
    if (!imagePreview) newErrors.image = "La imagen es requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        imageUrl = await uploadPetImage(imageFile);
      }

      const petPayload = {
        ...formData,
        age: parseInt(formData.age, 10),
        image: imageUrl,
      };

      if (pet) {
        await updatePet(pet.id, petPayload);
        alert("Mascota actualizada exitosamente");
      } else {
        await registerPet(petPayload);
        alert("Mascota registrada exitosamente");
      }

      onClose();
      navigate("/admin");
    } catch (error) {
      console.error("Error al guardar la mascota:", error);
      alert("Hubo un error. Intenta nuevamente.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) handleImageUpload(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {pet ? "Editar Mascota" : "Registrar Nueva Mascota"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nombre de la mascota"
            />
            {errors.name && (
              <p className="text-sm text-red-600">
                <AlertCircle size={14} className="inline mr-1" />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especie *
            </label>
            <select
              name="species"
              value={formData.species}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Seleccionar especie</option>
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
              <option value="Conejo">Conejo</option>
              <option value="Ave">Ave</option>
              <option value="Otro">Otro</option>
            </select>
            {errors.species && (
              <p className="text-sm text-red-600">
                <AlertCircle size={14} className="inline mr-1" />
                {errors.species}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Raza
            </label>
            <input
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Raza de la mascota"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Edad (años) *
            </label>
            <input
              type="number"
              name="age"
              min="0"
              max="20"
              value={formData.age}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.age ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Edad"
            />
            {errors.age && (
              <p className="text-sm text-red-600">
                <AlertCircle size={14} className="inline mr-1" />
                {errors.age}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Género *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Seleccionar género</option>
              <option value="male">Macho</option>
              <option value="female">Hembra</option>
            </select>
            {errors.gender && (
              <p className="text-sm text-red-600">
                <AlertCircle size={14} className="inline mr-1" />
                {errors.gender}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Describe la mascota"
            />
            {errors.description && (
              <p className="text-sm text-red-600">
                <AlertCircle size={14} className="inline mr-1" />
                {errors.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
            />
            <label className="text-sm">Disponible para adopción</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fotografía *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="w-full"
            />
            {errors.image && (
              <p className="text-sm text-red-600">
                <AlertCircle size={14} className="inline mr-1" />
                {errors.image}
              </p>
            )}
            {imagePreview && (
              <div className="mt-2 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Guardando..."
                : pet
                ? "Actualizar Mascota"
                : "Registrar Mascota"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetModal;
