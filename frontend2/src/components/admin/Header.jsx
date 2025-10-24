import { useLocation } from 'react-router-dom';
import UnifiedHeader from '../common/UnifiedHeader';

const Header = () => {
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/admin', active: location.pathname === '/admin' },
    { label: 'Productos', path: '/admin/productos', active: location.pathname === '/admin/productos' },
    { label: 'Usuarios', path: '/admin/usuarios', active: location.pathname === '/admin/usuarios' },
    { label: 'Pedidos', path: '/admin/pedidos', active: location.pathname === '/admin/pedidos' },
    { label: 'Reservas', path: '/admin/reservas', active: location.pathname === '/admin/reservas' },
  ];

  return <UnifiedHeader menuItems={menuItems} />;
};

export default Header;
