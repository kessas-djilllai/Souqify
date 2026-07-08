import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', slug: '' });

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient<any>('api.php?page=admin&action=get_categories');
      if (res.status === 'success') {
        setCategories(res.data);
      }
    } catch (e) {
      console.error(e);
      setCategories([{ id: 1, name: 'أجهزة إلكترونية', slug: 'electronics' }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('action', formData.id ? 'edit_category' : 'add_category');
      if (formData.id) fd.append('category_id', formData.id);
      fd.append('name', formData.name);
      fd.append('slug', formData.slug);
      
      await apiClient('api.php?page=admin', { method: 'POST', body: fd as any });
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا التصنيف؟')) return;
    try {
      const fd = new FormData();
      fd.append('action', 'delete_category');
      fd.append('category_id', id.toString());
      await apiClient('api.php?page=admin', { method: 'POST', body: fd as any });
      fetchCategories();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-2 md:p-6 animate-[fadeInUp_0.4s_ease-out]" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-slate-800"><i className="fas fa-tags text-blue-600 ml-2"></i> التصنيفات</h1>
        <button onClick={() => { setFormData({id:'', name:'', slug:''}); setIsModalOpen(true); }} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm">
          <i className="fas fa-plus ml-1"></i> إضافة تصنيف
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-20 text-blue-600"><i className="fas fa-spinner fa-spin text-3xl"></i></div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400 font-bold shadow-sm">لا توجد تصنيفات حالياً</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  {cat.image_url ? <img src={`../${cat.image_url}`} className="w-full h-full object-cover rounded-xl" alt="" /> : <i className="fas fa-image text-slate-300 text-xl"></i>}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 m-0">{cat.name}</h3>
                  <div className="text-xs text-slate-400 mt-1 dir-ltr text-right">{cat.slug}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setFormData({id: cat.id, name: cat.name, slug: cat.slug}); setIsModalOpen(true); }} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"><i className="fas fa-pen"></i></button>
                <button onClick={() => deleteCategory(cat.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"><i className="fas fa-trash"></i></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-[scaleUp_0.3s_ease-out]">
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-800 m-0">{formData.id ? 'تعديل تصنيف' : 'إضافة تصنيف'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 text-right">
                <label className="block text-xs font-black text-slate-600 mb-2">إسم التصنيف</label>
                <input type="text" className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-colors" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="mb-6 text-right">
                <label className="block text-xs font-black text-slate-600 mb-2">الرابط (Slug)</label>
                <input type="text" className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-colors dir-ltr text-right" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white rounded-xl py-3 font-black hover:bg-blue-700 transition-colors shadow-md">
                حفظ التصنيف
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
