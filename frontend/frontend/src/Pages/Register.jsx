import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import AuthLayout from "../components/auth/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";
import Button from "../components/ui/Button";
import { registerRequest } from "../api/auth"; // 👈 importa la función real

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    setLoading(true);
    try {
      const response = await registerRequest(formData); // llamada real
      login(response.user); // guarda usuario en contexto
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al registrar:", error);
      alert(error.message);
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
            <span className="px-2 bg-[#f8f9fa] text-gray-500">
              ¿Ya tienes cuenta?
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/login")}
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
