import PropTypes from 'prop-types';
import { FaTags } from 'react-icons/fa';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3 min-w-max">
        <button
          onClick={() => onSelectCategory('all')}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm
            transition-all duration-300
            flex items-center gap-2 hover:scale-105
            ${
              selectedCategory === 'all'
                ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
                : 'bg-[#1a1a1a] text-[#888888] hover:bg-[#1a1a1a] hover:text-[#d4af37]'
            }
          `}
        >
          <FaTags className="text-xs" />
          Todos
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm
              transition-all duration-300
              flex items-center gap-2 hover:scale-105
              ${
                selectedCategory === category
                  ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
                  : 'bg-[#1a1a1a] text-[#888888] hover:bg-[#1a1a1a] hover:text-[#d4af37]'
              }
            `}
          >
            <FaTags className="text-xs" />
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectCategory: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string.isRequired,
};

export default CategoryFilter;
