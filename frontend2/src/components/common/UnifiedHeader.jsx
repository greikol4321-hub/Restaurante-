import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';

const UnifiedHeader = ({ menuItems = [] }) => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [rolUsuario, setRolUsuario] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    setNombreUsuario(user?.nombre || 'Usuario');
    setRolUsuario(user?.rol || 'CLIENTE');
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.dispatchEvent(new Event('userLogin'));
    navigate('/');
  };

  return (
    <header className="bg-[#000000]/90 backdrop-blur border-b border-[#c5a028]/30 shadow-2xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo y usuario */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
              <img 
                src="/images/logo-horizontal.svg" 
                alt="Menu Restaurante" 
                className="h-10 w-auto"
              />
            </Link>
            <span className="hidden lg:block text-[#bfbfbf] text-sm border-l border-[#c5a028]/30 pl-4">
              ¡Bienvenido, {nombreUsuario.toUpperCase()}!
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`${
                  item.active 
                    ? 'text-[#d4af37] font-medium' 
                    : 'text-[#bfbfbf]'
                } hover:text-[#d4af37] px-4 py-2 text-base transition-colors duration-200`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="text-[#bfbfbf] hover:text-[#d4af37] px-4 py-2 text-base flex items-center space-x-2 transition-colors duration-200 ml-2"
            >
              <FaSignOutAlt className="text-lg" />
              <span>Salir</span>
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-[#d4af37] hover:text-[#c5a028] p-2 transition-colors duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden py-4 bg-[#0b0b0b] rounded-lg mt-2 border border-[#c5a028]/20">
            <div className="flex flex-col space-y-2">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`${
                    item.active 
                      ? 'text-[#d4af37] font-medium' 
                      : 'text-[#bfbfbf]'
                  } hover:text-[#d4af37] hover:bg-[#d4af37]/10 px-3 py-2 rounded-lg transition-colors duration-200`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-[#bfbfbf] hover:text-[#d4af37] hover:bg-[#d4af37]/10 px-3 py-2 flex items-center space-x-1 rounded-lg transition-colors duration-200"
              >
                <FaSignOutAlt />
                <span>Salir</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default UnifiedHeader;
