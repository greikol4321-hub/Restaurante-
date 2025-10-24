import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../utils/api';

const SignIn = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!form.nombre || !form.apellido || !form.email || !form.password || !form.confirmPassword) {
      setError('Todos los campos son obligatorios');
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authApi.register({
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        password: form.password,
        rol: 'CLIENTE',
        activo: true,
      });
      const usuario = response.data?.usuario;
      if (usuario?.rol) {
        setSuccess(
          `¡Registro exitoso! Redirigiendo al inicio de sesión...`
        );
      } else {
        setSuccess('¡Registro exitoso! Redirigiendo al inicio de sesión...');
      }
      setForm({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Error al crear la cuenta. Intenta con otro correo o revisa los datos.');
      console.error('Error de registro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Parallax background */}
      <div className="absolute inset-0 parallax-layer opacity-30" />

      <div className="max-w-md w-full space-y-8 bg-[#0b0b0b] border border-[#c5a028]/30 p-10 rounded-3xl shadow-2xl relative z-10 fade-up">
        <div>
          <h2 className="mt-6 text-center text-3xl font-title font-bold text-[#d4af37] text-shimmer">
            Crea tu cuenta
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-[#bfbfbf] mb-2">
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                autoComplete="given-name"
                required
                className="appearance-none block w-full px-4 py-3 border border-[#c5a028]/30
                         bg-[#111111] placeholder-[#bfbfbf]/50 text-[#ffffff] rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent
                         sm:text-sm"
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-[#bfbfbf] mb-2">
                Apellido
              </label>
              <input
                id="apellido"
                name="apellido"
                type="text"
                autoComplete="family-name"
                required
                className="appearance-none block w-full px-4 py-3 border border-[#c5a028]/30
                         bg-[#111111] placeholder-[#bfbfbf]/50 text-[#ffffff] rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent
                         sm:text-sm"
                placeholder="Tu apellido"
                value={form.apellido}
                onChange={handleChange}
              />
            </div>
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
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#bfbfbf] mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none block w-full px-4 py-3 border border-[#c5a028]/30
                         bg-[#111111] placeholder-[#bfbfbf]/50 text-[#ffffff] rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent
                         sm:text-sm"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[#bfbfbf] mb-2"
              >
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none block w-full px-4 py-3 border border-[#c5a028]/30
                         bg-[#111111] placeholder-[#bfbfbf]/50 text-[#ffffff] rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent
                         sm:text-sm"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-900/20 border border-red-500/30 p-4 fade-up">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-xl bg-green-900/20 border border-green-500/30 p-4 fade-up">
              <p className="text-sm text-green-400">{success}</p>
            </div>
          )}

          <div className="text-sm text-center">
            <Link
              to="/login"
              className="font-medium text-[#d4af37] hover:text-[#c5a028] hover-glow"
            >
              ¿Ya tienes una cuenta? Inicia sesión
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
                'Crear cuenta'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
