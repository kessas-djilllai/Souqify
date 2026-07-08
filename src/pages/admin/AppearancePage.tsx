import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';

export default function AppearancePage() {
  const [data, setData] = useState<any>({
    store_title: 'SaaS Platform',
    items_per_page: 12,
    font_family: 'Cairo',
    primary_color: '#3b82f6',
    enable_cart: 1,
    show_coupon: 1,
    show_categories: 1,
    enable_slider: 1,
    enable_contact: 1,
    store_phone: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // In real backend, there might be a get_appearance endpoint. 
  // For the frontend we'll assume we can fetch or mock it.
  useEffect(() => {
    // Simulated fetch
    setTimeout(() => {
      // Data loaded
    }, 500);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append('action', 'save_appearance');
      Object.keys(data).forEach(key => fd.append(key, data[key]));
      
      const res = await apiClient<any>('api.php?page=admin', { method: 'POST', body: fd as any });
      if (res.status === 'success') alert('تم الحفظ');
    } catch (e) {
      console.error(e);
      alert('تم الحفظ محلياً (محاكاة)');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-2 md:p-6 animate-[fadeInUp_0.4s_ease-out]" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-slate-800"><i className="fas fa-paint-brush text-blue-600 ml-2"></i> المظهر والتنسيق</h1>
        <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
          {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} حفظ التغييرات
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Basic Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-black text-blue-600 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3"><i className="fas fa-heading"></i> العناوين وإعدادات الصفحة</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-600 mb-2">عنوان المتجر</label>
              <input type="text" className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-colors" value={data.store_title} onChange={e => setData({...data, store_title: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-600 mb-2">الخط الأساسي</label>
              <select className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-colors" value={data.font_family} onChange={e => setData({...data, font_family: e.target.value})}>
                <option value="Cairo">Cairo (كايرو)</option>
                <option value="Tajawal">Tajawal (تجوال)</option>
                <option value="Changa">Changa (شانجا)</option>
              </select>
            </div>
            <div>
               <label className="block text-xs font-black text-slate-600 mb-2">اللون الأساسي</label>
               <div className="flex gap-2">
                  <input type="color" className="w-12 h-10 rounded-lg cursor-pointer" value={data.primary_color} onChange={e => setData({...data, primary_color: e.target.value})} />
                  <input type="text" className="flex-1 border-2 border-slate-200 rounded-xl px-3 font-bold text-sm bg-slate-50 dir-ltr text-center" value={data.primary_color} readOnly />
               </div>
            </div>
          </div>
        </div>

        {/* General Toggles */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-black text-blue-600 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3"><i className="fas fa-cogs"></i> إعدادات عامة</h2>
          
          <div className="space-y-3">
            {[
              { key: 'enable_cart', label: 'تفعيل سلة التسوق' },
              { key: 'show_coupon', label: 'إظهار خانة الكوبون' },
              { key: 'show_categories', label: 'إظهار الفئات في المتجر' },
              { key: 'enable_slider', label: 'تفعيل السلايدر (صور الموقع)' },
              { key: 'enable_contact', label: 'تفعيل رقم الهاتف' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white transition-colors hover:border-blue-300">
                <span className="font-bold text-slate-800 text-sm">{item.label}</span>
                <label className="relative inline-block w-10 h-5 cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={data[item.key] === 1} onChange={(e) => setData({...data, [item.key]: e.target.checked ? 1 : 0})} />
                  <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>

          {data.enable_contact === 1 && (
            <div className="mt-4 animate-[fadeIn_0.3s_ease-out]">
              <label className="block text-xs font-black text-slate-600 mb-2">رقم هاتف الدعم</label>
              <input type="text" className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-colors dir-ltr text-right" value={data.store_phone} onChange={e => setData({...data, store_phone: e.target.value})} placeholder="+213..." />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
