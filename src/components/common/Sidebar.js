import React, { useState } from 'react';
import {
  Home,
  UtensilsCrossed,
  BarChart3,
  LogOut,
  User,
  TrendingDown,
  Power,
} from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection, handleStaffLogout, handleBusinessLogout, loggedInStaff, onItemClick }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSectionClick = (section) => {
    setActiveSection(section);
    if (onItemClick) {
      onItemClick(); // Gọi callback để đóng sidebar trên mobile
    }
  };

  return (
    <div className="w-20 sidebar-gradient flex flex-col items-center py-8 shadow-2xl h-full">
      <div className="flex flex-col space-y-4 flex-1">
        <button
          onClick={() => handleSectionClick('tables')}
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group ${
            activeSection === 'tables'
              ? 'text-white shadow-lg'
              : 'text-white hover:text-white hover:bg-primary-highlight'
          }`}
        >
          <Home size={22} />
          {activeSection === 'tables' && (
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full hidden md:block" />
          )}
        </button>

        <button
          onClick={() => handleSectionClick('menu')}
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group ${
            activeSection === 'menu'
              ? 'text-white shadow-lg'
              : 'text-white hover:text-white hover:bg-primary-highlight'
          }`}
        >
          <UtensilsCrossed size={22} />
          {activeSection === 'menu' && (
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full hidden md:block" />
          )}
        </button>

        <button
          onClick={() => handleSectionClick('dashboard')}
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group ${
            activeSection === 'dashboard'
              ? 'text-white shadow-lg'
              : 'text-white hover:text-white hover:bg-primary-highlight'
          }`}
        >
          <BarChart3 size={22} />
          {activeSection === 'dashboard' && (
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full hidden md:block" />
          )}
        </button>

        <button
          onClick={() => handleSectionClick('expenses')}
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group ${
            activeSection === 'expenses'
              ? 'text-white shadow-lg'
              : 'text-white hover:text-white hover:bg-primary-highlight'
          }`}
        >
          <TrendingDown size={22} />
          {activeSection === 'expenses' && (
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full hidden md:block" />
          )}
        </button>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-14 h-14 rounded-full bg-white/20 text-white flex items-center justify-center"
          >
            <User size={22} />
          </button>
          {userMenuOpen && (
            <div className="absolute bottom-20 left-0 w-60 bg-primary-main rounded-xl shadow-2xl p-2 z-10">
              <div className="p-2 border-b border-primary-secondary">
                <p className="font-bold text-primary-headline">{loggedInStaff?.name}</p>
                <p className="text-xs text-primary-paragraph">{loggedInStaff?.email}</p>
              </div>
              <button
                onClick={() => {
                  handleStaffLogout();
                  setUserMenuOpen(false);
                }}
                className="w-full text-left p-2 rounded-lg hover:bg-primary-secondary flex items-center gap-2"
              >
                <LogOut size={16}/> Đổi tài khoản
              </button>
            </div>
          )}
        </div>
        <button
          onClick={handleBusinessLogout}
          className="w-14 h-14 rounded-2xl text-white/50 hover:text-white/80 hover:bg-primary-highlight flex items-center justify-center transition-all duration-300"
        >
          <Power size={22} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;