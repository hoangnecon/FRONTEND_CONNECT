// src/admin/AdminColorSettings.js
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { themes } from '../data/themes';

const AdminColorSettings = ({ currentTheme, onThemeChange }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-primary-headline mb-2">Quản lý Giao diện</h2>
      <p className="text-primary-paragraph mb-6">Chọn một bộ màu để áp dụng cho toàn bộ hệ thống.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(themes).map(([themeKey, theme]) => (
          <div
            key={themeKey}
            onClick={() => onThemeChange(themeKey)}
            className={`rounded-3xl p-6 shadow-xl cursor-pointer border-4 transition-all ${
              currentTheme === themeKey ? 'border-primary-button' : 'border-transparent hover:border-primary-highlight'
            }`}
            style={{ backgroundColor: theme.colors['--primary-bg'] }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold" style={{ color: theme.colors['--primary-headline'] }}>
                {theme.name}
              </h3>
              {currentTheme === themeKey && <CheckCircle className="text-primary-button" />}
            </div>
            <div className="flex gap-2">
              <div className="w-1/4 h-10 rounded-lg" style={{ backgroundColor: theme.colors['--primary-button'] }}></div>
              <div className="w-1/4 h-10 rounded-lg" style={{ backgroundColor: theme.colors['--primary-tertiary'] }}></div>
              <div className="w-1/4 h-10 rounded-lg" style={{ backgroundColor: theme.colors['--primary-paragraph'] }}></div>
              <div className="w-1/4 h-10 rounded-lg" style={{ backgroundColor: theme.colors['--primary-secondary'] }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminColorSettings;