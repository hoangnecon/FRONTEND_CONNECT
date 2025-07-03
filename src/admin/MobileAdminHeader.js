import React from 'react';
import { Menu, LogOut } from 'lucide-react';

const MobileAdminHeader = ({ onToggleSidebar, onLogout, currentSectionName }) => {
  return (
    <div className="md:hidden bg-primary-main p-4 flex justify-between items-center shadow-lg sticky top-0 z-40">
      <button onClick={onToggleSidebar} className="text-primary-headline p-2">
        <Menu size={24} />
      </button>
      <h1 className="text-xl font-bold text-primary-headline">{currentSectionName}</h1>
      <button onClick={onLogout} className="text-primary-tertiary p-2">
        <LogOut size={24} />
      </button>
    </div>
  );
};

export default MobileAdminHeader;