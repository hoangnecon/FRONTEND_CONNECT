// src/admin/AdminSettingsPage.js
import React, { useState } from 'react';
import AdminPrintSettings from './AdminPrintSettings';
import AdminColorSettings from './AdminColorSettings';
import AdminDiscountSettings from './AdminDiscountSettings';
import AdminBankSettings from './AdminBankSettings';

const AdminSettingsPage = ({
  initialSettings,
  currentTheme,
  onThemeChange,
  quickDiscountOptions,
  addDiscountOption,
  updateDiscountOption,
  deleteDiscountOption,
  bankSettings,
  setBankSettings,
  bankList,
  bankListLoading, // Đảm bảo prop này được nhận
}) => {
  const [activeTab, setActiveTab] = useState('print');

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto bg-primary-bg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-headline mb-3">Cài đặt</h1>
          <p className="text-primary-paragraph text-lg">Tùy chỉnh hệ thống và giao diện.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setActiveTab('print')}
          className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md ${
            activeTab === 'print'
              ? 'bg-primary-button text-primary-main shadow-lg'
              : 'bg-primary-main text-primary-headline hover:bg-primary-highlight'
          }`}
        >
          Cài đặt in
        </button>
        <button
          onClick={() => setActiveTab('color')}
          className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md ${
            activeTab === 'color'
              ? 'bg-primary-button text-primary-main shadow-lg'
              : 'bg-primary-main text-primary-headline hover:bg-primary-highlight'
          }`}
        >
          Quản lý Giao diện
        </button>
        <button
          onClick={() => setActiveTab('discount')}
          className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md ${
            activeTab === 'discount'
              ? 'bg-primary-button text-primary-main shadow-lg'
              : 'bg-primary-main text-primary-headline hover:bg-primary-highlight'
          }`}
        >
          Cài đặt giảm giá
        </button>
        <button
          onClick={() => setActiveTab('bank')}
          className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md ${
            activeTab === 'bank'
              ? 'bg-primary-button text-primary-main shadow-lg'
              : 'bg-primary-main text-primary-headline hover:bg-primary-highlight'
          }`}
        >
          Cài đặt Ngân hàng
        </button>
      </div>

      <div>
        {activeTab === 'print' && <AdminPrintSettings bankSettings={bankSettings} banks={bankList} bankListLoading={bankListLoading} />}
        {activeTab === 'color' && <AdminColorSettings currentTheme={currentTheme} onThemeChange={onThemeChange} />}
        {activeTab === 'discount' && (
          <AdminDiscountSettings
            options={quickDiscountOptions}
            addOption={addDiscountOption}
            updateOption={updateDiscountOption}
            deleteOption={deleteDiscountOption}
          />
        )}
        {activeTab === 'bank' && (
          <AdminBankSettings
            settings={bankSettings}
            setSettings={setBankSettings}
            banks={bankList}
            loading={bankListLoading}
          />
        )}
      </div>
    </div>
  );
};

export default AdminSettingsPage;