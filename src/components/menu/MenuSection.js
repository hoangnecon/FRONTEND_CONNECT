// src/components/menu/MenuSection.js
import React, { useState } from 'react';
import { Search, Plus, Star } from 'lucide-react';

const MenuSection = ({
  selectedTable,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedMenuType,
  setSelectedMenuType,
  menuItems,
  menuTypes,
  categories,
  addToOrder,
  orders,
}) => {
  const [stockFilter, setStockFilter] = useState('all');

  const getRemainingStock = (item) => {
    if (!item.inventoryEnabled) return Infinity;
    const inOrderCount = Object.values(orders)
      .flat()
      .reduce((acc, orderItem) => {
        if (orderItem.id === item.id) {
          return acc + orderItem.quantity;
        }
        return acc;
      }, 0);
    return item.inventoryCount - inOrderCount;
  };

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMenuType = item.menuType === selectedMenuType;
    const categoryObject = categories.find(cat => cat.id === selectedCategory);
    const categoryName = categoryObject ? categoryObject.name : '';
    const matchesCategory = selectedCategory === 'all' ? true :
                           selectedCategory === 'popular' ? item.isPopular :
                           item.category === categoryName;

    const remainingStock = getRemainingStock(item);
    const matchesStock = stockFilter === 'all' ? true :
                         stockFilter === 'in_stock' ? remainingStock > 0 :
                         remainingStock <= 0;

    return matchesSearch && matchesMenuType && matchesCategory && matchesStock;
  });

  const handleAddToOrder = (item) => {
    const remainingStock = getRemainingStock(item);
    if (item.inventoryEnabled && remainingStock <= 0) {
      alert(`Món "${item.name}" đã hết hàng.`);
      return;
    }
    addToOrder(item);
  };

  return (
    <div className="p-4 md:p-8 h-full flex flex-col bg-primary-bg">
      <div className="flex-shrink-0">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-headline mb-3">
            Khám phá thực đơn
          </h1>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <select
            value={selectedMenuType}
            onChange={(e) => setSelectedMenuType(e.target.value)}
            className="px-4 py-3 bg-primary-main rounded-2xl text-primary-headline focus:ring-2 focus:ring-primary-highlight shadow-md"
          >
            {menuTypes.map((menuType) => (
              <option key={menuType.id} value={menuType.id}>
                {menuType.name}
              </option>
            ))}
          </select>
          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-paragraph"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-primary-main rounded-2xl focus:ring-2 focus:ring-primary-highlight focus:border-transparent transition-all duration-300 shadow-md"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 mb-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md text-sm md:text-base ${
                  selectedCategory === category.id
                    ? 'bg-primary-button text-primary-main shadow-lg'
                    : 'bg-primary-main text-primary-headline'
                }`}
              >
                <IconComponent size={18} />
                {category.name}
              </button>
            );
          })}
        </div>
        
        <div className="flex flex-wrap gap-3 mb-8">
            <button onClick={() => setStockFilter('all')} className={`px-4 py-2 rounded-xl font-medium transition-colors shadow-md ${stockFilter === 'all' ? 'bg-primary-button text-primary-main' : 'bg-primary-main'}`}>
              Tất cả
            </button>
            <button onClick={() => setStockFilter('in_stock')} className={`px-4 py-2 rounded-xl font-medium transition-colors shadow-md ${stockFilter === 'in_stock' ? 'bg-primary-button text-primary-main' : 'bg-primary-main'}`}>
              Còn hàng
            </button>
            <button onClick={() => setStockFilter('out_of_stock')} className={`px-4 py-2 rounded-xl font-medium transition-colors shadow-md ${stockFilter === 'out_of_stock' ? 'bg-primary-button text-primary-main' : 'bg-primary-main'}`}>
              Hết hàng
            </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredMenuItems.map((item) => {
            const remainingStock = getRemainingStock(item);
            const isOutOfStock = item.inventoryEnabled && remainingStock <= 0;
            const isLowStock = item.inventoryEnabled && remainingStock > 0 && remainingStock <= 5;
            
            return (
              <div
                key={item.id}
                onClick={() => handleAddToOrder(item)}
                className={`bg-primary-main rounded-3xl p-4 md:p-6 transition-all duration-300 shadow-lg relative
                  ${isOutOfStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-primary-secondary hover:shadow-xl hover:-translate-y-2 group'}
                  ${isLowStock ? 'border-2 border-orange-500' : ''}
                `}
              >
                <div className="relative">
                  <div className="w-full h-32 md:h-40 bg-primary-secondary rounded-2xl mb-4 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${isOutOfStock ? 'filter grayscale' : ''}`}
                    />
                  </div>
                  {item.isPopular && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star size={12} className="fill-current" />
                      Phổ biến
                    </div>
                  )}
                  {item.inventoryEnabled && (
                      <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold ${isOutOfStock ? 'bg-red-500 text-white' : isLowStock ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'}`}>
                          {isOutOfStock ? 'Hết hàng' : `Còn: ${remainingStock}`}
                      </div>
                  )}
                </div>
                <h3 className="font-bold text-primary-headline text-base md:text-lg mb-2">
                  {item.name}
                </h3>
                <p className="text-sm text-primary-paragraph font-medium mb-4">
                  {item.category}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-primary-headline font-bold text-lg md:text-xl">
                    {item.price.toLocaleString('vi-VN')}đ
                  </p>
                  <div className="w-10 h-10 bg-primary-button rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Plus size={18} className="text-primary-main" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default MenuSection;