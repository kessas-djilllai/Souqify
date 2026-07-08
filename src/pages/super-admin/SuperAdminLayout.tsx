import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

export default function SuperAdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('super_admin_token');
    navigate('/super-admin/login');
  };

  const navItems = [
    { path: '/super-admin/accounts', icon: 'fa-users-cog', label: 'الحسابات' },
    { path: '/super-admin/plans', icon: 'fa-box-open', label: 'باقات الاشتراك' },
    { path: '/super-admin/messages', icon: 'fa-envelope', label: 'المراسلات' },
  ];

  return (
    <div className="font-['Cairo'] bg-slate-50 min-h-screen text-slate-800 flex" dir="rtl">
      {/* Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 z-40 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 h-full w-[260px] bg-white border-l border-slate-200 z-50 transition-transform duration-300 flex flex-col shadow-[rgba(0,0,0,0.05)_0px_0px_20px] lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-slate-100 text-center">
          <div className="text-2xl font-black text-blue-600 border-b border-dashed border-slate-200 pb-4">
            مدير المنصة
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all decoration-none ${isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <i className={`fas ${item.icon} w-5 text-center text-lg ${isActive ? 'text-blue-600' : 'text-slate-400'}`}></i>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors w-full border-none cursor-pointer">
            <i className="fas fa-sign-out-alt w-5 text-center text-lg"></i>
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-slate-50 h-16 flex items-center justify-between px-4 lg:px-6 shrink-0 z-10 lg:hidden">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-600 border border-slate-200 cursor-pointer shadow-sm">
              <i className="fas fa-bars"></i>
            </button>
            <h1 className="text-lg font-black m-0 text-slate-800">
              {navItems.find(i => location.pathname.startsWith(i.path))?.label || 'لوحة التحكم'}
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50 relative">
           {/* Top Background Decoration */}
           <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-600/5 to-transparent -z-10 pointer-events-none"></div>
           
           <Outlet />
        </main>
      </div>
    </div>
  );
}
