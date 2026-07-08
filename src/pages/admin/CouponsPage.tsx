import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: '', code: '', discount_type: 'percent', discount_value: '', usage_limit: '0', expiry_date: '' });

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient<any>('api.php?page=admin&action=get_coupons');
      if (res.status === 'success') {
        setCoupons(res.data);
      }
    } catch (e) {
      console.error(e);
      setCoupons([{ id: 1, code: 'WINTER20', discount_type: 'percent', discount_value: 20, usage_limit: 100, times_used: 5 }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('action', formData.id ? 'edit_coupon' : 'add_coupon');
      if (formData.id) fd.append('coupon_id', formData.id);
      fd.append('code', formData.code);
      fd.append('discount_type', formData.discount_type);
      fd.append('discount_value', formData.discount_value);
      fd.append('usage_limit', formData.usage_limit);
      fd.append('expiry_date', formData.expiry_date);
      
      await apiClient('api.php?page=admin', { method: 'POST', body: fd as any });
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCoupon = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الكوبون؟')) return;
    try {
      const fd = new FormData();
      fd.append('action', 'delete_coupon');
      fd.append('coupon_id', id.toString());
      await apiClient('api.php?page=admin', { method: 'POST', body: fd as any });
      fetchCoupons();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-2 md:p-6 animate-[fadeInUp_0.4s_ease-out]" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-slate-800"><i className="fas fa-ticket-alt text-blue-600 ml-2"></i> كوبونات الخصم</h1>
        <button onClick={() => { setFormData({id:'', code:'', discount_type:'percent', discount_value:'', usage_limit:'0', expiry_date:''}); setIsModalOpen(true); }} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm">
          <i className="fas fa-plus ml-1"></i> إضافة كوبون
        </button>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
        <table className="w-full text-center whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 font-black text-xs border-b border-slate-200">
            <tr>
              <th className="p-4 text-right">رمز الكوبون</th>
              <th className="p-4">نوع الخصم</th>
              <th className="p-4">القيمة</th>
              <th className="p-4">مرات الاستعمال</th>
              <th className="p-4">الحد الأقصى</th>
              <th className="p-4">إجراء</th>
            </tr>
          </thead>
          <tbody className="text-sm font-bold text-slate-700 divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={6} className="p-10 text-center text-blue-600"><i className="fas fa-spinner fa-spin text-2xl"></i></td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan={6} className="p-10 text-center text-slate-400 font-bold">لا توجد كوبونات</td></tr>
            ) : (
              coupons.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-right"><span className="bg-slate-100 font-mono font-black text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 tracking-wider">{c.code}</span></td>
                  <td className="p-4">{c.discount_type === 'percent' ? 'نسبة مئوية' : 'مبلغ ثابت'}</td>
                  <td className="p-4"><span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-black dir-ltr inline-block">{c.discount_type === 'percent' ? `${c.discount_value}%` : `${c.discount_value} د.ج`}</span></td>
                  <td className="p-4 text-slate-500">{c.times_used || 0}</td>
                  <td className="p-4">{c.usage_limit == 0 ? <i className="fas fa-infinity text-slate-400"></i> : c.usage_limit}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => { setFormData({id: c.id, code: c.code, discount_type: c.discount_type, discount_value: c.discount_value, usage_limit: c.usage_limit, expiry_date: c.expiry_date || ''}); setIsModalOpen(true); }} className="bg-blue-50 text-blue-600 w-8 h-8 rounded-lg text-sm hover:bg-blue-100 transition-colors"><i className="fas fa-pen"></i></button>
                      <button onClick={() => deleteCoupon(c.id)} className="bg-red-50 text-red-500 w-8 h-8 rounded-lg text-sm hover:bg-red-100 transition-colors"><i className="fas fa-trash"></i></button>
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
              <h3 className="text-lg font-black text-slate-800 m-0">{formData.id ? 'تعديل الكوبون' : 'إضافة كوبون'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 text-right">
                <label className="block text-xs font-black text-slate-600 mb-2">رمز الكوبون</label>
                <input type="text" className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-black font-mono text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-colors dir-ltr text-center uppercase tracking-widest" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} required placeholder="WINTER20" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-right">
                  <label className="block text-xs font-black text-slate-600 mb-2">نوع الخصم</label>
                  <select className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-colors" value={formData.discount_type} onChange={e => setFormData({...formData, discount_type: e.target.value})}>
                    <option value="percent">نسبة (%)</option>
                    <option value="fixed">مبلغ (د.ج)</option>
                  </select>
                </div>
                <div className="text-right">
                  <label className="block text-xs font-black text-slate-600 mb-2">القيمة</label>
                  <input type="number" className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-colors dir-ltr" value={formData.discount_value} onChange={e => setFormData({...formData, discount_value: e.target.value})} required />
                </div>
              </div>
              <div className="mb-6 text-right">
                <label className="block text-xs font-black text-slate-600 mb-2">حد الاستخدام (0 = مفتوح)</label>
                <input type="number" className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-colors dir-ltr" value={formData.usage_limit} onChange={e => setFormData({...formData, usage_limit: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white rounded-xl py-3 font-black hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2">
                <i className="fas fa-save"></i> حفظ الكوبون
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
