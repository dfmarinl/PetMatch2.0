import { useState, useEffect } from 'react';

// Datos de ejemplo mejorados
const initialPets = [
  {
    id: '1',
    name: 'Luna',
    type: 'Perro',
    breed: 'Golden Retriever',
    age: '2 años',
    gender: 'Hembra',
    size: 'Grande',
    weight: 25,
    color: 'Dorado',
    description: 'Luna es una perra muy cariñosa y juguetona. Le encanta estar con niños y es muy obediente.',
    healthStatus: 'Excelente',
    vaccinated: true,
    sterilized: true,
    specialNeeds: 'Ninguna',
    status: 'Disponible',
    image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
    dateAdded: '2024-01-15',
    dateUpdated: '2024-01-15',
    location: 'Caracas, Venezuela',
    contactInfo: {
      shelter: 'Refugio Esperanza',
      phone: '+58 412 123 4567',
      email: 'contacto@refugioesperanza.org'
    }
  },
  {
    id: '2',
    name: 'Milo',
    type: 'Gato',
    breed: 'Siamés',
    age: '1 año',
    gender: 'Macho',
    size: 'Mediano',
    weight: 4,
    color: 'Crema y marrón',
    description: 'Milo es un gato muy independiente pero cariñoso. Perfecto para apartamentos.',
    healthStatus: 'Buena',
    vaccinated: true,
    sterilized: false,
    specialNeeds: 'Dieta especial',
    status: 'En proceso',
    image: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=400',
    dateAdded: '2024-01-14',
    dateUpdated: '2024-01-16',
    location: 'Valencia, Venezuela',
    contactInfo: {
      shelter: 'Casa Felina',
      phone: '+58 414 987 6543',
      email: 'info@casafelina.org'
    }
  },
  {
    id: '3',
    name: 'Max',
    type: 'Perro',
    breed: 'Labrador',
    age: '3 años',
    gender: 'Macho',
    size: 'Grande',
    weight: 30,
    color: 'Negro',
    description: 'Max es un perro muy activo y leal. Ideal para familias que disfruten del ejercicio.',
    healthStatus: 'Excelente',
    vaccinated: true,
    sterilized: true,
    specialNeeds: 'Ejercicio diario',
    status: 'Adoptado',
    image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
    dateAdded: '2024-01-13',
    dateUpdated: '2024-01-17',
    location: 'Maracaibo, Venezuela',
    contactInfo: {
      shelter: 'Refugio Amistad',
      phone: '+58 416 555 1234',
      email: 'adopciones@refugioamistad.org'
    }
  }
];

export const usePets = () => {
  const [pets, setPets] = useState(initialPets);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || pet.status === filterStatus;
    const matchesType = filterType === 'all' || pet.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const createPet = async (petData) => {
    setLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPet = {
        id: Date.now().toString(),
        ...petData,
        dateAdded: new Date().toISOString().split('T')[0],
        dateUpdated: new Date().toISOString().split('T')[0],
      };
      
      setPets(prev => [...prev, newPet]);
      return newPet;
    } finally {
      setLoading(false);
    }
  };

  const updatePet = async (id, petData) => {
    setLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedPet = {
        ...pets.find(p => p.id === id),
        ...petData,
        dateUpdated: new Date().toISOString().split('T')[0],
      };
      
      setPets(prev => prev.map(p => p.id === id ? updatedPet : p));
      return updatedPet;
    } finally {
      setLoading(false);
    }
  };

  const deletePet = async (id) => {
    setLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPets(prev => prev.filter(p => p.id !== id));
    } finally {
      setLoading(false);
    }
  };

  const getPetById = (id) => {
    return pets.find(p => p.id === id);
  };

  return {
    pets: filteredPets,
    allPets: pets,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    createPet,
    updatePet,
    deletePet,
    getPetById
  };
};