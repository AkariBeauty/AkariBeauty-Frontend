import React from 'react';
import { CategoriaServico } from '../../services/servicoService';

interface CategoryFilterProps {
  categories: CategoriaServico[];
  selectedCategory: number | null;
  onCategorySelect: (categoryId: number | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <button
        onClick={() => onCategorySelect(null)}
        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
          selectedCategory === null
            ? 'bg-gradient-to-r from-bolt-primary-500 to-bolt-secondary-500 text-white shadow-lg'
            : 'bg-white text-bolt-neutral-600 hover:bg-bolt-primary-50 border border-bolt-neutral-200'
        }`}
      >
        Todos os Serviços
      </button>
      
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            selectedCategory === category.id
              ? 'bg-gradient-to-r from-bolt-primary-500 to-bolt-secondary-500 text-white shadow-lg'
              : 'bg-white text-bolt-neutral-600 hover:bg-bolt-primary-50 border border-bolt-neutral-200'
          }`}
        >
          {category.nome}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
