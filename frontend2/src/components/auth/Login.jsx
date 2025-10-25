import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../utils/api';
import { useToast } from '../common/ToastContainer';

const Login = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.login(form);
      const usuario = response.data.usuario;

      // Guardar datos del usuario
      sessionStorage.setItem('user', JSON.stringify(usuario));
      window.dispatchEvent(new Event('userLogin'));

      // Validar que usuario y usuario.rol existen
      if (!usuario?.rol) {
        setError('Usuario o rol no válido');
        showError('Usuario o rol no válido');
        return;
      }

      // Pequeña pausa para asegurar que sessionStorage se persiste
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Mostrar mensaje de éxito
      showSuccess(`¡Bienvenido ${usuario.nombre || usuario.email}!`);

      // Redireccionar según rol
      setTimeout(() => {
        switch (usuario.rol) {
          case 'ADMIN':
            navigate('/admin');
            break;
          case 'CLIENTE':
            navigate('/home-usuario');
            break;
          case 'MESERO':
            navigate('/mesero');
            break;
          case 'COCINERO':
            navigate('/home-cocinero');
            break;
          case 'CAJERO':
            navigate('/cajero');
            break;
          default:
            navigate('/');
        }
      }, 500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Credenciales incorrectas o error de conexión';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Parallax background */}
      <div className="absolute inset-0 parallax-layer opacity-30" />

      <div className="max-w-md w-full space-y-8 bg-[#0b0b0b] border border-[#c5a028]/30 p-10 rounded-3xl shadow-2xl relative z-10 fade-up">
        <div className="flex flex-col items-center">
          <img 
            src="/images/logo-horizontal.svg" 
            alt="Menu Restaurante" 
            className="h-16 w-auto mb-6"
          />
          <h2 className="text-center text-3xl font-title font-bold text-[#d4af37] text-shimmer">
            Inicia sesión en tu cuenta
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#bfbfbf] mb-2">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-[#c5a028]/30 
                         bg-[#111111] placeholder-[#bfbfbf]/50 text-[#ffffff] rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent
                         sm:text-sm"
                placeholder="tu@email.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-[#bfbfbf] mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="appearance-none block w-full px-4 py-3 border border-[#c5a028]/30
                         bg-[#111111] placeholder-[#bfbfbf]/50 text-[#ffffff] rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent
                         sm:text-sm"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-xs text-[#d4af37] bg-transparent border-none cursor-pointer hover:text-[#c5a028]"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-900/20 border border-red-500/30 p-4 fade-up">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <Link
              to="/recuperar-password"
              className="font-medium text-[#bfbfbf] hover:text-[#d4af37] hover-glow"
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <Link
              to="/registro"
              className="font-medium text-[#d4af37] hover:text-[#c5a028] hover-glow"
            >
              Crear cuenta
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 rounded-full
                       text-sm font-semibold uppercase tracking-[0.15em] text-[#000000] bg-[#d4af37]
                       hover-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="animate-spin h-5 w-5 text-[#000000]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
