import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { resetPasswordRequest } from '../../api/auth'; // 👈 asegúrate de implementarlo

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!token) {
      setError('Token inválido o faltante');
      return;
    }

    try {
      setLoading(true);
      await resetPasswordRequest(token, password);
      setSuccess(true);

      // Redirigir después de unos segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-green-600">¡Contraseña actualizada!</h2>
        <p className="text-gray-700">Ahora puedes iniciar sesión con tu nueva contraseña.</p>
        <p className="text-sm text-gray-500 mt-2">
          Serás redirigido al inicio de sesión en unos segundos...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Nueva contraseña"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={Lock}
        placeholder="••••••••"
      />

      <Input
        label="Confirmar contraseña"
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        icon={Lock}
        placeholder="••••••••"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button
        type="submit"
        className="w-full text-white bg-blue-600 hover:bg-blue-700"
        loading={loading}
      >
        Restablecer contraseña
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
