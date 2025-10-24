import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaCalendarAlt, FaHistory, FaShoppingCart } from 'react-icons/fa';
import HeaderUsuario from './HeaderUsuario';
import HeroUsuario from './HeroUsuario';
import PageLayout from '../common/PageLayout';

const HomeUsuario = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    // Verificar autenticación
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
      return;
    }

    // Verificar rol
    if (userData.role === 'ADMIN') {
      navigate('/admin-home');
      return;
    }

    setUser(userData);

    // Recuperar carrito si existe
    const savedCart = localStorage.getItem('carritoTemporal');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [navigate]);

  if (!user) {
    return null; // O un componente de loading
  }

  return (
    <PageLayout>
      <HeaderUsuario />
      <main className="animate-fade-in">
        <HeroUsuario user={user} />

        {/* Carrito pendiente si existe */}
        {cart?.items?.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="card animate-slide-up relative">
              <div className="absolute top-4 right-4">
                <FaShoppingCart className="text-4xl text-[#d4af37]" />
              </div>
              <h2 className="section-title">
                Tienes un pedido pendiente
              </h2>
              <p className="text-[#bfbfbf] text-lg mb-6">
                Continúa con tu pedido anterior o empieza uno nuevo desde el menú.
              </p>
              <button
                onClick={() => navigate('/menu')}
                className="btn-primary group relative"
              >
                <span className="relative z-10">Continuar pedido</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 rounded-xl"></div>
              </button>
            </div>
          </div>
        )}

        {/* Menú de opciones */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card animate-scale-in group cursor-pointer" onClick={() => navigate('/menu')}>
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-[#d4af37]/10 rounded-lg group-hover:bg-[#d4af37]/20 transition-colors">
                  <FaUtensils className="text-2xl text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold text-[#ffffff]">Menú Digital</h3>
                  <p className="text-[#bfbfbf]">Explora nuestra carta interactiva</p>
                </div>
              </div>
            </div>

            <div className="card animate-scale-in group cursor-pointer" onClick={() => navigate('/reservas-usuario')}>
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-[#d4af37]/10 rounded-lg group-hover:bg-[#d4af37]/20 transition-colors">
                  <FaCalendarAlt className="text-2xl text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold text-[#ffffff]">Reservaciones</h3>
                  <p className="text-[#bfbfbf]">Agenda tu próxima visita</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default HomeUsuario;
