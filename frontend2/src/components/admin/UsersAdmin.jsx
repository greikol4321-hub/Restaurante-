import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaCheck, FaTimes, FaExclamationCircle, FaCheckCircle, FaExclamationTriangle, FaUserEdit, FaUserPlus, FaEnvelope } from 'react-icons/fa';
import Header from './Header';
import { usuarioApi } from '../../utils/api';
import { useToast } from '../common/ToastContainer';
import PageLayout from '../common/PageLayout';

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'CLIENTE',
    activo: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        password: '', // No mostrar contraseña existente
        rol: user.rol || 'CLIENTE',
        activo: user.activo ?? true,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = { ...form };
      if (user && !formData.password) {
        delete formData.password; // No enviar password si está vacío en edición
      }
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="group">
          <label htmlFor="nombre" className="block text-xs font-bold text-[#d4af37] mb-2 
                                           group-focus-within:text-[#f4d47b] transition-colors">
             Nombre
          </label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-[#0b0b0b] border-2 border-[#c5a028]/30 rounded-xl 
                     text-[#ffffff] placeholder-[#666666] focus:outline-none focus:border-[#d4af37] 
                     focus:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300
                     shadow-inner text-sm"
          />
        </div>

        <div className="group">
          <label htmlFor="apellido" className="block text-xs font-bold text-[#d4af37] mb-2
                                             group-focus-within:text-[#f4d47b] transition-colors">
             Apellido
          </label>
          <input
            id="apellido"
            type="text"
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-[#0b0b0b] border-2 border-[#c5a028]/30 rounded-xl 
                     text-[#ffffff] placeholder-[#666666] focus:outline-none focus:border-[#d4af37] 
                     focus:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300
                     shadow-inner text-sm"
          />
        </div>
      </div>

      <div className="group">
        <label htmlFor="email" className="block text-xs font-bold text-[#d4af37] mb-2
                                         group-focus-within:text-[#f4d47b] transition-colors">
           Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 bg-[#0b0b0b] border-2 border-[#c5a028]/30 rounded-xl 
                   text-[#ffffff] placeholder-[#666666] focus:outline-none focus:border-[#d4af37] 
                   focus:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300
                   shadow-inner text-sm"
        />
      </div>

      <div className="group">
        <label htmlFor="password" className="block text-xs font-bold text-[#d4af37] mb-2
                                           group-focus-within:text-[#f4d47b] transition-colors">
           {user ? 'Nueva Contraseña (dejar vacío para mantener)' : 'Contraseña'}
        </label>
        <input
          id="password"
          type="password"
          name="password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          required={!user}
          className="w-full px-4 py-2.5 bg-[#0b0b0b] border-2 border-[#c5a028]/30 rounded-xl 
                   text-[#ffffff] placeholder-[#666666] focus:outline-none focus:border-[#d4af37] 
                   focus:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300
                   shadow-inner text-sm"
        />
      </div>

      <div className="group">
        <label htmlFor="rol" className="block text-xs font-bold text-[#d4af37] mb-2
                                       group-focus-within:text-[#f4d47b] transition-colors">
           Rol del Usuario
        </label>
        <select
          id="rol"
          name="rol"
          value={form.rol}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 bg-[#0b0b0b] border-2 border-[#c5a028]/30 rounded-xl 
                   text-[#ffffff] focus:outline-none focus:border-[#d4af37] 
                   focus:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300
                   shadow-inner cursor-pointer text-sm"
        >
          <option value="CLIENTE">Cliente</option>
          <option value="MESERO">Mesero</option>
          <option value="COCINERO">Cocinero</option>
          <option value="CAJERO">Cajero</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>

      <div className="flex items-center gap-3 p-3 bg-[#0b0b0b] border-2 border-[#c5a028]/30 
                    rounded-xl hover:border-[#d4af37]/50 transition-all duration-300">
        <input
          id="activo"
          type="checkbox"
          name="activo"
          checked={form.activo}
          onChange={handleChange}
          className="w-4 h-4 accent-[#d4af37] cursor-pointer"
        />
        <label htmlFor="activo" className="text-sm text-[#ffffff] font-semibold cursor-pointer flex-1">
           Usuario activo
        </label>
        <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
          form.activo 
            ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
            : 'bg-red-500/20 text-red-400 border border-red-500/50'
        }`}>
          {form.activo ? 'ACTIVO' : 'INACTIVO'}
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t-2 border-[#c5a028]/20">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-[#1a1a1a] border-2 border-[#c5a028]/30 text-[#ffffff] 
                   rounded-xl hover:border-[#d4af37] hover:scale-[1.02] transition-all duration-300
                   font-bold text-base shadow-lg"
        >
           Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#c5a028] text-[#000000] 
                   font-black text-base rounded-xl hover:scale-[1.02] transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                   shadow-[0_8px_24px_rgba(212,175,55,0.4)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.6)]"
        >
          {loading ? ' Guardando...' : user ? ' Actualizar' : ' Crear Usuario'}
        </button>
      </div>
    </form>
  );
};

const EditModal = ({ isOpen, user, onSubmit, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0b0b0b] border-2 border-[#d4af37]/30 
                    p-6 rounded-2xl max-w-2xl w-full my-8 shadow-[0_8px_32px_rgba(212,175,55,0.2)]
                    animate-[slideUp_0.3s_ease-out]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#c5a028] 
                        flex items-center justify-center shadow-lg">
            <FaUserEdit className="text-lg text-[#000000]" />
          </div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-[#d4af37] to-[#f4d47b] 
                       bg-clip-text text-transparent">
            Editar Usuario
          </h2>
        </div>
        <UserForm
          user={user}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};

EditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  user: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center 
                  animate-[fadeIn_0.2s_ease-out]">
      <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0b0b0b] 
                    border-2 border-red-500/30 rounded-3xl p-8 max-w-md w-full mx-4 
                    shadow-[0_20px_60px_rgba(239,68,68,0.3)]
                    animate-[slideUp_0.3s_ease-out]">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br 
                      from-red-500 to-red-600 rounded-2xl flex items-center justify-center 
                      shadow-[0_8px_24px_rgba(239,68,68,0.4)]">
          <FaExclamationTriangle className="text-2xl text-white" />
        </div>
        <h3 className="text-2xl font-black text-red-400 mb-3 mt-4 text-center">{title}</h3>
        <p className="text-[#bfbfbf] mb-8 text-center leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-[#1a1a1a] border-2 border-[#c5a028]/30 text-[#ffffff] 
                     rounded-2xl hover:border-[#d4af37] hover:scale-105 transition-all duration-300
                     font-semibold shadow-lg"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-[#ffffff] 
                     rounded-2xl hover:scale-105 transition-all duration-300 font-bold
                     shadow-[0_4px_20px_rgba(239,68,68,0.4)] hover:shadow-[0_6px_30px_rgba(239,68,68,0.6)]"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

const UsersAdmin = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, user: null });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usuarioApi.obtenerUsuarios();
      setUsers(response.data);
    } catch (err) {
      showError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUpdate = async (formData) => {
    try {
      if (editingUser) {
        showInfo('Actualizando usuario...');
        await usuarioApi.actualizarUsuario(editingUser.id, formData);
        showSuccess(`Usuario ${formData.nombre} ${formData.apellido} actualizado exitosamente`);
      } else {
        showInfo('Creando usuario...');
        await usuarioApi.crearUsuario(formData);
        showSuccess(`Usuario ${formData.nombre} ${formData.apellido} creado exitosamente`);
      }
      
      fetchUsers();
      setShowForm(false);
      setShowEditModal(false);
      setEditingUser(null);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error al guardar el usuario';
      showError(errorMessage);
    }
  };

  const handleDelete = async (user) => {
    try {
      // Obtener el ID del usuario actual desde sessionStorage
      const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
      
      // Validar que no se intente eliminar al usuario actual
      if (user.id === currentUser.id) {
        showWarning('No puedes eliminar tu propia cuenta');
        setConfirmDelete({ show: false, user: null });
        return;
      }

      // Validar que no se intente eliminar al último administrador
      if (user.rol === 'ADMIN') {
        const response = await usuarioApi.obtenerUsuarios();
        const adminUsers = response.data.filter(u => u.rol === 'ADMIN');
        if (adminUsers.length <= 1) {
          showWarning('No se puede eliminar al último administrador del sistema');
          setConfirmDelete({ show: false, user: null });
          return;
        }
      }

      showInfo('Eliminando usuario...');
      await usuarioApi.eliminarUsuario(user.id);
      showSuccess(`Usuario ${user.nombre} ${user.apellido} eliminado exitosamente`);
      setConfirmDelete({ show: false, user: null });
      fetchUsers();
    } catch (err) {
      // Manejar diferentes tipos de errores
      let errorMessage = 'Error al eliminar el usuario';
      
      if (err.response?.status === 500) {
        // Error del servidor
        if (err.response?.data?.message?.includes('foreign key')) {
          errorMessage = 'No se puede eliminar el usuario porque tiene registros asociados (pedidos, reservas, etc.)';
        } else {
          errorMessage = 'Error interno del servidor al eliminar el usuario';
        }
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      showError(errorMessage);
      setConfirmDelete({ show: false, user: null });
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      await usuarioApi.actualizarUsuario(user.id, {
        ...user,
        activo: !user.activo,
      });
      showSuccess(`Usuario ${user.activo ? 'desactivado' : 'activado'} exitosamente`);
      fetchUsers();
    } catch (err) {
      showError('Error al cambiar el estado del usuario');
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchRegex = new RegExp(searchTerm, 'i');
    return (
      searchRegex.test(user.nombre) ||
      searchRegex.test(user.apellido) ||
      searchRegex.test(user.email)
    );
  });

  return (
    <PageLayout>
      <Header />

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto animate-slideInUp">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-title text-[#d4af37]">Gestión de Usuarios</h1>
            <button
              onClick={() => {
                setEditingUser(null);
                setShowForm(true);
              }}
              className="bg-[#d4af37] text-[#000000] px-6 py-3 rounded-full font-semibold
                       hover:scale-105 transition-transform flex items-center gap-2"
            >
              <FaPlus />
              <span>Nuevo Usuario</span>
            </button>
          </div>

          <div className="mb-8">
            <div className="relative group">
              <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#d4af37] 
                                 group-focus-within:scale-110 transition-transform duration-300" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, apellido o email..."
                className="pl-14 pr-6 py-4 w-full rounded-2xl bg-gradient-to-r from-[#1a1a1a] to-[#0b0b0b] 
                         border-2 border-[#c5a028]/30 text-[#ffffff] placeholder-[#888888] 
                         focus:outline-none focus:border-[#d4af37] focus:shadow-[0_0_30px_rgba(212,175,55,0.2)]
                         transition-all duration-300 text-lg shadow-lg"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#d4af37]/0 to-[#c5a028]/0 
                            group-focus-within:from-[#d4af37]/5 group-focus-within:to-[#c5a028]/5 
                            transition-all duration-300 pointer-events-none" />
            </div>
          </div>

          {showForm && (
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0b0b0b] border-2 border-[#d4af37]/30 
                          p-8 rounded-3xl mb-8 shadow-[0_8px_32px_rgba(212,175,55,0.2)]
                          animate-[slideUp_0.3s_ease-out]">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#c5a028] 
                              flex items-center justify-center shadow-lg">
                  <FaUserPlus className="text-2xl text-[#000000]" />
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-[#d4af37] to-[#f4d47b] 
                             bg-clip-text text-transparent">
                  {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h2>
              </div>
              <UserForm
                user={editingUser}
                onSubmit={handleCreateUpdate}
                onCancel={() => {
                  setShowForm(false);
                  setEditingUser(null);
                }}
              />
            </div>
          )}

          {loading ? (
            <div className="text-center py-20">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-[#d4af37]/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#d4af37] border-t-transparent 
                              rounded-full animate-spin"></div>
              </div>
              <p className="text-[#bfbfbf] text-lg">Cargando usuarios...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredUsers.map((user) => (
                <div key={user.id} className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0b0b0b] 
                                             border-2 border-[#c5a028]/20 hover:border-[#d4af37]/60 
                                             rounded-3xl p-6 transition-all duration-500
                                             shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                                             hover:shadow-[0_12px_48px_rgba(212,175,55,0.3)]
                                             hover:scale-[1.01] overflow-hidden">
                  
                  {/* Glow effect */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#d4af37]/5 rounded-full 
                                blur-3xl group-hover:bg-[#d4af37]/15 transition-all duration-500"></div>
                  
                  <div className="relative z-10 flex justify-between items-start gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#c5a028] 
                                        flex items-center justify-center shadow-xl group-hover:scale-110
                                        transition-transform duration-300">
                            <span className="text-[#000000] font-black text-2xl">
                              {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                            </span>
                          </div>
                          {/* Badge de estado */}
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-[#0b0b0b]
                                         flex items-center justify-center ${user.activo ? 'bg-green-500' : 'bg-red-500'}`}>
                            {user.activo ? (
                              <FaCheck className="w-3 h-3 text-white" />
                            ) : (
                              <FaTimes className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-black text-[#ffffff] group-hover:text-[#d4af37] 
                                       transition-colors duration-300">
                            {user.nombre} {user.apellido}
                          </h3>
                          <div className="flex items-center gap-3 mt-2">
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border-2
                                           ${user.activo 
                                             ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                                             : 'bg-red-500/20 border-red-500/50 text-red-400'}`}>
                              <div className={`w-2 h-2 rounded-full ${user.activo ? 'bg-green-400' : 'bg-red-400'} 
                                            animate-pulse`}></div>
                              <span className="text-xs font-bold uppercase">{user.activo ? 'Activo' : 'Inactivo'}</span>
                            </div>
                            <span className="px-4 py-1 bg-[#d4af37]/20 border-2 border-[#d4af37]/50 
                                         rounded-full text-[#d4af37] text-xs font-black uppercase
                                         shadow-lg">
                              {user.rol}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#0b0b0b]/50 border-2 border-[#c5a028]/20 rounded-2xl p-4">
                        <div className="flex items-center gap-2 text-[#888888]">
                          <FaEnvelope className="text-[#d4af37] text-lg" />
                          <span className="text-[#ffffff] font-semibold">{user.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Botones de acción */}
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => toggleUserStatus(user)}
                        className={`p-4 rounded-2xl transition-all duration-300 hover:scale-110 
                                  shadow-lg hover:shadow-xl border-2 ${
                          user.activo
                            ? 'bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/50 text-red-400 hover:from-red-500 hover:to-red-600 hover:text-white hover:border-red-500'
                            : 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/50 text-green-400 hover:from-green-500 hover:to-green-600 hover:text-white hover:border-green-500'
                        }`}
                        title={user.activo ? 'Desactivar usuario' : 'Activar usuario'}
                      >
                        {user.activo ? <FaTimes className="w-5 h-5" /> : <FaCheck className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setShowEditModal(true);
                        }}
                        className="p-4 bg-gradient-to-br from-[#d4af37]/20 to-[#c5a028]/20 
                                 border-2 border-[#d4af37]/50 text-[#d4af37] rounded-2xl 
                                 hover:from-[#d4af37] hover:to-[#c5a028] hover:text-[#000000]
                                 hover:border-[#d4af37] hover:scale-110 transition-all duration-300
                                 shadow-lg hover:shadow-xl"
                        title="Editar usuario"
                      >
                        <FaEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete({ show: true, user })}
                        className="p-4 bg-gradient-to-br from-red-500/20 to-red-600/20 
                                 border-2 border-red-500/50 text-red-400 rounded-2xl 
                                 hover:from-red-500 hover:to-red-600 hover:text-white
                                 hover:border-red-500 hover:scale-110 transition-all duration-300
                                 shadow-lg hover:shadow-xl"
                        title="Eliminar usuario"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <EditModal
        isOpen={showEditModal}
        user={editingUser}
        onSubmit={handleCreateUpdate}
        onCancel={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
      />

      <ConfirmDialog
        isOpen={confirmDelete.show}
        title="Eliminar Usuario"
        message={
          <div className="space-y-4">
            <p>¿Estás seguro de que deseas eliminar al usuario <span className="font-bold text-[#d4af37]">"{confirmDelete.user?.nombre} {confirmDelete.user?.apellido}"</span>?</p>
            <p className="text-sm text-red-400"> Esta acción no se puede deshacer.</p>
            {confirmDelete.user?.rol === 'ADMIN' && (
              <p className="text-sm text-yellow-400"> Estás intentando eliminar un usuario con rol de Administrador.</p>
            )}
            <p className="text-sm text-[#bfbfbf]">
              Si el usuario tiene pedidos, reservas u otras acciones asociadas, no podrá ser eliminado.
              Considera desactivar su cuenta en su lugar.
            </p>
          </div>
        }
        onConfirm={() => handleDelete(confirmDelete.user)}
        onCancel={() => setConfirmDelete({ show: false, user: null })}
      />
    </PageLayout>
  );
};

UserForm.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    apellido: PropTypes.string,
    email: PropTypes.string,
    rol: PropTypes.string,
    activo: PropTypes.bool,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

EditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  user: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default UsersAdmin;
