import React from 'react';
import PropTypes from 'prop-types';

const HeroCocinero = ({ nombre }) => {
  return (
    <section className="relative min-h-[420px] flex items-center justify-center overflow-hidden bg-[#000000] text-[#ffffff]">
      <div className="absolute inset-0 parallax-layer opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/70 via-[#000000]/40 to-[#000000]/85" />
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-title font-semibold drop-shadow-xl mb-3 text-shimmer fade-up">
          ¡Bienvenido a la cocina, {nombre || 'Chef'}!
        </h1>
        <p className="text-lg md:text-2xl text-[#bfbfbf] font-medium drop-shadow fade-up delay-1">
          Administra y prepara los pedidos con eficiencia y calidad
        </p>
          <div className="flex justify-center gap-6 mt-6 fade-up delay-2">
          </div>
      </div>
    </section>
  );
};

HeroCocinero.propTypes = {
  nombre: PropTypes.string,
};

export default HeroCocinero;
