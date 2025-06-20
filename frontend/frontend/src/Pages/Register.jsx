import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import AuthLayout from '../components/auth/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';
import Button from '../components/ui/Button';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    setLoading(true);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Register data:', formData);
      
      // Aquí harías la llamada real a tu API
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Simular respuesta exitosa
      const userData = {
        id: 1,
        name: formData.name,
        email: formData.email
      };
      
      login(userData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Crear Cuenta"
      subtitle="Únete a nuestra comunidad de amantes de las mascotas"
    >
      <RegisterForm onSubmit={handleRegister} loading={loading} />
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">¿Ya tienes cuenta?</span>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/login')}
          >
            Iniciar sesión
          </Button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link 
          to="/" 
          className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
        >
          ← Volver al inicio
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Register;