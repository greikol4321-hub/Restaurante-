import { Link } from 'react-router-dom';
import { FaUtensils, FaMobileAlt, FaBolt, FaShieldAlt } from 'react-icons/fa';

const Hero = () => {
  return (
    <section className="relative bg-[#000000] min-h-screen flex items-center overflow-hidden">
      {/* Fondo con pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Gradientes decorativos */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#c5a028]/10 rounded-full blur-[100px] animate-pulse"></div>

      <div className="container relative z-10 mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenido de texto - Lado izquierdo */}
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full">
              <span className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse"></span>
              <span className="text-sm text-[#d4af37] font-medium">Sistema de Gestión Completo</span>
            </div>

            {/* Título grande */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-none">
              <span className="text-[#ffffff]">Menú</span>
              <br />
              <span className="bg-gradient-to-r from-[#d4af37] via-[#f4d47b] to-[#d4af37] bg-clip-text text-transparent">
                Digital
              </span>
            </h1>

            {/* Descripción */}
            <p className="text-xl text-[#bfbfbf] max-w-lg leading-relaxed animate-slide-up">
              Transforma tu restaurante con tecnología de vanguardia. 
              Gestión completa desde el menú hasta la cocina.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-4 animate-scale-in">
              {[
                { icon: <FaUtensils />, text: 'Menú Interactivo' },
                { icon: <FaMobileAlt />, text: 'Multi-plataforma' },
                { icon: <FaBolt />, text: 'Tiempo Real' },
                { icon: <FaShieldAlt />, text: 'Seguro' }
              ].map((feature, i) => (
                <div key={i} className="bg-[#1a1a1a] border border-[#c5a028]/30 rounded-xl p-4 flex items-center gap-3 
                                       hover:border-[#d4af37] hover:bg-[#0b0b0b] transition-all duration-300 group">
                  <span className="text-2xl text-[#d4af37] group-hover:text-[#f4d47b] transition-colors">{feature.icon}</span>
                  <span className="text-sm text-[#bfbfbf] group-hover:text-[#ffffff] font-medium transition-colors">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/login"
                className="group px-8 py-4 rounded-xl font-bold text-[#000000] bg-gradient-to-r from-[#d4af37] to-[#c5a028] 
                         hover:scale-105 transition-all duration-300 shadow-[0_8px_24px_rgba(212,175,55,0.3)] 
                         hover:shadow-[0_12px_32px_rgba(212,175,55,0.5)] relative overflow-hidden"
              >
                <span className="relative z-10">Comenzar Ahora</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#f4d47b] to-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                to="/menu"
                className="px-8 py-4 rounded-xl font-bold text-[#d4af37] bg-[#1a1a1a] border-2 border-[#d4af37]/50 
                         hover:bg-[#0b0b0b] hover:border-[#d4af37] hover:scale-105 transition-all duration-300"
              >
                Ver Demo
              </Link>
            </div>
          </div>

          {/* Imagen - Lado derecho */}
          <div className="relative lg:h-[600px] animate-fade-in">
            {/* Card principal */}
            <div className="rounded-3xl overflow-hidden border-2 border-[#d4af37]/30 shadow-[0_20px_60px_rgba(212,175,55,0.2)] group">
              <img
                src="https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Restaurante"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent opacity-60"></div>
            </div>

            {/* Elementos decorativos flotantes */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#d4af37]/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-[#c5a028]/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
