import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, MapPin, Home, IdCard } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const RegisterForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    identificationNumber: '',
    age: '',
    city: '',
    direction: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es requerido';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es requerido';
    if (!formData.identificationNumber.trim()) newErrors.identificationNumber = 'La identificación es requerida';

    if (!formData.age || isNaN(formData.age)) {
      newErrors.age = 'La edad es requerida y debe ser un número';
    } else if (parseInt(formData.age, 10) < 18) {
      newErrors.age = 'Debes tener al menos 18 años para registrarte';
    }

    if (!formData.city.trim()) newErrors.city = 'La ciudad es requerida';
    if (!formData.direction.trim()) newErrors.direction = 'La dirección es requerida';

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Debe tener al menos 8 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { confirmPassword, ...rest } = formData;
      const dataToSend = {
        ...rest,
        rol: 'cliente', // valor por defecto
      };
      onSubmit(dataToSend);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Nombre"
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="Juan"
        icon={User}
        error={errors.firstName}
        autoComplete="given-name"
      />

      <Input
        label="Apellido"
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Pérez"
        icon={User}
        error={errors.lastName}
        autoComplete="family-name"
      />

      <Input
        label="Número de identificación"
        type="text"
        name="identificationNumber"
        value={formData.identificationNumber}
        onChange={handleChange}
        placeholder="123456789"
        icon={IdCard}
        error={errors.identificationNumber}
      />

      <Input
        label="Edad"
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
        placeholder="30"
        error={errors.age}
      />

      <Input
        label="Ciudad"
        type="text"
        name="city"
        value={formData.city}
        onChange={handleChange}
        placeholder="Bogotá"
        icon={MapPin}
        error={errors.city}
        autoComplete="address-level2"
      />

      <Input
        label="Dirección"
        type="text"
        name="direction"
        value={formData.direction}
        onChange={handleChange}
        placeholder="Cra 12 #45-67"
        icon={Home}
        error={errors.direction}
        autoComplete="street-address"
      />

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="correo@ejemplo.com"
        icon={Mail}
        error={errors.email}
        autoComplete="email"
      />

      <div className="relative">
        <Input
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          icon={Lock}
          error={errors.password}
          autoComplete="new-password"
        />
        <button
          type="button"
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div className="relative">
        <Input
          label="Confirmar contraseña"
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          icon={Lock}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />
        <button
          type="button"
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          required
          className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded mt-1"
        />
        <span className="ml-2 text-sm text-gray-600">
          Acepto los{' '}
          <button type="button" className="text-primary-500 hover:text-primary-600 underline">
            términos y condiciones
          </button>{' '}
          y la{' '}
          <button type="button" className="text-primary-500 hover:text-primary-600 underline">
            política de privacidad
          </button>
        </span>
      </div>

      <Button
        type="submit"
        className="w-full text-white bg-blue-600 hover:bg-blue-700"
        loading={loading}
      >
        Crear Cuenta
      </Button>
    </form>
  );
};

export default RegisterForm;

