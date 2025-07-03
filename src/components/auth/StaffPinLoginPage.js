// src/components/auth/StaffPinLoginPage.js
import React, { useState } from 'react';
import { User, KeyRound } from 'lucide-react';

const StaffPinLoginPage = ({ staffList, handleStaffLogin, handleBusinessLogout }) => {
  const [selectedStaffId, setSelectedStaffId] = useState(staffList[0]?.id || '');
  const [pin, setPin] = useState('');

  const handlePinClick = (digit) => {
    if (pin.length < 4) {
      setPin(pin + digit);
    }
  };

  const handleClear = () => {
    setPin('');
  };

  const handleLogin = () => {
    if (!selectedStaffId) {
        alert('Vui lòng chọn nhân viên.');
        return;
    }
    if (pin.length !== 4) {
        alert('Vui lòng nhập đủ 4 số PIN.');
        return;
    }
    handleStaffLogin(selectedStaffId, pin);
    setPin(''); // Clear PIN after attempt
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-sm shadow-2xl text-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Chọn Tài khoản</h1>
          <p className="text-gray-400 text-sm">Chọn tên của bạn và nhập mã PIN để bắt đầu.</p>
        </div>
        
        <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nhân viên</label>
            <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            >
                {staffList.map(staff => (
                    <option key={staff.id} value={staff.id}>{staff.name}</option>
                ))}
            </select>
        </div>

        <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Mã PIN</label>
            <div className="w-full p-3 h-14 bg-gray-700 border border-gray-600 rounded-lg flex items-center justify-center text-2xl tracking-[1em]">
                {pin.split('').map((_, i) => <span key={i}>*</span>)}
            </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'Xóa', 0, 'Vào'].map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (typeof item === 'number') handlePinClick(item.toString());
                if (item === 'Xóa') handleClear();
                if (item === 'Vào') handleLogin();
              }}
              className={`py-4 rounded-lg text-xl font-bold transition-colors ${item === 'Vào' ? 'col-span-1 bg-orange-600 hover:bg-orange-700' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {item}
            </button>
          ))}
        </div>
        
        <div className="text-center">
             <button onClick={handleBusinessLogout} className="text-gray-400 hover:text-white text-sm">Quay lại đăng nhập doanh nghiệp</button>
        </div>
      </div>
    </div>
  );
};

export default StaffPinLoginPage;