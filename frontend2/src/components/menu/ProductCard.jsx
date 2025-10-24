import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';
import { formatColones } from '../../utils/formatters';
import CachedImage from '../common/CachedImage';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="group relative bg-[#1a1a1a] rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#FFD700]/10 hover:-translate-y-1 transition-all duration-300">
      {/* Imagen con overlay */}
      <div className="relative h-48 overflow-hidden">
        <CachedImage
          productId={product.id}
          imagenUrl={product.imagenUrl}
          alt={product.name}
          fallbackName={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-transparent to-transparent" />
        
        {/* Badge de precio */}
        <div className="absolute top-4 right-4 bg-[#FFD700] text-black px-4 py-2 rounded-full 
                      font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300">
          {formatColones(product.price)}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <h3 className="text-white font-bold text-xl mb-2 truncate group-hover:text-[#FFD700] transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-6 min-h-[40px]">
          {product.description || 'Delicioso platillo preparado con los mejores ingredientes.'}
        </p>

        {/* Botón de agregar al carrito */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-[#333] hover:bg-[#444] text-[#FFD700] py-3 px-4 rounded-lg 
                   flex items-center justify-center gap-2 transition-colors group/btn relative
                   overflow-hidden"
        >
          <div className="relative z-10 flex items-center gap-2">
            <FaPlus className="text-sm transform group-hover/btn:rotate-180 transition-transform duration-300" />
            <span className="font-medium">Agregar al Carrito</span>
          </div>
          <div className="absolute inset-0 bg-[#FFD700] transform scale-x-0 group-hover/btn:scale-x-100 
                        origin-left transition-transform duration-300" />
          <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 bg-gradient-to-r 
                        from-[#FFD700] to-[#FFF] blur-2xl transition-opacity duration-300" />
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    imagenUrl: PropTypes.string,
    category: PropTypes.string.isRequired,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductCard;
