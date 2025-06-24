import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";
import Button from "../components/ui/Button";
import { loginRequest } from "../api/auth"; // <-- importa la función

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    setLoading(true);
    try {
      const { user } = await loginRequest(formData.email, formData.password);

      // Guardar usuario en contexto o estado global
      login(user);

      // Redirigir según el rol
      switch (user.rol) {
        case "cliente":
          navigate("/dashboard");
          break;
        case "empleado":
          navigate("/admin");
          break;
        case "administrador":
          navigate("/admin");
          break;
        default:
          navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Error al iniciar sesión");
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
            <span className="px-2 bg-[#f8f9fa] text-gray-500">
              ¿No tienes cuenta?
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/register")}
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
