import { useLocation } from 'react-router-dom';
import UnifiedHeader from '../common/UnifiedHeader';

const HeaderMesero = () => {
  const location = useLocation();

  const menuItems = [
    { label: 'Inicio', path: '/home-mesero', active: location.pathname === '/home-mesero' },
    { label: 'Órdenes', path: '/mesero/ordenes', active: location.pathname === '/mesero/ordenes' },
  ];

  return <UnifiedHeader menuItems={menuItems} />;
};

export default HeaderMesero;
