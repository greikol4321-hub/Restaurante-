import { Link } from 'react-router-dom';
import { FaUtensils, FaCalendarAlt } from 'react-icons/fa';

const HeroUsuario = ({ user }) => {
  return (
    <section className="relative bg-[#000000] py-20 md:py-32 overflow-hidden">
      {/* Efectos de fondo dorados */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.08),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(197,160,40,0.05),transparent_50%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-8 animate-fade-in">
            <span className="bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              ¡Bienvenido{user?.nombre ? `, ${user.nombre}` : ''}!
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-[#bfbfbf] mb-12 animate-slide-up leading-relaxed">
            Descubre nuestros deliciosos platillos y disfruta de una experiencia gastronómica única.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-scale-in">
            <Link
              to="/menu"
              className="relative btn-primary group flex items-center justify-center gap-3"
            >
              <FaUtensils className="text-lg" />
              <span>Ir al Menú Digital</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 rounded-xl"></div>
            </Link>
            <Link
              to="/reservas-usuario"
              className="btn-secondary group flex items-center justify-center gap-3"
            >
              <FaCalendarAlt className="text-lg" />
              <span>Reservaciones</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Decoración inferior */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent"></div>
    </section>
  );
};

export default HeroUsuario;
