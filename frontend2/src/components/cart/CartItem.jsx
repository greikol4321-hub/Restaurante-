import PropTypes from 'prop-types';
import { formatColones } from '../../utils/formatters';
import CachedImage from '../common/CachedImage';

const CartItem = ({ item, onDecrease, onIncrease, onRemove }) => {
  return (
    <div className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0b0b0b] border border-[#c5a028]/20 p-4 rounded-xl hover:border-[#d4af37]/50 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(212,175,55,0.15)] fade-up">
      <div className="flex gap-4">
        {/* Imagen del producto */}
        <div className="relative overflow-hidden rounded-lg flex-shrink-0">
          <CachedImage
            productId={item.id}
            imagenUrl={item.imagenUrl}
            alt={item.name}
            fallbackName={item.name}
            className="w-20 h-20 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Información y controles */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* Nombre y botón eliminar */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-[#ffffff] text-base leading-tight">{item.name}</h3>
            <button
              className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:scale-110 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-300 focus:outline-none flex-shrink-0"
              onClick={onRemove}
              aria-label="Eliminar del carrito"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Precio unitario */}
          <div className="text-[#d4af37] font-medium text-sm mb-2">
            {formatColones(item.price)} c/u
          </div>

          {/* Controles de cantidad y total */}
          <div className="flex items-center justify-between">
            {/* Controles de cantidad */}
            <div className="flex items-center gap-2">
              <button
                className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all duration-300 focus:outline-none ${
                  item.quantity <= 1
                    ? 'bg-[#888888]/10 text-[#888888] cursor-not-allowed'
                    : 'bg-[#d4af37]/10 text-[#d4af37] hover:bg-[#d4af37]/20 hover:scale-110'
                }`}
                onClick={onDecrease}
                disabled={item.quantity <= 1}
                aria-label="Reducir cantidad"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                </svg>
              </button>
              
              <span className="px-3 py-1 rounded-lg bg-[#d4af37]/10 text-[#d4af37] font-bold text-base min-w-[40px] text-center">
                {item.quantity}
              </span>
              
              <button
                className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#d4af37]/10 text-[#d4af37] hover:bg-[#d4af37]/20 hover:scale-110 transition-all duration-300 focus:outline-none"
                onClick={onIncrease}
                aria-label="Aumentar cantidad"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Total */}
            <div className="text-right">
              <div className="text-xs text-[#888888] mb-1">Total</div>
              <div className="font-bold text-[#ffffff] text-lg">
                {formatColones(item.price * item.quantity)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    imagenUrl: PropTypes.string,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  onDecrease: PropTypes.func.isRequired,
  onIncrease: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default CartItem;
