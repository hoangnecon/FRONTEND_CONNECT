// src/admin/AdminBankSettings.js
import React from 'react';
import BankSearchDropdown from './BankSearchDropdown';

const AdminBankSettings = ({ settings, setSettings, banks, loading }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankSelect = (bin) => {
    setSettings((prev) => ({ ...prev, bin }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary-headline mb-2">Cài đặt Tài khoản Ngân hàng</h2>
      <p className="text-primary-paragraph mb-6">
        Thông tin này sẽ được sử dụng để tạo mã QR cho việc thanh toán chuyển khoản.
      </p>
      <div className="bg-primary-main rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary-paragraph mb-2">
            Ngân hàng
          </label>
          <BankSearchDropdown
            banks={banks}
            loading={loading}
            selectedBin={settings.bin}
            onSelect={handleBankSelect}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-paragraph mb-2">Số tài khoản</label>
          <input
            type="text"
            name="accountNumber"
            value={settings.accountNumber}
            onChange={handleChange}
            placeholder="Nhập số tài khoản của bạn"
            className="w-full p-3 bg-primary-secondary rounded-xl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-paragraph mb-2">Tên chủ tài khoản</label>
          <input
            type="text"
            name="accountName"
            value={settings.accountName}
            onChange={handleChange}
            placeholder="Tên chủ tài khoản (không dấu)"
            className="w-full p-3 bg-primary-secondary rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminBankSettings;