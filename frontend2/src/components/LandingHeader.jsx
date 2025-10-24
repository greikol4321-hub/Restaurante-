import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUtensils, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

const LandingHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || 'null');
  const isLoggedIn = !!user && !!user.email;

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    window.dispatchEvent(new Event('userLogin'));
    navigate('/login');
  };

  return (
    <nav className="relative bg-secondary/90 backdrop-blur-md border-b border-accent/10 animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          {/* Botón menú móvil */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-accent hover:bg-accent/10 transition-colors"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              {!mobileOpen ? (
                <FaBars className="h-6 w-6" />
              ) : (
                <FaTimes className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Logo y navegación desktop */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            {/* Logo */}
            <div className="flex flex-shrink-0 items-center">
              <Link
                to="/"
                className="flex items-center hover:opacity-90 transition-opacity"
              >
                <img 
                  src="/images/logo-horizontal.svg" 
                  alt="Menu Restaurante" 
                  className="h-12 w-auto"
                />
              </Link>
            </div>

            {/* Links de navegación (hidden en móvil) */}
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8 items-center">
              <Link
                to="/menu"
                className="px-5 py-2.5 rounded-full bg-accent/10 hover:bg-accent hover:text-primary-dark text-accent font-semibold transition-all duration-300 flex items-center gap-2 text-base border border-accent/30 hover:border-accent hover:scale-105"
              >
                <FaUtensils className="text-lg" />
                <span>Menú Digital</span>
              </Link>
            </div>
          </div>

          {/* Botón dinámico derecha */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="btn-accent flex items-center space-x-2 text-base px-6 py-2.5"
              >
                <FaSignOutAlt className="text-lg" />
                <span>Cerrar sesión</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="btn-accent flex items-center space-x-2 text-base px-6 py-2.5"
              >
                <FaSignInAlt className="text-lg" />
                <span>Ingresar</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-[#c5a028]/30" id="mobile-menu">
          <div className="space-y-1 px-4 pb-3 pt-2 bg-[#000000]/95">
            <Link
              to="/menu"
              className="block rounded-lg px-3 py-2 text-base font-medium text-[#bfbfbf] hover:bg-[#d4af37]/10 hover:text-[#d4af37]"
              onClick={() => setMobileOpen(false)}
            >
              Menú Digital
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingHeader;
