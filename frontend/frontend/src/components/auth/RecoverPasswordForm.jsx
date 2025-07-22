import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const RecoverPasswordForm = ({ onSubmit, onSuccess, loading = false }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        onSuccess?.(); // 👈 Llama a onSuccess después de 5 segundos
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [submitted, onSuccess]);

  const validateEmail = () => {
    if (!email) {
      setError('El email es requerido');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('El email no es válido');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateEmail()) {
      try {
        await onSubmit({ email });
        setSubmitted(true);
      } catch (err) {
        setError('Error al enviar el enlace. Intenta nuevamente.');
      }
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-green-600">¡Listo!</h2>
        <p className="text-gray-700">
          Si tu correo está registrado, recibirás un enlace para recuperar tu contraseña.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Serás redirigido automáticamente al inicio de sesión en unos segundos...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Email"
        type="email"
        name="email"
        value={email}
        onChange={handleChange}
        placeholder="tu@email.com"
        icon={Mail}
        error={error}
        autoComplete="email"
      />

      <Button
        type="submit"
        className="w-full text-white bg-blue-600 hover:bg-blue-700"
        loading={loading}
      >
        Enviar enlace
      </Button>
    </form>
  );
};

export default RecoverPasswordForm;

