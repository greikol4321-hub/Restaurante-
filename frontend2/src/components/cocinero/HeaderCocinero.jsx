import { useLocation } from 'react-router-dom';
import UnifiedHeader from '../common/UnifiedHeader';

const HeaderCocinero = () => {
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/home-cocinero', active: location.pathname === '/home-cocinero' },
    { label: 'Órdenes', path: '/ordenes-cocina', active: location.pathname === '/ordenes-cocina' },
  ];

  return <UnifiedHeader menuItems={menuItems} />;
};

export default HeaderCocinero;
