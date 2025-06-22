import { useState } from 'react';
import { Upload, X, Camera, Save, ArrowLeft } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const PetRegistrationForm = ({
  onSubmit,
  onCancel,
  loading = false,
  initialData = null
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    species: initialData?.species || '',
    breed: initialData?.breed || '',
    age: initialData?.age || '',
    gender: initialData?.gender || '',
    description: initialData?.description || '',
    available: initialData?.available !== undefined ? initialData.available : true
  });

  const [imagePreview, setImagePreview] = useState(initialData?.image || null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  const speciesOptions = [
    { value: '', label: 'Seleccionar especie' },
    { value: 'Perro', label: 'Perro' },
    { value: 'Gato', label: 'Gato' },
    { value: 'Conejo', label: 'Conejo' },
    { value: 'Ave', label: 'Ave' },
    { value: 'Otro', label: 'Otro' }
  ];

  const genderOptions = [
    { value: '', label: 'Seleccionar género' },
    { value: 'male', label: 'Macho' },
    { value: 'female', label: 'Hembra' }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.species) newErrors.species = 'La especie es requerida';
    if (!formData.age || formData.age < 0) newErrors.age = 'Edad inválida';
    if (!formData.gender) newErrors.gender = 'El género es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSend = {
        ...formData,
        age: parseInt(formData.age),
        image: imageFile // Archivo real para subir a Cloudinary
      };
      onSubmit(dataToSend);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file); // Guardar el archivo para Cloudinary
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result); // Mostrar preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) handleImageUpload(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onCancel && (
              <button
                onClick={onCancel}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData ? 'Editar Mascota' : 'Registrar Nueva Mascota'}
            </h2>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna izquierda */}
          <div className="space-y-6">
            <Input
              label="Nombre *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />
            <div>
              <label className="block text-sm font-medium mb-1">Especie *</label>
              <select
                name="species"
                value={formData.species}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                {speciesOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.species && <p className="text-sm text-red-600">{errors.species}</p>}
            </div>
            <Input
              label="Raza"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
            />
            <Input
              label="Edad (años) *"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              error={errors.age}
            />
            <div>
              <label className="block text-sm font-medium mb-1">Género *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                {genderOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.gender && <p className="text-sm text-red-600">{errors.gender}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full border rounded-lg px-3 py-2"
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
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
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fotografía</h3>
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <div
              className={`border-2 border-dashed p-6 rounded-lg text-center relative ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium">
                  {imagePreview ? 'Cambiar foto' : 'Subir fotografía'}
                </p>
                <p className="text-xs text-gray-500">Arrastra o haz clic para subir</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            {onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" loading={loading}>
              <Save className="w-4 h-4 mr-2" />
              {initialData ? 'Actualizar Mascota' : 'Registrar Mascota'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PetRegistrationForm;
