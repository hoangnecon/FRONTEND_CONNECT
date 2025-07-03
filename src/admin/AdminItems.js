import React, { useState, useMemo } from 'react';
import { Plus, Star, Search, Edit3, Trash2 } from 'lucide-react';
import InventoryManagement from './InventoryManagement';

const ItemDialog = ({ mode, item, onSave, onClose, menuTypes, categories }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category:
      item?.category ||
      categories.find((c) => c.id !== 'all' && c.id !== 'popular')?.name ||
      '',
    price: item?.price || 0,
    image: item?.image || '',
    isPopular: item?.isPopular || false,
    menuType: item?.menuType || menuTypes[0]?.id || 'regular',
  });

  const handleSave = () => {
    if (formData.name && formData.category && formData.price > 0) {
      onSave(formData);
      onClose();
    } else {
      alert('Vui lòng điền đầy đủ thông tin tên, danh mục và giá.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary-main rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <h3 className="text-lg font-bold text-primary-headline mb-4">
          {mode === 'add' ? 'Thêm Món Mới' : 'Sửa Món Ăn'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-paragraph mb-2">
                Tên món
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 bg-primary-secondary rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-paragraph mb-2">
                Danh mục
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full p-3 bg-primary-secondary rounded-xl"
              >
                {categories
                  .filter((cat) => cat.id !== 'all' && cat.id !== 'popular')
                  .map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-paragraph mb-2">
                Giá (VND)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="w-full p-3 bg-primary-secondary rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-paragraph mb-2">
                URL Hình ảnh
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full p-3 bg-primary-secondary rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-paragraph mb-2">
                Loại menu
              </label>
              <select
                value={formData.menuType}
                onChange={(e) =>
                  setFormData({ ...formData, menuType: e.target.value })
                }
                className="w-full p-3 bg-primary-secondary rounded-xl"
              >
                {menuTypes.map((menu) => (
                  <option key={menu.id} value={menu.id}>
                    {menu.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="isPopular"
                checked={formData.isPopular}
                onChange={(e) =>
                  setFormData({ ...formData, isPopular: e.target.checked })
                }
                className="w-5 h-5 text-primary-button rounded"
              />
              <label
                htmlFor="isPopular"
                className="text-sm font-medium text-primary-paragraph"
              >
                Món phổ biến
              </label>
            </div>
            {formData.image && (
              <div>
                <label className="block text-sm font-medium text-primary-paragraph mb-2">
                  Xem trước
                </label>
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-xl"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-primary-button text-primary-main py-3 rounded-xl font-bold hover:bg-primary-highlight transition-colors shadow-md"
          >
            {mode === 'add' ? 'Thêm' : 'Cập nhật'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-primary-secondary text-primary-button py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors shadow-md"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminItems = ({
  menuItems,
  menuTypes,
  categories,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateItemInventory,
  orders,
}) => {
  const [activeTab, setActiveTab] = useState('items');
  const [itemFilter, setItemFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [inventorySort, setInventorySort] = useState('name_asc');
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [showEditItemDialog, setShowEditItemDialog] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

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

  const processedItems = useMemo(() => {
    return menuItems
      .map(item => ({
        ...item,
        remainingStock: getRemainingStock(item),
      }))
      .filter(item => {
        const matchesFilter = itemFilter === 'all' || item.menuType === itemFilter;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => {
        if (activeTab === 'inventory' && inventorySort === 'remaining_asc') {
          const aStock = a.inventoryEnabled ? a.remainingStock : Infinity;
          const bStock = b.inventoryEnabled ? b.remainingStock : Infinity;
          return aStock - bStock;
        }
        return a.name.localeCompare(b.name);
      });
  }, [menuItems, itemFilter, searchTerm, orders, activeTab, inventorySort]);
  
  return (
    <div className="p-4 md:p-8 h-full flex flex-col bg-primary-bg">
      {/* Header */}
      <div className="flex-shrink-0">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary-headline mb-3">Quản lý Món ăn</h1>
            <p className="text-primary-paragraph text-lg">
              Thêm, sửa, xóa các món ăn và quản lý tồn kho.
            </p>
          </div>
          <div className="mt-4 md:mt-0 self-start md:self-center">
            {activeTab === 'items' && (
              <button
                onClick={() => setShowAddItemDialog(true)}
                className="bg-primary-button text-primary-main px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-highlight transition-colors shadow-lg"
              >
                <Plus size={20} /> Thêm Món Mới
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-paragraph"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm món ăn theo tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-primary-main rounded-2xl focus:ring-2 focus:ring-primary-highlight focus:border-transparent transition-all duration-300 shadow-md"
            />
          </div>
          {activeTab === 'inventory' && (
              <select
                  value={inventorySort}
                  onChange={(e) => setInventorySort(e.target.value)}
                  className="px-4 py-3 bg-primary-main rounded-2xl text-primary-headline focus:ring-2 focus:ring-primary-highlight shadow-md"
              >
                  <option value="name_asc">Sắp xếp: Tên A-Z</option>
                  <option value="remaining_asc">Sắp xếp: Số lượng còn lại</option>
              </select>
          )}
        </div>

        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md ${
              activeTab === 'items'
                ? 'bg-primary-button text-primary-main shadow-lg'
                : 'bg-primary-main text-primary-headline hover:bg-primary-highlight'
            }`}
          >
            Danh sách món
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md ${
              activeTab === 'inventory'
                ? 'bg-primary-button text-primary-main shadow-lg'
                : 'bg-primary-main text-primary-headline hover:bg-primary-highlight'
            }`}
          >
            Hàng tồn kho
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto pr-0 md:pr-4">
        {activeTab === 'items' && (
          <>
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => setItemFilter('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors shadow-md ${
                  itemFilter === 'all' ? 'bg-primary-button text-primary-main' : 'bg-primary-main'
                }`}
              >
                Tất cả ({menuItems.length})
              </button>
              {menuTypes.map((menu) => (
                <button
                  key={menu.id}
                  onClick={() => setItemFilter(menu.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors shadow-md ${
                    itemFilter === menu.id ? 'bg-primary-button text-primary-main' : 'bg-primary-main'
                  }`}
                >
                  {menu.name} ({menuItems.filter((item) => item.menuType === menu.id).length})
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {processedItems.map((item) => (
                <div key={item.id} className="bg-primary-main rounded-3xl p-4 shadow-xl">
                  <div className="relative mb-4">
                    <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-2xl" />
                    {item.isPopular && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-white p-1 rounded-full">
                        <Star size={12} className="fill-current" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-primary-headline mb-1">{item.name}</h3>
                  <p className="text-sm text-primary-paragraph mb-2">{item.category}</p>
                  <p className="text-lg font-bold text-primary-headline mb-3">
                    {item.price.toLocaleString('vi-VN')}đ
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedMenuItem(item);
                        setShowEditItemDialog(true);
                      }}
                      className="flex-1 bg-primary-button text-white py-2 rounded-lg font-medium hover:bg-blue-600 shadow-md"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => deleteMenuItem(item.id)}
                      className="flex-1 bg-primary-tertiary text-white py-2 rounded-lg font-medium hover:bg-red-600 shadow-md"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'inventory' && (
          <InventoryManagement
            menuItems={processedItems}
            updateItemInventory={updateItemInventory}
            orders={orders}
          />
        )}
      </div>

      {showAddItemDialog && (
        <ItemDialog
          mode="add"
          onSave={addMenuItem}
          onClose={() => setShowAddItemDialog(false)}
          menuTypes={menuTypes}
          categories={categories}
        />
      )}
      {showEditItemDialog && selectedMenuItem && (
        <ItemDialog
          mode="edit"
          item={selectedMenuItem}
          onSave={(data) => updateMenuItem(selectedMenuItem.id, data)}
          onClose={() => {
            setShowEditItemDialog(false);
            setSelectedMenuItem(null);
          }}
          menuTypes={menuTypes}
          categories={categories}
        />
      )}
    </div>
  );
};

export default AdminItems;