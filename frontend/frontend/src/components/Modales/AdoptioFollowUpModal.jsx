import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const AdoptionFollowUpModal = ({ isOpen, onClose, onSubmit, requestId }) => {
  const [formData, setFormData] = useState({
    visitDate: new Date().toISOString().slice(0, 10),
    petIsHealthy: false,
    hasProperNutrition: false,
    showsAffectionBond: false,
    otherPetsAreFriendly: false,
    comments: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      requestId, // si está relacionado con una solicitud específica
    };
    onSubmit(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Seguimiento Post-Adopción">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Fecha de visita</label>
          <input
            type="date"
            name="visitDate"
            value={formData.visitDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="petIsHealthy"
            checked={formData.petIsHealthy}
            onChange={handleChange}
          />
          <label>La mascota está saludable</label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="hasProperNutrition"
            checked={formData.hasProperNutrition}
            onChange={handleChange}
          />
          <label>La mascota tiene una nutrición adecuada</label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="showsAffectionBond"
            checked={formData.showsAffectionBond}
            onChange={handleChange}
          />
          <label>Hay un vínculo afectivo adoptante-mascota</label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="otherPetsAreFriendly"
            checked={formData.otherPetsAreFriendly}
            onChange={handleChange}
          />
          <label>Otras mascotas conviven amigablemente</label>
        </div>

        <div>
          <label className="block text-sm font-medium">Comentarios adicionales</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancelar
          </Button>
          <Button type="submit">Guardar Seguimiento</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdoptionFollowUpModal;
