import { Heart, Dog } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/img/fondo.png')" }} // asegúrate que fondo.png esté en /public/img/
    >
      <div className="min-h-screen bg-white/70 backdrop-blur-sm flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full shadow-lg">
                <Dog className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <Heart className="w-3 h-3 text-white fill-current" />
              </div>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900/90">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600/80">
            {subtitle}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/80 backdrop-blur-md py-8 px-4 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
