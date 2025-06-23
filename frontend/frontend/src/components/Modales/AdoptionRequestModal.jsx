import React, { useState } from 'react';
import Modal from '../ui/Modal'; // Asegúrate de tener un modal base reutilizable o ajusta según tu implementación
import Button from '../ui/Button';

const AdoptionRequestModal = ({ isOpen, onClose, onSubmit, petId, userId }) => {
  const [formData, setFormData] = useState({
    reasonForAdoption: '',
    hadPetsBefore: false,
    dailyTimeForPet: '',
    livesAlone: false,
    hasChildrenAtHome: false,
    residenceType: 'house',
    otherPetsAtHome: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      petId,
      userId,
    };
    onSubmit(data);
    onClose(); // Opcional: cerrar modal tras envío
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Formulario de Solicitud de Adopción">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">¿Por qué quieres adoptar?</label>
          <textarea
            name="reasonForAdoption"
            required
            value={formData.reasonForAdoption}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="hadPetsBefore"
            checked={formData.hadPetsBefore}
            onChange={handleChange}
          />
          <label>¿Has tenido mascotas antes?</label>
        </div>

        <div>
          <label className="block text-sm font-medium">¿Cuántas horas al día puedes dedicarle?</label>
          <input
            type="number"
            name="dailyTimeForPet"
            required
            step="0.1"
            min="0"
            value={formData.dailyTimeForPet}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="livesAlone"
            checked={formData.livesAlone}
            onChange={handleChange}
          />
          <label>¿Vives solo/a?</label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="hasChildrenAtHome"
            checked={formData.hasChildrenAtHome}
            onChange={handleChange}
          />
          <label>¿Tienes niños en casa?</label>
        </div>

        <div>
          <label className="block text-sm font-medium">Tipo de vivienda</label>
          <select
            name="residenceType"
            value={formData.residenceType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="house">Casa</option>
            <option value="apartment">Apartamento</option>
            <option value="farm">Finca</option>
            <option value="other">Otro</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="otherPetsAtHome"
            checked={formData.otherPetsAtHome}
            onChange={handleChange}
          />
          <label>¿Tienes otras mascotas?</label>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancelar
          </Button>
          <Button type="submit">Enviar Solicitud</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdoptionRequestModal;
