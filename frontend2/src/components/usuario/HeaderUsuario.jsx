import { useLocation } from 'react-router-dom';
import UnifiedHeader from '../common/UnifiedHeader';

const HeaderUsuario = () => {
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/home-usuario', active: location.pathname === '/home-usuario' },
    { label: 'Menú Digital', path: '/menu', active: location.pathname === '/menu' },
    { label: 'Reservas', path: '/reservas-usuario', active: location.pathname === '/reservas-usuario' },
    { label: 'Pedidos', path: '/pedidos-usuario', active: location.pathname === '/pedidos-usuario' },
  ];

  return <UnifiedHeader menuItems={menuItems} />;
};

export default HeaderUsuario;
