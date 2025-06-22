import React, { useState, useEffect } from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';

const PetModal = ({
  isOpen,
  onClose,
  onSubmit,
  pet,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Perro',
    breed: '',
    age: '',
    gender: 'Macho',
    size: 'Mediano',
    weight: 0,
    color: '',
    description: '',
    healthStatus: '',
    vaccinated: false,
    sterilized: false,
    specialNeeds: '',
    status: 'Disponible',
    image: '',
    location: '',
    contactInfo: {
      shelter: '',
      phone: '',
      email: ''
    }
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name,
        type: pet.type,
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender,
        size: pet.size,
        weight: pet.weight,
        color: pet.color,
        description: pet.description,
        healthStatus: pet.healthStatus,
        vaccinated: pet.vaccinated,
        sterilized: pet.sterilized,
        specialNeeds: pet.specialNeeds,
        status: pet.status,
        image: pet.image,
        location: pet.location,
        contactInfo: pet.contactInfo
      });
    } else {
      setFormData({
        name: '',
        type: 'Perro',
        breed: '',
        age: '',
        gender: 'Macho',
        size: 'Mediano',
        weight: 0,
        color: '',
        description: '',
        healthStatus: '',
        vaccinated: false,
        sterilized: false,
        specialNeeds: '',
        status: 'Disponible',
        image: '',
        location: '',
        contactInfo: {
          shelter: '',
          phone: '',
          email: ''
        }
      });
    }
    setErrors({});
  }, [pet, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.breed.trim()) newErrors.breed = 'La raza es requerida';
    if (!formData.age.trim()) newErrors.age = 'La edad es requerida';
    if (!formData.color.trim()) newErrors.color = 'El color es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.location.trim()) newErrors.location = 'La ubicación es requerida';
    if (formData.weight <= 0) newErrors.weight = 'El peso debe ser mayor a 0';
    if (!formData.contactInfo.shelter.trim()) newErrors['contactInfo.shelter'] = 'El refugio es requerido';
    if (!formData.contactInfo.phone.trim()) newErrors['contactInfo.phone'] = 'El teléfono es requerido';
    if (!formData.contactInfo.email.trim()) newErrors['contactInfo.email'] = 'El email es requerido';
    if (!formData.image.trim()) newErrors.image = 'La imagen es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (field, value) => {
    if (field.startsWith('contactInfo.')) {
      const contactField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [contactField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {pet ? 'Editar Mascota' : 'Agregar Nueva Mascota'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Información Básica */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nombre de la mascota"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Raza *
                  </label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) => handleChange('breed', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.breed ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Raza de la mascota"
                  />
                  {errors.breed && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.breed}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Edad *
                  </label>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.age ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: 2 años, 6 meses"
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.age}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Género
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tamaño
                  </label>
                  <select
                    value={formData.size}
                    onChange={(e) => handleChange('size', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Pequeño">Pequeño</option>
                    <option value="Mediano">Mediano</option>
                    <option value="Grande">Grande</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peso (kg) *
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.weight ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Peso en kilogramos"
                  />
                  {errors.weight && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.weight}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color *
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.color ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Color de la mascota"
                  />
                  {errors.color && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.color}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe la personalidad y características de la mascota..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Salud */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Salud</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado de Salud
                  </label>
                  <input
                    type="text"
                    value={formData.healthStatus}
                    onChange={(e) => handleChange('healthStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Excelente, Buena, Regular"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Necesidades Especiales
                  </label>
                  <input
                    type="text"
                    value={formData.specialNeeds}
                    onChange={(e) => handleChange('specialNeeds', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Dieta especial, medicamentos"
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.vaccinated}
                      onChange={(e) => handleChange('vaccinated', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Vacunado</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.sterilized}
                      onChange={(e) => handleChange('sterilized', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Esterilizado</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado de Adopción
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Adoptado">Adoptado</option>
                    <option value="En cuidado médico">En cuidado médico</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de Imagen *
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => handleChange('image', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.image ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {errors.image && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.image}
                </p>
              )}
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Ubicación y Contacto */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ubicación y Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ubicación *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ciudad, Estado, País"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.location}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Refugio/Organización *
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo.shelter}
                    onChange={(e) => handleChange('contactInfo.shelter', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors['contactInfo.shelter'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nombre del refugio"
                  />
                  {errors['contactInfo.shelter'] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors['contactInfo.shelter']}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={(e) => handleChange('contactInfo.phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors['contactInfo.phone'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+58 412 123 4567"
                  />
                  {errors['contactInfo.phone'] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors['contactInfo.phone']}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => handleChange('contactInfo.email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors['contactInfo.email'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="contacto@refugio.org"
                  />
                  {errors['contactInfo.email'] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors['contactInfo.email']}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Guardando...' : (pet ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetModal;