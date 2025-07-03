import React, { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';

const CategoryDialog = ({ category, onSave, onClose }) => {
  const [name, setName] = useState(category?.name || '');
  const handleSave = () => {
    if (name) {
      onSave(name);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary-main rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-lg font-bold text-primary-headline mb-4">
          {category ? 'Sửa Danh mục' : 'Thêm Danh mục'}
        </h3>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên danh mục" className="w-full p-3 rounded-xl bg-primary-secondary" />
        <div className="flex gap-3 mt-4">
          <button onClick={handleSave} className="flex-1 bg-primary-button text-primary-main py-2 rounded-xl font-bold">Lưu</button>
          <button onClick={onClose} className="flex-1 bg-primary-secondary text-primary-button py-2 rounded-xl font-bold">Hủy</button>
        </div>
      </div>
    </div>
  );
};

const MenuTypeDialog = ({ menuType, onSave, onClose }) => {
  const [name, setName] = useState(menuType?.name || '');
  const [id, setId] = useState(menuType?.id || '');

  const handleSave = () => {
    if (name && id) {
      onSave(id, name);
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary-main rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-lg font-bold text-primary-headline mb-4">
          {menuType ? 'Sửa Loại Menu' : 'Thêm Loại Menu'}
        </h3>
        <div className="space-y-4">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên loại menu (ví dụ: Menu Tết)" className="w-full p-3 rounded-xl bg-primary-secondary" />
          <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="ID loại menu (ví dụ: holiday)" className="w-full p-3 rounded-xl bg-primary-secondary" disabled={!!menuType} />
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={handleSave} className="flex-1 bg-primary-button text-primary-main py-2 rounded-xl font-bold">Lưu</button>
          <button onClick={onClose} className="flex-1 bg-primary-secondary text-primary-button py-2 rounded-xl font-bold">Hủy</button>
        </div>
      </div>
    </div>
  );
};

const TableDialog = ({ table, onSave, onClose }) => {
  const [name, setName] = useState(table?.name || '');
  const handleSave = () => {
    if (name) {
      onSave({ ...table, name });
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary-main rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-lg font-bold text-primary-headline mb-4">{table ? 'Sửa Bàn' : 'Thêm Bàn'}</h3>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên bàn (ví dụ: Bàn 31)" className="w-full p-3 bg-primary-secondary rounded-xl" />
        <div className="flex gap-3 mt-4">
          <button onClick={handleSave} className="flex-1 bg-primary-button text-primary-main py-2 rounded-xl font-bold">Lưu</button>
          <button onClick={onClose} className="flex-1 bg-primary-secondary text-primary-button py-2 rounded-xl font-bold">Hủy</button>
        </div>
      </div>
    </div>
  );
};

const AdminMenus = ({
  menuTypes, addMenuType, deleteMenuType,
  categories, addCategory, updateCategory, deleteCategory,
  tables, addTable, updateTable, deleteTable,
}) => {
  const [activeTab, setActiveTab] = useState('categories');
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showMenuTypeDialog, setShowMenuTypeDialog] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMenuType, setSelectedMenuType] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  const handleOpenCategoryDialog = (category = null) => { setSelectedCategory(category); setShowCategoryDialog(true); };
  const handleOpenMenuTypeDialog = (menuType = null) => { setSelectedMenuType(menuType); setShowMenuTypeDialog(true); };
  const handleOpenTableDialog = (table = null) => { setSelectedTable(table); setShowTableDialog(true); };

  return (
    <div className="p-4 md:p-8 h-full flex flex-col bg-primary-bg">
      {/* Header */}
      <div className="flex-shrink-0">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary-headline mb-3">Quản lý Menu & Bàn</h1>
            <p className="text-primary-paragraph text-lg">Tùy chỉnh các loại menu, danh mục món ăn và sơ đồ bàn.</p>
          </div>
          <div className="mt-4 md:mt-0 self-start md:self-center">
            {activeTab === 'categories' &&
              <div className="flex gap-2">
                <button onClick={() => handleOpenCategoryDialog()} className="bg-primary-button text-primary-main px-4 py-2 rounded-xl font-bold">Thêm Danh mục</button>
                <button onClick={() => handleOpenMenuTypeDialog()} className="bg-primary-button text-primary-main px-4 py-2 rounded-xl font-bold">Thêm Loại Menu</button>
              </div>
            }
            {activeTab === 'tables' &&
              <button onClick={() => handleOpenTableDialog()} className="bg-primary-button text-primary-main px-4 py-2 rounded-xl font-bold">Thêm Bàn</button>
            }
          </div>
        </div>
        <div className="flex gap-3 mb-8">
          <button onClick={() => setActiveTab('categories')} className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md ${activeTab === 'categories' ? 'bg-primary-button text-primary-main shadow-lg' : 'bg-primary-main text-primary-headline'}`}>Loại menu & Danh mục</button>
          <button onClick={() => setActiveTab('tables')} className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md ${activeTab === 'tables' ? 'bg-primary-button text-primary-main shadow-lg' : 'bg-primary-main text-primary-headline'}`}>Quản lý Bàn</button>
        </div>
      </div>
      
      {/* Content Body */}
      <div className="flex-1 overflow-y-auto pr-0 md:pr-4">
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-primary-main rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-primary-headline mb-4">Danh mục món ăn</h3>
              <div className="space-y-3">
                {categories.map(cat => cat.id !== 'all' && cat.id !== 'popular' && (
                  <div key={cat.id} className="flex justify-between items-center p-3 bg-primary-secondary rounded-lg">
                    <span>{cat.name}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenCategoryDialog(cat)} className="text-primary-button hover:bg-primary-button/10 rounded p-1 transition-colors"><Edit3 size={18} /></button>
                      <button onClick={() => deleteCategory(cat.id)} className="text-primary-tertiary hover:bg-primary-tertiary/10 rounded p-1 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-primary-main rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-primary-headline mb-4">Loại menu</h3>
              <div className="space-y-3">
                {menuTypes.map(mt => (
                  <div key={mt.id} className="flex justify-between items-center p-3 bg-primary-secondary rounded-lg">
                    <span>{mt.name}</span>
                    <button onClick={() => deleteMenuType(mt.id)} className="text-primary-tertiary hover:bg-primary-tertiary/10 rounded p-1 transition-colors"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'tables' && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {tables.map(table => (
              <div key={table.id} className="relative bg-primary-main rounded-2xl p-4 shadow-xl flex flex-col items-center justify-center min-h-[120px]">
                <span className="text-2xl font-bold text-primary-headline mb-2">{table.name}</span>
                {!table.isSpecial && (
                  <>
                    <button onClick={() => handleOpenTableDialog(table)} className="absolute bottom-2 left-2 text-primary-button hover:bg-primary-button/10 rounded-full p-2 transition-colors"><Edit3 size={20} /></button>
                    <button onClick={() => deleteTable(table.id)} className="absolute bottom-2 right-2 text-primary-tertiary hover:bg-primary-tertiary/10 rounded-full p-2 transition-colors"><Trash2 size={20} /></button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showCategoryDialog && <CategoryDialog category={selectedCategory} onSave={(name) => selectedCategory ? updateCategory(selectedCategory.id, name) : addCategory(name)} onClose={() => setShowCategoryDialog(false)} />}
      {showMenuTypeDialog && <MenuTypeDialog menuType={selectedMenuType} onSave={addMenuType} onClose={() => setShowMenuTypeDialog(false)} />}
      {showTableDialog && <TableDialog table={selectedTable} onSave={(tableData) => selectedTable ? updateTable(selectedTable.id, tableData) : addTable(tableData.name)} onClose={() => setShowTableDialog(false)} />}
    </div>
  );
};

export default AdminMenus;