// src/admin/AdminTables.js
import React, { useState } from 'react';
import { Plus, Edit3, Trash2, GalleryVertical, ShoppingBag } from 'lucide-react';

const AdminTables = ({ tables, setTables }) => {
  const [showAddEditTableDialog, setShowAddEditTableDialog] = useState(false);
  const [selectedTableEdit, setSelectedTableEdit] = useState(null);
  const [newTableName, setNewTableName] = useState('');
  const [isNewTableSpecial, setIsNewTableSpecial] = useState(false);
  const [newTableId, setNewTableId] = useState('');

  const handleAddTable = () => {
    if (newTableName.trim() === '' || newTableId.trim() === '') {
      alert("Vui lòng điền đầy đủ ID và tên bàn.");
      return;
    }
    if (tables.some(table => table.id === newTableId)) {
      alert("ID bàn đã tồn tại!");
      return;
    }
    setTables(prevTables => {
      const newTable = {
        id: newTableId,
        name: newTableName,
        isSpecial: isNewTableSpecial,
        icon: isNewTableSpecial ? ShoppingBag : GalleryVertical, // Default icon based on type
      };
      // Add special tables to the beginning, regular tables to the end
      if (newTable.isSpecial) {
        return [newTable, ...prevTables];
      } else {
        return [...prevTables, newTable];
      }
    });
    setShowAddEditTableDialog(false);
    setNewTableName('');
    setNewTableId('');
    setIsNewTableSpecial(false);
  };

  const handleUpdateTable = () => {
    if (newTableName.trim() === '' || !selectedTableEdit) {
      alert("Vui lòng điền tên bàn.");
      return;
    }
    setTables(prevTables => prevTables.map(table =>
      table.id === selectedTableEdit.id
        ? { ...table, name: newTableName, isSpecial: isNewTableSpecial, icon: isNewTableSpecial ? ShoppingBag : GalleryVertical }
        : table
    ).sort((a, b) => { // Re-sort after update to maintain special tables at top
      if (a.isSpecial && !b.isSpecial) return -1;
      if (!a.isSpecial && b.isSpecial) return 1;
      return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
    }));
    setShowAddEditTableDialog(false);
    setSelectedTableEdit(null);
    setNewTableName('');
    setIsNewTableSpecial(false);
  };

  const handleDeleteTable = (tableId) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bàn "${tableId}" không?`)) {
      setTables(prevTables => prevTables.filter(table => table.id !== tableId));
    }
  };

  const openAddDialog = () => {
    setSelectedTableEdit(null); // Ensure we are in add mode
    setNewTableName('');
    setNewTableId('');
    setIsNewTableSpecial(false);
    setShowAddEditTableDialog(true);
  }

  const openEditDialog = (table) => {
    setSelectedTableEdit(table);
    setNewTableName(table.name);
    setNewTableId(table.id); // For display in edit, but not editable
    setIsNewTableSpecial(table.isSpecial);
    setShowAddEditTableDialog(true);
  };

  // Sort tables so special ones come first
  const sortedTables = [...tables].sort((a, b) => {
    if (a.isSpecial && !b.isSpecial) return -1;
    if (!a.isSpecial && b.isSpecial) return 1;
    return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
  });

  return (
    <div className="bg-primary-bg pt-4"> {/* Removed padding from parent to avoid double padding */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary-headline mb-3">Quản lý Bàn</h1>
          <p className="text-primary-paragraph text-lg">Thêm, sửa, xóa các loại bàn và số bàn</p>
        </div>
        <button onClick={openAddDialog} className="bg-primary-button text-primary-main px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-highlight transition-colors shadow-lg">
          <Plus size={20} /> Thêm Bàn
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTables.map((table) => {
          const IconComponent = table.icon;
          return (
            <div key={table.id} className="bg-primary-main rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {IconComponent && <IconComponent className="text-primary-button" size={24} />}
                  <h3 className="text-xl font-bold text-primary-headline">{table.name}</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEditDialog(table)} className="p-2 text-primary-button hover:bg-primary-secondary rounded-lg"><Edit3 size={16} /></button>
                  <button onClick={() => handleDeleteTable(table.id)} className="p-2 text-primary-tertiary hover:bg-red-100 rounded-lg"><Trash2 size={16} /></button>
                </div>
              </div>
              <p className="text-sm text-primary-paragraph">ID: {table.id}</p>
              <p className="text-sm text-primary-paragraph">Loại: {table.isSpecial ? 'Đặc biệt' : 'Thường'}</p>
            </div>
          );
        })}
      </div>

      {showAddEditTableDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-primary-main rounded-2xl p-6 m-4 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-primary-headline mb-4">
              {selectedTableEdit ? 'Sửa Bàn' : 'Thêm Bàn Mới'}
            </h3>
            <div className="space-y-4">
              {!selectedTableEdit && ( // Only show ID input for new tables
                <div>
                  <label className="block text-sm font-medium text-primary-paragraph mb-2">ID Bàn (vd: 1, takeaway, VIP)</label>
                  <input type="text" value={newTableId} onChange={(e) => setNewTableId(e.target.value)} className="w-full p-3 bg-primary-secondary rounded-xl" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-primary-paragraph mb-2">Tên Bàn (vd: Bàn 1, Bàn Mang về)</label>
                <input type="text" value={newTableName} onChange={(e) => setNewTableName(e.target.value)} className="w-full p-3 bg-primary-secondary rounded-xl" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isSpecialTable" checked={isNewTableSpecial} onChange={(e) => setIsNewTableSpecial(e.target.checked)} className="w-5 h-5 text-primary-button rounded" />
                <label htmlFor="isSpecialTable" className="text-sm font-medium text-primary-paragraph">Bàn đặc biệt (xuất hiện đầu tiên)</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={selectedTableEdit ? handleUpdateTable : handleAddTable} className="flex-1 bg-primary-button text-primary-main py-2 rounded-xl font-bold">
                {selectedTableEdit ? 'Cập nhật' : 'Thêm'}
              </button>
              <button onClick={() => { setShowAddEditTableDialog(false); setSelectedTableEdit(null); setNewTableName(''); setNewTableId(''); setIsNewTableSpecial(false); }} className="flex-1 bg-primary-secondary text-primary-button py-2 rounded-xl font-bold">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTables;