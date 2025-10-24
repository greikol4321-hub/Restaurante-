import { useLocation } from 'react-router-dom';
import UnifiedHeader from '../common/UnifiedHeader';

const HeaderCajero = () => {
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/cajero', active: location.pathname === '/cajero' },
    { label: 'Pedidos', path: '/cajero/pedidos', active: location.pathname === '/cajero/pedidos' },
  ];

  return <UnifiedHeader menuItems={menuItems} />;
};

export default HeaderCajero;
