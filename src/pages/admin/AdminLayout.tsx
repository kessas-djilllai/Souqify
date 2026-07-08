import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/client';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [storeInfo, setStoreInfo] = useState({ name: 'جاري التحميل...', newOrders: 0, plan: '...' });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // In a real scenario, fetch dashboard_stats here to get the general sidebar info
    const fetchSidebarData = async () => {
      try {
        const response = await apiClient<any>('api.php?page=admin&action=get_sidebar_data');
        if (response.status === 'success') {
          setStoreInfo({
            name: response.data.store_display_name,
            newOrders: response.data.new_orders_count,
            plan: response.data.current_plan_name
          });
        }
      } catch (err) {
        // Fallback for preview
        setStoreInfo({ name: 'متجر تجريبي', newOrders: 5, plan: 'باقة VIP' });
      }
    };
    fetchSidebarData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: 'fa-chart-pie', label: 'لوحة التحكم' },
    { path: '/admin/orders', icon: 'fa-box', label: 'الطلبيات', badge: storeInfo.newOrders },
    { path: '/admin/products', icon: 'fa-box-open', label: 'المنتجات' },
    { path: '/admin/categories', icon: 'fa-tags', label: 'التصنيفات' },
    { path: '/admin/appearance', icon: 'fa-paint-brush', label: 'المظهر' },
    { path: '/admin/coupons', icon: 'fa-ticket-alt', label: 'كوبونات الخصم' },
    { path: '/admin/shipping-zones', icon: 'fa-map-marker-alt', label: 'مناطق الشحن' },
    { path: '/admin/settings', icon: 'fa-cog', label: 'الإعدادات' },
  ];

  return (
    <div className="font-['Cairo'] bg-slate-50 min-h-screen text-slate-800 flex" dir="rtl">
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 z-40 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 h-full w-[260px] bg-white border-l border-slate-200 z-50 transition-transform duration-300 flex flex-col shadow-[rgba(0,0,0,0.05)_0px_0px_20px] lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Link to="/" className="text-xl font-black text-blue-600 flex items-center gap-2 decoration-none">
            <i className="fas fa-store"></i> Souqify
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 border-none cursor-pointer">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="font-bold text-sm text-slate-900 mb-1 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
               <i className="fas fa-store-alt"></i>
            </div>
            {storeInfo.name}
          </div>
          <div className="text-xs font-bold text-slate-500 pr-10">
            <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-md">{storeInfo.plan}</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
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
                <span className="flex-1">{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{item.badge}</span>
                ) : null}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors w-full border-none cursor-pointer">
            <i className="fas fa-sign-out-alt w-5 text-center text-lg"></i>
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-6 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 border border-slate-200 cursor-pointer">
              <i className="fas fa-bars"></i>
            </button>
            <h1 className="text-lg font-black m-0 text-slate-800">
              {navItems.find(i => location.pathname.startsWith(i.path))?.label || 'لوحة التحكم'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <Link to="/shop?store=demo" target="_blank" className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-extrabold hover:bg-slate-200 transition-colors decoration-none border border-slate-200">
               <i className="fas fa-external-link-alt"></i> مشاهدة المتجر
             </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
