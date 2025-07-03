import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';

const AdminExpenses = ({ expenses, revenue, addExpense }) => {
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

  const totalRevenue = useMemo(() => {
    return Object.values(revenue).flat().reduce((sum, order) => sum + order.total, 0);
  }, [revenue]);

  const totalExpenses = useMemo(() => {
    return Object.values(expenses).flat().reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);
  
  const profit = totalRevenue - totalExpenses;

  const allExpenses = useMemo(() => {
    return Object.values(expenses).flat().sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses]);

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto bg-primary-bg">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-headline mb-3">Quản lý Thu Chi</h1>
          <p className="text-primary-paragraph text-lg">So sánh doanh thu và chi tiêu của bạn.</p>
        </div>
        <button
          onClick={() => setShowAddExpenseDialog(true)}
          className="bg-primary-button text-primary-main px-4 py-2 mt-4 md:mt-0 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-highlight transition-colors shadow-lg self-start md:self-center"
        >
          <Plus size={20} /> Thêm Chi Tiêu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-primary-main rounded-3xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-primary-headline">Tổng Doanh Thu</h3>
          <p className="text-2xl md:text-3xl font-bold text-green-500">{totalRevenue.toLocaleString('vi-VN')}đ</p>
        </div>
        <div className="bg-primary-main rounded-3xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-primary-headline">Tổng Chi Tiêu</h3>
          <p className="text-2xl md:text-3xl font-bold text-red-500">{totalExpenses.toLocaleString('vi-VN')}đ</p>
        </div>
        <div className="bg-primary-main rounded-3xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-primary-headline">Lợi Nhuận</h3>
          <p className={`text-2xl md:text-3xl font-bold ${profit >= 0 ? 'text-blue-500' : 'text-red-500'}`}>{profit.toLocaleString('vi-VN')}đ</p>
        </div>
      </div>
      
      <div className="bg-primary-main rounded-3xl p-4 md:p-6 shadow-xl">
        <h3 className="text-xl font-bold text-primary-headline mb-4">Lịch sử chi tiêu</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead>
              <tr className="border-b">
                <th className="p-2">Ngày</th>
                <th className="p-2">Tên khoản chi</th>
                <th className="p-2 text-right">Số tiền</th>
              </tr>
            </thead>
            <tbody>
              {allExpenses.map(expense => (
                <tr key={expense.id} className="border-b">
                  <td className="p-2">{expense.date}</td>
                  <td className="p-2">{expense.name}</td>
                  <td className="p-2 text-right text-red-500">{expense.amount.toLocaleString('vi-VN')}đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddExpenseDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-primary-main rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-primary-headline mb-4">Thêm Chi Tiêu Mới</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-paragraph mb-2">Tên khoản chi</label>
                <input
                  type="text"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                  className="w-full p-3 bg-primary-secondary rounded-xl"
                  placeholder="ví dụ: Trả tiền điện"
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

export default AdminExpenses;