import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';
import Button from '../components/ui/Button';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    setLoading(true);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Login data:', formData);
      
      // Aquí harías la llamada real a tu API
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Simular respuesta exitosa
      const userData = {
        id: 1,
        name: 'Usuario Demo',
        email: formData.email
      };
      
      login(userData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Iniciar Sesión"
      subtitle="Encuentra a tu compañero perfecto"
    >
      <LoginForm onSubmit={handleLogin} loading={loading} />
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">¿No tienes cuenta?</span>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full  text-white bg-blue-600 hover:bg-blue-700"
            
            onClick={() => navigate('/register')}
          >
            Crear una cuenta nueva
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

export default Login;