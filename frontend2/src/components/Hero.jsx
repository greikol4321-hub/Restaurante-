import { Link } from 'react-router-dom';
import { FaUtensils, FaMobileAlt, FaBolt, FaShieldAlt } from 'react-icons/fa';

const Hero = () => {
  return (
    <section className="relative bg-primary min-h-screen flex items-center overflow-hidden">
      {/* Fondo con pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #00B4D8 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Gradientes decorativos */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-light/20 rounded-full blur-[100px] animate-pulse"></div>

      <div className="container relative z-10 mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenido de texto - Lado izquierdo */}
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              <span className="text-sm text-accent font-medium">Sistema de Gestión Completo</span>
            </div>

            {/* Título grande */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-none">
              <span className="text-text-primary">Menú</span>
              <br />
              <span className="bg-gradient-to-r from-accent via-accent-light to-accent bg-clip-text text-transparent">
                Digital
              </span>
            </h1>

            {/* Descripción */}
            <p className="text-xl text-text-secondary max-w-lg leading-relaxed animate-slide-up">
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
                <div key={i} className="feature-card group">
                  <span className="text-2xl text-accent group-hover:text-accent-light transition-colors">{feature.icon}</span>
                  <span className="text-sm text-text-secondary group-hover:text-text-primary font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/login"
                className="btn-primary group px-6 py-3 rounded-full font-semibold text-text-primary bg-gradient-gold hover:shadow-gold-lg transition-transform transform hover:scale-105"
              >
                <span>Comenzar Ahora</span>
                <div className="btn-shine"></div>
              </Link>
              <Link
                to="/menu"
                className="btn-secondary px-6 py-3 rounded-full font-semibold text-text-primary bg-gradient-radial hover:shadow-gold-lg transition-transform transform hover:scale-105"
              >
                Ver Demo
              </Link>
            </div>
          </div>

          {/* Imagen - Lado derecho */}
          <div className="relative lg:h-[600px] animate-fade-in">
            {/* Card principal */}
            <div className="card overflow-hidden group">
              <img
                src="https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Restaurante"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-60"></div>
              
              {/* Stats flotantes */}
              <div className="absolute bottom-6 left-6 right-6 flex gap-4">
                {/* Removed 'Pedidos Hoy' and 'Satisfacción' stat cards */}
              </div>
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
