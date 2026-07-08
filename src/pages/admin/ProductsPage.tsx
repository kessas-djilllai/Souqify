import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Link } from 'react-router-dom';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient<any>('api.php?page=admin&action=get_products');
      if (res.status === 'success') {
        setProducts(res.data);
      }
    } catch (e) {
      console.error(e);
      // Fallback
      setProducts([
        { id: 1, title: 'حذاء رياضي', price: 3500, status: 'active', visits_count: 120, image_url: 'https://via.placeholder.com/150' },
        { id: 2, title: 'ساعة ذكية', price: 8000, status: 'hidden', visits_count: 55, image_url: 'https://via.placeholder.com/150' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleVisibility = async (id: number, currentStatus: string) => {
    const isVisible = currentStatus !== 'hidden';
    // Optimistic update
    setProducts(products.map(p => p.id === id ? { ...p, status: isVisible ? 'hidden' : 'active' } : p));
    
    const fd = new FormData();
    fd.append('action', 'toggle_visibility');
    fd.append('product_id', id.toString());
    fd.append('is_visible', (!isVisible).toString());
    try {
      await apiClient('api.php?page=admin', { method: 'POST', body: fd as any });
    } catch (e) {
      fetchProducts(); // revert
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      const fd = new FormData();
      fd.append('action', 'delete_product');
      fd.append('product_id', id.toString());
      await apiClient('api.php?page=admin', { method: 'POST', body: fd as any });
      fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-2 md:p-6 animate-[fadeInUp_0.4s_ease-out]" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-slate-800"><i className="fas fa-box-open text-blue-600 ml-2"></i> المنتجات</h1>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm decoration-none">
          <i className="fas fa-plus ml-1"></i> إضافة منتج (قريباً)
        </button>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
        <table className="w-full text-center whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 font-black text-xs border-b border-slate-200">
            <tr>
              <th className="p-4">الصورة</th>
              <th className="p-4 text-right">المنتج</th>
              <th className="p-4">السعر</th>
              <th className="p-4">الزيارات</th>
              <th className="p-4">مرئي</th>
              <th className="p-4">إجراء</th>
            </tr>
          </thead>
          <tbody className="text-sm font-bold text-slate-700 divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={6} className="p-10 text-center text-blue-600"><i className="fas fa-spinner fa-spin text-2xl"></i></td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="p-10 text-center text-slate-400 font-bold">لا توجد منتجات</td></tr>
            ) : (
              products.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 flex justify-center">
                    <img src={p.image_url ? (p.image_url.startsWith('http') ? p.image_url : `../${p.image_url}`) : 'https://via.placeholder.com/40'} className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white" alt="" />
                  </td>
                  <td className="p-4 text-right text-slate-900 font-black">{p.title}</td>
                  <td className="p-4 text-blue-600 dir-ltr font-black">{Number(p.price).toLocaleString()} د.ج</td>
                  <td className="p-4 text-slate-500"><i className="fas fa-eye text-blue-400 ml-1"></i> {p.visits_count || 0}</td>
                  <td className="p-4">
                    <label className="relative inline-block w-10 h-5 cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={p.status !== 'hidden'} onChange={() => toggleVisibility(p.id, p.status)} />
                      <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button className="bg-blue-50 text-blue-600 w-8 h-8 rounded-lg text-sm hover:bg-blue-100 transition-colors"><i className="fas fa-pen"></i></button>
                      <button onClick={() => deleteProduct(p.id)} className="bg-red-50 text-red-500 w-8 h-8 rounded-lg text-sm hover:bg-red-100 transition-colors"><i className="fas fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
