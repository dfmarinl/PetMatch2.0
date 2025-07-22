import ResetPasswordForm from "../components/auth/ResetPasswordForm";
import AuthLayout from "../components/auth/AuthLayout";

const ResetPasswordPage = () => {
  return (
    <AuthLayout
      title="Restablecer Contraseña"
      subtitle="Ingresa tu nueva contraseña para continuar"
    >
      <ResetPasswordForm />

      <p className="mt-6 text-center text-sm text-gray-500">
        ¿Recuerdas tu contraseña?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Inicia sesión
        </a>
      </p>
    </AuthLayout>
  );
};

export default ResetPasswordPage;

