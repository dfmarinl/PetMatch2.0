import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Mail } from 'lucide-react';

const RecoverPasswordForm = ({ onSubmit, onSuccess, message, error }) => {
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setLocalError('El email es requerido');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setLocalError('El email no es válido');
      return;
    }

    setLocalError('');
    await onSubmit({ email });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold text-center">Recuperar Contraseña</h2>

      <Input
        label="Correo electrónico"
        type="email"
        name="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setLocalError('');
        }}
        placeholder="tu@email.com"
        icon={Mail}
        error={localError}
        autoComplete="email"
      />

      {message && <p className="text-green-600 text-sm text-center">{message}</p>}
      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

      <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
        Enviar enlace
      </Button>
    </form>
  );
};

export default RecoverPasswordForm;


