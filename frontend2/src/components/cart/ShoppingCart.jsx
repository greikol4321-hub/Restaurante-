import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CartItem from './CartItem';
import { formatColones } from '../../utils/formatters';

const ShoppingCart = ({ cartItems, onDecrease, onIncrease, onRemove, onPagar, pagarDisabled, autoExpand }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [prevItemCount, setPrevItemCount] = useState(0);
  
  // Auto-expandir cuando se agrega un producto
  useEffect(() => {
    if (autoExpand && cartItems.length > prevItemCount) {
      setIsExpanded(true);
    }
    setPrevItemCount(cartItems.length);
  }, [cartItems.length, prevItemCount, autoExpand]);
  
  // Cálculo automático del total
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Calcular subtotales
  const subtotal = total;
  const impuestos = total * 0.13; // 13% IVA Costa Rica
  const totalConImpuestos = subtotal + impuestos;
  
  return (
    <div className="bg-[#0a0a0a] flex flex-col">
      {/* Header compacto y moderno - Clickeable */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-5 border-b border-[#1a1a1a] bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-colors w-full text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#d4af37]/10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#ffffff]">Mi Pedido</h2>
            <p className="text-xs text-[#888888]">{cartItems.length} productos</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {cartItems.length > 0 && (
            <div className="px-3 py-1 bg-[#d4af37]/10 rounded-full">
              <span className="text-xs font-bold text-[#d4af37]">{cartItems.length}</span>
            </div>
          )}
          <svg 
            className={`w-5 h-5 text-[#888888] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Estado vacío o contenido del carrito */}
      {isExpanded && cartItems.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-[#888888]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-[#bfbfbf] font-medium mb-2">Carrito vacío</p>
          <p className="text-sm text-[#888888]">Agrega productos para comenzar</p>
        </div>
      )}

      {isExpanded && cartItems.length > 0 && (
        <>
          {/* Lista de productos - Sin scroll, se expande con el contenido */}
          <div className="p-4 space-y-3">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onDecrease={() => onDecrease(item.id)}
                onIncrease={() => onIncrease(item.id)}
                onRemove={() => onRemove(item.id)}
              />
            ))}
          </div>

          {/* Footer con resumen */}
          <div className="border-t border-[#1a1a1a] bg-[#000000] p-5 space-y-4">
            {/* Subtotales compactos */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[#888888]">
                <span>Subtotal</span>
                <span>{formatColones(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>Impuestos (13%)</span>
                <span>{formatColones(impuestos)}</span>
              </div>
            </div>

            {/* Total destacado */}
            <div className="flex justify-between items-center py-3 border-t border-[#1a1a1a]">
              <span className="text-base font-semibold text-[#ffffff]">Total</span>
              <span className="text-2xl font-bold text-[#d4af37]">
                {formatColones(totalConImpuestos)}
              </span>
            </div>

            {/* Botón CTA grande */}
            <button
              onClick={onPagar}
              disabled={pagarDisabled || cartItems.length === 0}
              className="w-full bg-[#d4af37] hover:bg-[#f4d03f] text-[#000000] font-bold py-4 rounded-lg
                       transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                       hover:shadow-[0_8px_20px_rgba(212,175,55,0.3)] disabled:hover:shadow-none
                       flex items-center justify-center gap-2"
            >
              {pagarDisabled ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M5 13l4 4L19 7" />
                  </svg>
                  Crear Pedido
                </>
              )}
            </button>

            <p className="text-xs text-center text-[#666666]">
              Pedido seguro y protegido 
            </p>
          </div>
        </>
      )}
    </div>
  );
};

ShoppingCart.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      imagenUrl: PropTypes.string,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  onDecrease: PropTypes.func.isRequired,
  onIncrease: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onPagar: PropTypes.func,
  pagarDisabled: PropTypes.bool,
  autoExpand: PropTypes.bool,
};

ShoppingCart.defaultProps = {
  onPagar: () => {},
  pagarDisabled: false,
  autoExpand: false,
};

export default ShoppingCart;
