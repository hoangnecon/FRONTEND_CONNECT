import React from 'react';
import {
  BarChart3,
  Package,
  UtensilsCrossed,
  Settings,
  LogOut,
  TrendingDown,
  Users,
  TrendingUp,
} from 'lucide-react';

const AdminSidebar = ({ adminSection, setAdminSection, handleLogout }) => {
  return (
    <div className="w-20 sidebar-gradient flex flex-col items-center py-8 shadow-2xl h-full">
      <div className="flex flex-col space-y-4 flex-1">
        <button
          onClick={() => setAdminSection('dashboard')}
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group ${
            adminSection === 'dashboard' ? 'text-white shadow-lg' : 'text-white hover:text-white hover:bg-primary-highlight'
          }`}
        >
          <BarChart3 size={22} />
          {adminSection === 'dashboard' && (<div className="absolute -right-8 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full hidden md:block" />)}
        </button>

        <button
          onClick={() => setAdminSection('staff_performance')}
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group ${
            adminSection === 'staff_performance' ? 'text-white shadow-lg' : 'text-white hover:text-white hover:bg-primary-highlight'
          }`}
        >
          <TrendingUp size={22} />
          {adminSection === 'staff_performance' && (<div className="absolute -right-8 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full hidden md:block" />)}
        </button>

        <button
          onClick={() => setAdminSection('expenses')}
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group ${
            adminSection === 'expenses' ? 'text-white shadow-lg' : 'text-white hover:text-white hover:bg-primary-highlight'
          }`}
        >
          <TrendingDown size={22} />
          {adminSection === 'expenses' && (<div className="absolute -right-8 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full hidden md:block" />)}
        </button>

        <button
          onClick={() => setAdminSection('menus')}
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group ${
            adminSection === 'menus' ? 'text-white shadow-lg' : 'text-white hover:text-white hover:bg-primary-highlight'
          }`}
        >
          <Package size={22} />
          {adminSection === 'menus' && (<div className="absolute -right-8 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full hidden md:block" />)}
        </button>

        <button
          onClick={() => setAdminSection('items')}
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group ${
            adminSection === 'items' ? 'text-white shadow-lg' : 'text-white hover:text-white hover:bg-primary-highlight'
          }`}
        >
          <UtensilsCrossed size={22} />
          {adminSection === 'items' && (<div className="absolute -right-8 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full hidden md:block" />)}
        </button>
        
        <button
          onClick={() => setAdminSection('staff_management')}
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group ${
            adminSection === 'staff_management' ? 'text-white shadow-lg' : 'text-white hover:text-white hover:bg-primary-highlight'
          }`}
        >
          <Users size={22} />
          {adminSection === 'staff_management' && (<div className="absolute -right-8 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full hidden md:block" />)}
        </button>
      </div>

      <div className="flex flex-col space-y-4">
        <button
          onClick={() => setAdminSection('settings')}
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group ${
            adminSection === 'settings' ? 'text-white shadow-lg' : 'text-white hover:text-white hover:bg-primary-highlight'
          }`}
        >
          <Settings size={22} />
          {adminSection === 'settings' && (<div className="absolute -right-8 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full hidden md:block" />)}
        </button>
        <button
          onClick={handleLogout}
          className="w-14 h-14 rounded-2xl text-white/50 hover:text-white/80 hover:bg-primary-highlight flex items-center justify-center transition-all duration-300"
        >
          <LogOut size={22} />
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;