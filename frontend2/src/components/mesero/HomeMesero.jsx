import { useEffect, useState } from 'react';
import HeaderMesero from './HeaderMesero';
import HeroMesero from './HeroMesero';
import ModalCrearOrden from './ModalCrearOrden';
import { mesaOrdenesApi } from '../../utils/api';
import PageLayout from '../common/PageLayout';

const HomeMesero = () => {
  const [nombre, setNombre] = useState('Mesero');
  const [mesaSel, setMesaSel] = useState(null);
  const [open, setOpen] = useState(false);
  const [mesas, setMesas] = useState({});
  const [loading, setLoading] = useState(true);

  // Cargar estados de las mesas
  useEffect(() => {
    const loadMesas = async () => {
      try {
        setLoading(true);
        const res = await mesaOrdenesApi.listarOrdenes();
        const mesasData = {};
        
        // Inicializar todas las mesas como LIBRE
        for (let i = 1; i <= 20; i++) {
          mesasData[i] = { estado: 'LIBRE' };
        }
        
        // Actualizar estado de mesas con órdenes activas
        res.data.forEach(orden => {
          // Solo mostrar mesas con órdenes que no estén en estados finales
          if (!['ENTREGADO', 'COBRADO', 'PAGADO', 'CANCELADO'].includes(orden.estado)) {
            mesasData[orden.numeroMesa] = {
              estado: orden.estado,
              ordenId: orden.id,
              numeroMesa: orden.numeroMesa
            };
          }
        });
        setMesas(mesasData);
      } catch (error) {
        console.error('Error cargando estado de mesas:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMesas();
    // Refrescar cada 30 segundos
    const interval = setInterval(loadMesas, 30000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setNombre(user?.nombre || user?.username || 'Mesero');
      } catch {}
    }
  }, []);

  const handleMesaClick = async (e, n, mesaInfo) => {
    e.preventDefault();
    e.stopPropagation();

    if (mesaInfo.estado === 'LISTO') {
      // Actualizar estado a ENTREGADO cuando se sirve
      if (window.confirm('¿Confirmar que se ha entregado la mesa?')) {
        try {
          await mesaOrdenesApi.actualizarEstadoOrden(mesaInfo.ordenId, 'ENTREGADO');
          // Actualizar el estado local: eliminar la mesa del estado
          const newMesas = { ...mesas };
          delete newMesas[n];  // Eliminar la mesa del estado local
          setMesas(newMesas);
          // Mostrar confirmación
          alert('Mesa entregada correctamente. Se ha quitado del sistema.');
        } catch (error) {
          console.error('Error actualizando estado de mesa:', error);
          if (error.response?.status === 500) {
            alert('Error del servidor. Por favor, intenta de nuevo más tarde.');
          } else {
            alert('Error actualizando el estado de la mesa: ' + error.message);
          }
        }
      }
      return;
    }

    // Solo permitir crear orden si la mesa está libre
    if (mesaInfo.estado === 'LIBRE') {
      setMesaSel(n);
      setOpen(true);
    } else if (mesaInfo.estado === 'PENDIENTE' || mesaInfo.estado === 'EN_PREPARACION') {
      alert('Esta mesa está ocupada. No se pueden crear nuevas órdenes.');
    }
  };

  return (
    <PageLayout>
      <HeaderMesero />
      <HeroMesero nombre={nombre} />

      <main className="max-w-7xl mx-auto px-4 py-8 animate-slideInUp">
        <h2 className="text-2xl font-title font-semibold mb-6 text-[#ffffff] text-shimmer">Mesas disponibles</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => {
            const mesaInfo = mesas[n] || { estado: 'LIBRE', numeroMesa: n };
            const isOcupada = mesaInfo.estado === 'PENDIENTE' || mesaInfo.estado === 'EN_PREPARACION';
            const isListo = mesaInfo.estado === 'LISTO';
            
            // Asegurarnos que siempre tengamos un número de mesa
            const numeroMesa = mesaInfo.numeroMesa || n;
            
            let estadoTexto = 'Libre';
            let colorClase = 'border-[#c5a028]/30 bg-[#000000]/50 hover:bg-[#d4af37]/20 hover:border-[#d4af37] hover-glow';
            let textColor = 'text-[#bfbfbf]';
            let numeroColor = 'text-[#d4af37]';

            if (isOcupada) {
              estadoTexto = 'Ocupada';
              colorClase = 'border-red-500/50 bg-red-900/20';
              textColor = 'text-red-400';
              numeroColor = 'text-red-500';
            } else if (isListo) {
              estadoTexto = 'Listo para servir';
              colorClase = 'border-green-500/50 bg-green-900/20 animate-pulse';
              textColor = 'text-green-400';
              numeroColor = 'text-green-500';
            }
            
            return (
              <div key={n} className="relative">
                <button
                  type="button"
                  onClick={(e) => handleMesaClick(e, n, mesaInfo)}
                  disabled={isOcupada && !isListo}
                  className={`w-full aspect-square rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 ${colorClase}`}
                >
                  <span className={`text-2xl font-title font-bold ${textColor}`}>
                    Mesa {mesaInfo.numeroMesa || n}
                  </span>
                  <span className={`text-sm font-medium ${textColor}`}>
                    {estadoTexto}
                  </span>
                </button>
                {isListo && (
                  <button
                    onClick={(e) => handleMesaClick(e, n, mesaInfo)}
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 hover:bg-green-400 text-black px-4 py-1 rounded-full text-sm font-semibold transition-colors"
                  >
                    Servir Mesa
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <ModalCrearOrden
        mesa={mesaSel || 0}
        open={open}
        onClose={() => setOpen(false)}
        onCreated={(newOrden) => {
          // Actualizar el estado de la mesa localmente
          const newMesas = { ...mesas };
          newMesas[mesaSel] = {
            estado: newOrden.estado,
            ordenId: newOrden.id,
            numeroMesa: newOrden.numeroMesa
          };
          setMesas(newMesas);
        }}
      />
    </PageLayout>
  );
};

export default HomeMesero;
