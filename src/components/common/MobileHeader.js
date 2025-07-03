import React from 'react';
import { Menu, ShoppingCart, ArrowLeft } from 'lucide-react';

const MobileHeader = ({ onToggleSidebar, onToggleOrderPanel, orderItemCount, activeSection, setActiveSection }) => {
  const getTitle = () => {
    if (activeSection === 'tables') return 'Sơ đồ bàn';
    if (activeSection === 'menu') return 'Thực đơn';
    if (activeSection === 'dashboard') return 'Báo cáo';
    if (activeSection === 'expenses') return 'Chi tiêu';
    return 'CASHAA';
  };

  return (
    <div className="md:hidden bg-primary-main p-4 flex justify-between items-center shadow-lg sticky top-0 z-40">
      {/* Nút bên trái: Quay lại hoặc Mở Menu */}
      {activeSection === 'tables' ? (
        <button onClick={onToggleSidebar} className="text-primary-headline p-2">
          <Menu size={24} />
        </button>
      ) : (
        <button onClick={() => setActiveSection('tables')} className="text-primary-headline p-2">
          <ArrowLeft size={24} />
        </button>
      )}

      {/* Tiêu đề */}
      <h1 className="text-xl font-bold text-primary-headline">{getTitle()}</h1>

      {/* Nút giỏ hàng */}
      <button onClick={onToggleOrderPanel} className="text-primary-headline p-2 relative">
        <ShoppingCart size={24} />
        {orderItemCount > 0 && (
          <span className="absolute -top-1 -right-1 block h-5 w-5 rounded-full bg-primary-tertiary text-white text-xs flex items-center justify-center border-2 border-primary-main">
            {orderItemCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default MobileHeader;