// src/cashier/CashierExpenses.js
import React, { useState, useMemo } from 'react';
import { Plus, DollarSign } from 'lucide-react';

const CashierExpenses = ({ expenses, addExpense }) => {
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleAddExpense = () => {
    if (newExpense.name && newExpense.amount > 0) {
      addExpense({
        id: `EXP${Date.now()}`,
        ...newExpense,
        amount: parseFloat(newExpense.amount),
      });
      setShowAddExpenseDialog(false);
      setNewExpense({
        name: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
      });
    } else {
      alert('Vui lòng nhập tên và số tiền chi tiêu.');
    }
  };

  const todayExpenses = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return (expenses[today] || []).sort((a, b) => b.id.localeCompare(a.id));
  }, [expenses]);

  return (
    <div className="p-8 h-full flex flex-col bg-primary-bg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary-headline mb-3">Thêm Chi Tiêu</h1>
          <p className="text-primary-paragraph text-lg">Ghi lại các khoản chi trong ngày.</p>
        </div>
        <button
          onClick={() => setShowAddExpenseDialog(true)}
          className="bg-primary-button text-primary-main px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-highlight transition-colors shadow-lg"
        >
          <Plus size={20} /> Thêm Mới
        </button>
      </div>

      <div className="bg-primary-main rounded-3xl p-6 shadow-xl flex-1 overflow-y-auto">
        <h3 className="text-xl font-bold text-primary-headline mb-4">Các khoản chi hôm nay</h3>
        <div className="space-y-3">
          {todayExpenses.length > 0 ? (
            todayExpenses.map(expense => (
              <div key={expense.id} className="flex items-center justify-between p-3 bg-primary-secondary rounded-xl">
                <span className="font-medium">{expense.name}</span>
                <span className="font-bold text-red-500">{expense.amount.toLocaleString('vi-VN')}đ</span>
              </div>
            ))
          ) : (
            <p className="text-primary-paragraph text-center py-8">Chưa có khoản chi nào hôm nay.</p>
          )}
        </div>
      </div>

      {showAddExpenseDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-primary-main rounded-2xl p-6 m-4 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-primary-headline mb-4">Thêm Chi Tiêu Mới</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-paragraph mb-2">Tên khoản chi</label>
                <input
                  type="text"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                  className="w-full p-3 bg-primary-secondary rounded-xl"
                  placeholder="ví dụ: Mua rau củ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-paragraph mb-2">Số tiền</label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full p-3 bg-primary-secondary rounded-xl"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-paragraph mb-2">Ngày</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="w-full p-3 bg-primary-secondary rounded-xl"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAddExpense} className="flex-1 bg-primary-button text-primary-main py-2 rounded-xl font-bold">Thêm</button>
              <button onClick={() => setShowAddExpenseDialog(false)} className="flex-1 bg-primary-secondary text-primary-button py-2 rounded-xl font-bold">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierExpenses;