import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PetRegistrationForm from '../components/forms/PetRegistrationForm';
import { uploadPetImage } from '../api/petImage'; // Asegúrate de tener esta función

const PetRegistration = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      console.log('Datos recibidos del formulario:', formData);

      // Subir la imagen a Cloudinary
      const imageUrl = await uploadPetImage(formData.image);
      console.log('Imagen subida a Cloudinary:', imageUrl);

      const petData = {
        ...formData,
        image: imageUrl
      };

      console.log('Datos finales para enviar al backend:', petData);

      // Aquí harías la llamada a tu API
      /*
      const token = localStorage.getItem('token');
      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(petData)
      });

      if (!response.ok) {
        throw new Error('Error al registrar la mascota');
      }
      */

      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert('¡Mascota registrada exitosamente!');
      navigate('/admin');
    } catch (error) {
      console.error('Error al registrar la mascota:', error);
      alert('Ocurrió un error al registrar la mascota');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PetRegistrationForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default PetRegistration;
