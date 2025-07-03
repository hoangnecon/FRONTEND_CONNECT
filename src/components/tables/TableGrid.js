// src/components/tables/TableGrid.js
import React from 'react';
import { GalleryVertical, ListFilter, RotateCw, PlusCircle, Search } from 'lucide-react';

const TableGrid = ({
  tables,
  selectedTable,
  setSelectedTable,
  orders,
  tableFilter,
  setTableFilter,
  recentItems,
  menuItems,
  addToOrder,
  autoOpenMenu,
  handleAutoOpenMenuToggle,
}) => {
  const filteredTables = tables.filter((table) => {
    if (tableFilter === 'all') return true;
    if (tableFilter === 'occupied') return orders[table.id]?.length > 0;
    if (tableFilter === 'free') return !orders[table.id] || orders[table.id].length === 0;
    return true;
  });

  const getRecentMenuItems = () => {
    return recentItems.map(itemId => menuItems.find(item => item.id === itemId)).filter(Boolean);
  };

  const recentMenuItemsList = getRecentMenuItems();

  return (
    <div className="p-4 md:p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-headline mb-2">Sơ đồ bàn</h1>
          <p className="text-primary-paragraph">Chọn một bàn để bắt đầu thêm món.</p>
        </div>
        <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-primary-paragraph">Tự mở menu</label>
            <button onClick={handleAutoOpenMenuToggle} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${autoOpenMenu ? 'bg-primary-button' : 'bg-gray-300'}`}>
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${autoOpenMenu ? 'translate-x-6' : 'translate-x-1'}`}/>
            </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mb-6 flex-shrink-0">
        <button onClick={() => setTableFilter('all')} className={`px-4 py-2 rounded-xl font-medium ${tableFilter === 'all' ? 'bg-primary-button text-white' : 'bg-primary-main'}`}>Tất cả</button>
        <button onClick={() => setTableFilter('occupied')} className={`px-4 py-2 rounded-xl font-medium ${tableFilter === 'occupied' ? 'bg-primary-button text-white' : 'bg-primary-main'}`}>Đang có khách</button>
        <button onClick={() => setTableFilter('free')} className={`px-4 py-2 rounded-xl font-medium ${tableFilter === 'free' ? 'bg-primary-button text-white' : 'bg-primary-main'}`}>Bàn trống</button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {filteredTables.map((table) => (
            <button
              key={table.id}
              onClick={() => setSelectedTable(table.id)}
              className={`p-4 rounded-2xl aspect-square flex flex-col items-center justify-center transition-all duration-300 shadow-lg ${
                selectedTable === table.id
                  ? 'bg-primary-button text-white ring-4 ring-primary-highlight'
                  : orders[table.id]?.length > 0
                  ? 'bg-primary-tertiary text-white'
                  : 'bg-primary-main text-primary-headline'
              }`}
            >
              <GalleryVertical size={32} className="mb-2" />
              <span className="font-bold text-lg">{table.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableGrid;