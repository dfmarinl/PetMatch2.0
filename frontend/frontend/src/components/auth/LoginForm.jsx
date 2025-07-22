import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import RecoverPasswordForm from './RecoverPasswordForm';
import { forgotPasswordRequest } from '../../api/auth'; // 👈 importa la función real

const LoginForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [recoverMode, setRecoverMode] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (recoverMode) {
    return (
      <div>
        <RecoverPasswordForm
          onSubmit={async ({ email }) => {
            // 🔗 Integración real con tu API
            await forgotPasswordRequest(email);
          }}
          onSuccess={() => setRecoverMode(false)}
        />
        <div className="text-sm text-center mt-4">
          <button
            type="button"
            className="text-primary-500 hover:text-primary-600"
            onClick={() => setRecoverMode(false)}
          >
            ← Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="tu@email.com"
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
          autoComplete="current-password"
        />
        <button
          type="button"
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-600">Recordarme</span>
        </label>
        <button
          type="button"
          className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
          onClick={() => setRecoverMode(true)}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <Button
        type="submit"
        className="w-full text-white bg-blue-600 hover:bg-blue-700"
        loading={loading}
      >
        Iniciar Sesión
      </Button>
    </form>
  );
};

export default LoginForm;


