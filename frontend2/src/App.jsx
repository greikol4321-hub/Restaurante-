import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ToastProvider } from './components/common/ToastContainer';
import LandingHeader from './components/LandingHeader';
import Home from './components/Home';
import HomeUsuario from './components/usuario/HomeUsuario';
import PedidosUsuario from './components/usuario/PedidosUsuario';
import ReservaUsuario from './components/usuario/ReservaUsuario';
import Login from './components/auth/Login';
import SignIn from './components/auth/SignIn';
import AdminHome from './components/admin/AdminHome';
import ToolsAdmin from './components/admin/ToolsAdmin';
import GestionPedidos from './components/admin/GestionPedidos';
import GestionReservas from './components/admin/GestionReservas';
import ProductAdmin from './components/admin/ProductAdmin';
import UsersAdmin from './components/admin/UsersAdmin';
import MenuDigital from './components/menu/MenuDigital';
import HomeCajero from './components/cajero/HomeCajero';
import PedidosCajero from './components/cajero/PedidosCajero';
import OrdenesCocina from './components/cocinero/OrdenesCocina';
import HomeCocinero from './components/cocinero/HomeCocinero';
import HomeMesero from './components/mesero/HomeMesero';
import OrdenesMesero from './components/mesero/OrdenesMesero';
import ModalCrearOrden from './components/mesero/ModalCrearOrden';
import ModalEditarOrdenCompleta from './components/mesero/ModalEditarOrdenCompleta';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
        {/* Rutas públicas */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-[#000000] text-[#ffffff]">
              <LandingHeader />
              <Home />
            </div>
          }
        />

        {/* Rutas de usuario */}
        <Route path="/home-usuario" element={<HomeUsuario />} />
        <Route path="/pedidos-usuario" element={<PedidosUsuario />} />
        <Route path="/reservas-usuario" element={<ReservaUsuario />} />

        {/* Rutas de autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/registro" element={<SignIn />} />

        {/* Rutas de administrador */}
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/tools" element={<ToolsAdmin />} />
        <Route path="/admin/pedidos" element={<GestionPedidos />} />
        <Route path="/admin/reservas" element={<GestionReservas />} />
        <Route path="/admin/productos" element={<ProductAdmin />} />
        <Route path="/admin/usuarios" element={<UsersAdmin />} />

        {/* Rutas de menú digital */}
        <Route
          path="/menu"
          element={
            <div className="min-h-screen bg-[#000000] text-[#ffffff]">
              <MenuDigital />
            </div>
          }
        />

        {/* Rutas de cajero */}
        <Route path="/cajero" element={<HomeCajero />} />
        <Route path="/cajero/pedidos" element={<PedidosCajero />} />

        {/* Rutas de cocina (Cocinero) */}
        <Route path="/cocinero" element={<HomeCocinero />} />
        <Route path="/home-cocinero" element={<HomeCocinero />} />
        <Route path="/ordenes-cocina" element={<OrdenesCocina />} />

        {/* Rutas de mesero */}
        <Route path="/mesero" element={<HomeMesero />} />
        <Route path="/home-mesero" element={<HomeMesero />} />
        <Route path="/mesero/ordenes" element={<OrdenesMesero />} />
        <Route path="/mesero/crear-orden" element={<ModalCrearOrden />} />
        <Route path="/mesero/editar-orden" element={<ModalEditarOrdenCompleta />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
