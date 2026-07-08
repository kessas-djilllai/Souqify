import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('الكل');
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient<any>('api.php?page=admin&action=get_orders');
      if (res.status === 'success') {
        setOrders(res.data);
        setFilteredOrders(res.data);
      }
    } catch (e) {
      console.error(e);
      // Fallback data for preview
      const fallback = [
        { id: 1001, customer_name: 'أحمد محمد', phone: '0555123456', state: 'الجزائر', total_price: 4500, phone_status: 'جديد', delivery_status: 'قيد-التجهيز', created_at: new Date().toISOString(), product_title: 'سماعات بلوتوث', quantity: 1 }
      ];
      setOrders(fallback);
      setFilteredOrders(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = orders;
    if (filter !== 'الكل') {
      if (['جديد', 'مكالمة2', 'مكالمة3', 'مؤكد', 'مؤجل', 'ملغى'].includes(filter)) {
        result = result.filter(o => o.phone_status === filter);
      } else {
        result = result.filter(o => o.delivery_status === filter);
      }
    }
    if (search) {
      result = result.filter(o => 
        o.id.toString().includes(search) || 
        (o.customer_name && o.customer_name.includes(search)) || 
        (o.phone && o.phone.includes(search))
      );
    }
    setFilteredOrders(result);
  }, [filter, search, orders]);

  const updateStatus = async (id: number, field: string, value: string) => {
    try {
      // Optimistic update
      setOrders(orders.map(o => o.id === id ? { ...o, [field]: value } : o));
      const formData = new FormData();
      formData.append('action', 'update_order_status');
      formData.append('order_id', id.toString());
      formData.append('field', field);
      formData.append('value', value);
      
      await apiClient('api.php?page=admin', { method: 'POST', body: formData as any });
    } catch (e) {
      console.error(e);
      fetchOrders(); // Revert on failure
    }
  };

  const deleteOrder = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب نهائياً؟')) return;
    try {
      const formData = new FormData();
      formData.append('action', 'delete_order');
      formData.append('order_id', id.toString());
      await apiClient('api.php?page=admin', { method: 'POST', body: formData as any });
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-2 md:p-6 animate-[fadeInUp_0.4s_ease-out]" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-slate-800"><i className="fas fa-box-open text-blue-600 ml-2"></i> إدارة الطلبات</h1>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-6 no-scrollbar">
        {['الكل', 'جديد', 'مؤكد', 'قيد-التجهيز', 'قيد-التوصيل', 'مستلم', 'مرتجع', 'ملغى'].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            className={`px-4 py-3 rounded-xl min-w-[120px] font-bold text-sm transition-all whitespace-nowrap ${filter === f ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'} border`}
          >
            {f} ({orders.filter(o => {
              if (f === 'الكل') return true;
              if (['جديد', 'مؤكد', 'ملغى'].includes(f)) return o.phone_status === f;
              return o.delivery_status === f;
            }).length})
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex gap-4 shadow-sm">
        <input 
          type="text" 
          placeholder="ابحث برقم الطلب، اسم العميل، أو الهاتف..." 
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-bold text-sm outline-none focus:border-blue-500 transition-colors"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
        <table className="w-full text-center whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 font-black text-xs border-b border-slate-200">
            <tr>
              <th className="p-4">رقم الطلب</th>
              <th className="p-4">التاريخ</th>
              <th className="p-4 text-right">المنتج</th>
              <th className="p-4">العميل</th>
              <th className="p-4">الهاتف</th>
              <th className="p-4">المنطقة</th>
              <th className="p-4">المجموع</th>
              <th className="p-4">حالة الهاتف</th>
              <th className="p-4">حالة التوصيل</th>
              <th className="p-4">إجراء</th>
            </tr>
          </thead>
          <tbody className="text-sm font-bold text-slate-700 divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={10} className="p-10 text-center text-blue-600"><i className="fas fa-spinner fa-spin text-2xl"></i></td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan={10} className="p-10 text-center text-slate-400 font-bold">لا توجد طلبات تطابق البحث</td></tr>
            ) : (
              filteredOrders.map(o => (
                <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4"><span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md">#{o.id}</span></td>
                  <td className="p-4 text-xs text-slate-500">{new Date(o.created_at).toLocaleDateString('en-GB')}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center gap-3">
                      <img src={o.product_image ? (o.product_image.startsWith('http') ? o.product_image : `../${o.product_image}`) : 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-lg object-cover border border-slate-200" alt="" />
                      <div>
                        <div className="text-slate-900 w-40 overflow-hidden text-ellipsis">{o.product_title || 'سلة مشتريات'}</div>
                        <div className="text-xs text-blue-600">الكمية: {o.quantity || 1}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-900">{o.customer_name}</td>
                  <td className="p-4 dir-ltr">{o.phone}</td>
                  <td className="p-4 text-xs">{o.state}</td>
                  <td className="p-4 text-emerald-600 dir-ltr font-black">{Number(o.total_price).toLocaleString()} د.ج</td>
                  <td className="p-4">
                    <select 
                      className={`border rounded-lg px-2 py-1 outline-none text-xs font-bold cursor-pointer
                        ${o.phone_status === 'مؤكد' ? 'bg-green-50 text-green-700 border-green-200' : 
                          o.phone_status === 'ملغى' ? 'bg-red-50 text-red-700 border-red-200' : 
                          'bg-blue-50 text-blue-700 border-blue-200'}
                      `}
                      value={o.phone_status || 'جديد'}
                      onChange={(e) => updateStatus(o.id, 'phone_status', e.target.value)}
                    >
                      <option value="جديد">جديد</option>
                      <option value="مؤكد">مؤكد</option>
                      <option value="مكالمة2">مكالمة 2</option>
                      <option value="مكالمة3">مكالمة 3</option>
                      <option value="مؤجل">مؤجل</option>
                      <option value="ملغى">ملغى</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <select 
                      className={`border rounded-lg px-2 py-1 outline-none text-xs font-bold cursor-pointer
                        ${o.delivery_status === 'مستلم' ? 'bg-green-50 text-green-700 border-green-200' : 
                          o.delivery_status === 'مرتجع' ? 'bg-red-50 text-red-700 border-red-200' : 
                          'bg-purple-50 text-purple-700 border-purple-200'}
                      `}
                      value={o.delivery_status || 'قيد-التجهيز'}
                      onChange={(e) => updateStatus(o.id, 'delivery_status', e.target.value)}
                    >
                      <option value="قيد-التجهيز">قيد التجهيز</option>
                      <option value="قيد-التوصيل">قيد التوصيل</option>
                      <option value="مستلم">مستلم</option>
                      <option value="مرتجع">مرتجع</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button onClick={() => deleteOrder(o.id)} className="bg-red-50 text-red-500 w-8 h-8 rounded-lg text-sm hover:bg-red-100 transition-colors"><i className="fas fa-trash"></i></button>
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
