// src/admin/AdminDiscountSettings.js
import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Save, X } from 'lucide-react';

const AdminDiscountSettings = ({ options, addOption, updateOption, deleteOption }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentOption, setCurrentOption] = useState({ label: '', type: 'percent', value: '' });

  const handleEdit = (option) => {
    setEditingId(option.id);
    setCurrentOption({ label: option.label, type: option.type, value: option.value });
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setCurrentOption({ label: '', type: 'percent', value: '' });
  };

  const handleSave = () => {
    if (!currentOption.label || !currentOption.value) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const valueAsNumber = parseFloat(currentOption.value);
    if (isNaN(valueAsNumber)) {
        alert('Giá trị phải là một con số.');
        return;
    }


    if (editingId) {
      updateOption(editingId, { ...currentOption, value: valueAsNumber });
    } else {
      addOption({ ...currentOption, value: valueAsNumber });
    }
    handleCancel();
  };
  
  const renderOption = (option) => {
    if (editingId === option.id) {
      return (
        <div key={option.id} className="bg-primary-main p-4 rounded-xl shadow-lg flex items-center gap-2">
            <input type="text" placeholder="Tên hiển thị (vd: 10%)" value={currentOption.label} onChange={(e) => setCurrentOption({...currentOption, label: e.target.value})} className="p-2 border rounded flex-1" />
            <select value={currentOption.type} onChange={(e) => setCurrentOption({...currentOption, type: e.target.value})} className="p-2 border rounded">
                <option value="percent">%</option>
                <option value="amount">VND</option>
            </select>
            <input type="number" placeholder="Giá trị" value={currentOption.value} onChange={(e) => setCurrentOption({...currentOption, value: e.target.value})} className="p-2 border rounded w-24" />
            <button onClick={handleSave} className="p-2 text-green-600"><Save size={18}/></button>
            <button onClick={handleCancel} className="p-2 text-gray-500"><X size={18}/></button>
        </div>
      );
    }
    return (
        <div key={option.id} className="bg-primary-main p-4 rounded-xl shadow-lg flex items-center justify-between">
            <div>
                <p className="font-bold text-lg">{option.label}</p>
                <p className="text-sm text-primary-paragraph">Loại: {option.type === 'percent' ? 'Phần trăm' : 'Số tiền'} - Giá trị: {option.value.toLocaleString('vi-VN')}{option.type === 'percent' ? '%' : 'đ'}</p>
            </div>
            <div className="flex gap-2">
                <button onClick={() => handleEdit(option)} className="p-2 text-primary-button hover:bg-primary-secondary rounded-lg"><Edit3 size={16} /></button>
                <button onClick={() => deleteOption(option.id)} className="p-2 text-primary-tertiary hover:bg-red-100 rounded-lg"><Trash2 size={16} /></button>
            </div>
        </div>
    );
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary-headline">Quản lý Gợi ý Giảm giá</h2>
        {options.length < 4 && !showAddForm && (
          <button onClick={() => {setShowAddForm(true); setEditingId(null);}} className="bg-primary-button text-primary-main px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-highlight transition-colors shadow-lg">
            <Plus size={20} /> Thêm Gợi ý
          </button>
        )}
      </div>
       <p className="text-primary-paragraph mb-6">Tạo các nút giảm giá nhanh để thu ngân thao tác thuận tiện hơn (tối đa 4 gợi ý).</p>
      <div className="space-y-4">
        {options.map(renderOption)}
        {showAddForm && renderOption({id: 'new'})}
      </div>
    </div>
  );
};

export default AdminDiscountSettings;