import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';

export default function ShippingZonesPage() {
  const [zones, setZones] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', municipalities: '', home_price: '', desk_price: '' });

  const fetchZones = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient<any>('api.php?page=admin&action=get_shipping_zones');
      if (res.status === 'success') {
        setZones(res.data);
      }
    } catch (e) {
      console.error(e);
      setZones([{ id: 1, name: 'الجزائر العاصمة', home_price: 500, desk_price: 300, is_active: 1 }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('action', formData.id ? 'edit_shipping_zone' : 'add_shipping_zone');
      if (formData.id) fd.append('zone_id', formData.id);
      fd.append('name', formData.name);
      fd.append('municipalities', formData.municipalities);
      fd.append('home_price', formData.home_price);
      fd.append('desk_price', formData.desk_price);
      
      await apiClient('api.php?page=admin', { method: 'POST', body: fd as any });
      setIsModalOpen(false);
      fetchZones();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteZone = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه المنطقة؟')) return;
    try {
      const fd = new FormData();
      fd.append('action', 'delete_shipping_zone');
      fd.append('zone_id', id.toString());
      await apiClient('api.php?page=admin', { method: 'POST', body: fd as any });
      fetchZones();
    } catch (e) {
      console.error(e);
    }
  };
  
  const toggleStatus = async (id: number, isActive: number) => {
    try {
      const fd = new FormData();
      fd.append('action', 'toggle_zone_status');
      fd.append('zone_id', id.toString());
      fd.append('status', isActive ? '0' : '1');
      await apiClient('api.php?page=admin', { method: 'POST', body: fd as any });
      fetchZones();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="p-2 md:p-6 animate-[fadeInUp_0.4s_ease-out]" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-slate-800"><i className="fas fa-truck text-blue-600 ml-2"></i> مناطق الشحن</h1>
        <button onClick={() => { setFormData({id:'', name:'', municipalities:'', home_price:'', desk_price:''}); setIsModalOpen(true); }} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm">
          <i className="fas fa-plus ml-1"></i> إضافة منطقة
        </button>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
        <table className="w-full text-center whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 font-black text-xs border-b border-slate-200">
            <tr>
              <th className="p-4 text-right">إسم المنطقة</th>
              <th className="p-4">شحن المنزل</th>
              <th className="p-4">شحن المكتب</th>
              <th className="p-4">الطلبات</th>
              <th className="p-4">مفعل</th>
              <th className="p-4">إجراء</th>
            </tr>
          </thead>
          <tbody className="text-sm font-bold text-slate-700 divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={6} className="p-10 text-center text-blue-600"><i className="fas fa-spinner fa-spin text-2xl"></i></td></tr>
            ) : zones.length === 0 ? (
              <tr><td colSpan={6} className="p-10 text-center text-slate-400 font-bold">لا توجد مناطق شحن</td></tr>
            ) : (
              zones.map(z => (
                <tr key={z.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-right text-slate-900 font-black">{z.name}</td>
                  <td className="p-4 text-blue-600 dir-ltr">{z.home_price} د.ج</td>
                  <td className="p-4 text-emerald-600 dir-ltr">{z.desk_price} د.ج</td>
                  <td className="p-4 text-slate-500"><span className="bg-slate-100 px-3 py-1 rounded-md">{z.total_orders || 0} طلب</span></td>
                  <td className="p-4">
                    <label className="relative inline-block w-10 h-5 cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={parseInt(z.is_active) === 1} onChange={() => toggleStatus(z.id, parseInt(z.is_active))} />
                      <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => { setFormData({id: z.id, name: z.name, municipalities: z.municipalities || '', home_price: z.home_price, desk_price: z.desk_price}); setIsModalOpen(true); }} className="bg-blue-50 text-blue-600 w-8 h-8 rounded-lg text-sm hover:bg-blue-100 transition-colors"><i className="fas fa-pen"></i></button>
                      <button onClick={() => deleteZone(z.id)} className="bg-red-50 text-red-500 w-8 h-8 rounded-lg text-sm hover:bg-red-100 transition-colors"><i className="fas fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-[scaleUp_0.3s_ease-out]">
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-800 m-0">{formData.id ? 'تعديل المنطقة' : 'إضافة منطقة'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 text-right">
                <label className="block text-xs font-black text-slate-600 mb-2">إسم الولاية</label>
                <input type="text" className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-colors" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="الجزائر" />
              </div>
              <div className="mb-4 text-right">
                <label className="block text-xs font-black text-slate-600 mb-2">البلديات (افصل بفاصلة)</label>
                <input type="text" className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-colors" value={formData.municipalities} onChange={e => setFormData({...formData, municipalities: e.target.value})} placeholder="الجزائر الوسطى, باب الواد..." />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-right">
                  <label className="block text-xs font-black text-slate-600 mb-2">توصيل المنزل</label>
                  <input type="number" className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-colors dir-ltr" value={formData.home_price} onChange={e => setFormData({...formData, home_price: e.target.value})} required placeholder="500" />
                </div>
                <div className="text-right">
                  <label className="block text-xs font-black text-slate-600 mb-2">توصيل المكتب</label>
                  <input type="number" className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-colors dir-ltr" value={formData.desk_price} onChange={e => setFormData({...formData, desk_price: e.target.value})} required placeholder="300" />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white rounded-xl py-3 font-black hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2">
                <i className="fas fa-save"></i> حفظ المنطقة
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
