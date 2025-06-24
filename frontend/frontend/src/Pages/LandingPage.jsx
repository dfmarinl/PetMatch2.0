import { Link } from 'react-router-dom';
import { Shield, Users, Award, ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    { icon: Shield, title: "Adopción Responsable", description: "Conectamos mascotas con familias perfectas a través de un proceso cuidadoso y estructurado." },
    { icon: Users, title: "Proceso Seguro", description: "Verificamos cada solicitud para garantizar el bienestar y la seguridad de nuestras mascotas." },
    { icon: Award, title: "Seguimiento Continuo", description: "Acompañamos a las familias después de la adopción para asegurar una transición exitosa." },
    { icon: Shield, title: "Compromiso de Calidad", description: "Trabajamos con refugios certificados y veterinarios especializados en bienestar animal." }
  ];

  const stats = [
    { number: "2,500+", label: "Mascotas Adoptadas" },
    { number: "1,800+", label: "Familias Felices" },
    { number: "95%", label: "Tasa de Éxito" },
    { number: "24/7", label: "Soporte Disponible" }
  ];

  return (
    <div className="min-h-screen scroll-smooth bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/img/pet5.jpg')" }}>
      <div className="min-h-screen bg-white/60">
        
        {/* NAVBAR */}
        <nav className="bg-white/80 shadow-sm sticky top-0 z-50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                  <img src="/dog.png" alt="Logo" className="w-6 h-6 object-contain" />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900/90">PetMatch</span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a href="#inicio" className="text-gray-900/80 hover:text-primary-500 px-3 py-2 text-sm font-medium">Inicio</a>
                  <a href="#mascotas" className="text-gray-600/80 hover:text-primary-500 px-3 py-2 text-sm font-medium">Mascotas</a>
                  <a href="#proceso" className="text-gray-600/80 hover:text-primary-500 px-3 py-2 text-sm font-medium">Proceso</a>
                  <a href="#contacto" className="text-gray-600/80 hover:text-primary-500 px-3 py-2 text-sm font-medium">Contacto</a>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login" className="text-gray-600/80 hover:text-primary-500 px-3 py-2 text-sm font-medium">Iniciar Sesión</Link>
                <Link to="/register" className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600/90">Registrarse</Link>
              </div>
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-primary-500 p-2">
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden bg-white/80 border-t backdrop-blur-sm">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#inicio" className="block px-3 py-2 text-gray-900 font-medium">Inicio</a>
                <a href="#mascotas" className="block px-3 py-2 text-gray-600 hover:text-primary-500">Mascotas</a>
                <a href="#proceso" className="block px-3 py-2 text-gray-600 hover:text-primary-500">Proceso</a>
                <a href="#contacto" className="block px-3 py-2 text-gray-600 hover:text-primary-500">Contacto</a>
                <div className="border-t pt-2 mt-2">
                  <Link to="/login" className="block px-3 py-2 text-gray-600 hover:text-primary-500">Iniciar Sesión</Link>
                  <Link to="/register" className="block px-3 py-2 text-primary-500 font-medium">Registrarse</Link>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* HERO */}
        <section id="inicio" className="py-20 px-4 text-center">
          <div className="max-w-7xl mx-auto bg-white/80 rounded-xl p-10 backdrop-blur-sm">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900/90 mb-6">
              Encuentra a tu <span className="text-primary-500 block">Compañero Perfecto</span>
            </h1>
            <p className="text-xl text-gray-700/80 mb-8 max-w-3xl mx-auto">
              Conectamos mascotas que necesitan un hogar con familias que buscan amor incondicional.
              Nuestro proceso de adopción responsable garantiza matches perfectos para toda la vida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-primary-500 text-black px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary-600/90 transition-all transform hover:-translate-y-1 hover:shadow-lg inline-flex items-center justify-center">
                Comenzar Adopción <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/pets" className="border border-primary-500 text-primary-500 px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary-50 transition-colors inline-flex items-center justify-center">
                Ver Mascotas
              </Link>
            </div>
          </div>
        </section>

        {/* MASCOTAS */}
        <section id="mascotas" className="py-16 px-4">
          <div className="max-w-7xl mx-auto bg-white/70 rounded-xl p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-bold text-primary-500/90 mb-2">{stat.number}</div>
                  <div className="text-gray-600/80 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESO */}
        <section id="proceso" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 bg-white/70 p-6 rounded-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900/90 mb-4">¿Por qué elegir PetMatch?</h2>
              <p className="text-xl text-gray-600/80 max-w-2xl mx-auto">Nuestro compromiso va más allá de la adopción. Creamos vínculos duraderos entre mascotas y familias.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, i) => (
                <div key={i} className="bg-white/70 p-6 rounded-xl shadow-sm hover:shadow-md">
                  <div className="w-12 h-12 bg-primary-100/80 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-500/80" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900/90 mb-2">{feature.title}</h3>
                  <p className="text-gray-600/80">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacto" className="py-20 bg-primary-500/90 text-center text-white/90 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para cambiar una vida?</h2>
            <p className="text-xl mb-8">Miles de mascotas están esperando encontrar su hogar para siempre. Comienza tu proceso de adopción hoy mismo.</p>
            <Link to="/register" className="bg-black text-primary-500 px-8 py-4 rounded-lg text-lg font-medium hover:bg-white inline-flex items-center">
              Adoptar Ahora <img src="/dog.png" alt="Icono" className="ml-2 w-5 h-5 object-contain" />
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-gray-900/90 text-white/90 py-12">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <img src="/dog.png" alt="Logo" className="w-4 h-4 object-contain" />
                </div>
                <span className="ml-2 text-lg font-bold">PetMatch</span>
              </div>
              <p className="text-gray-400">Conectando corazones, creando familias.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Enlaces</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#mascotas" className="hover:text-white">Mascotas</a></li>
                <li><a href="#proceso" className="hover:text-white">Proceso</a></li>
                <li><Link to="/login" className="hover:text-white">Iniciar Sesión</Link></li>
                <li><Link to="/register" className="hover:text-white">Registrarse</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white">Contacto</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Términos</a></li>
                <li><a href="#" className="hover:text-white">Privacidad</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-400 mt-8 border-t border-gray-800 pt-6">
            <p>&copy; 2025 PetMatch. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;


