import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('subscription_plans').select('*');
      
      if (error) throw error;
      
      if (data) {
        setPlans(data);
      }
    } catch (e) {
      console.error(e);
      // Fallback
      setPlans([
        { id: 1, plan_name: 'الباقة الأساسية', price: 1500, duration_days: 30, products_limit: 50, orders_limit: 100, custom_color: 1, enable_notifications: 1, enable_slider: 1 }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="animate-[fadeInUp_0.4s_ease-out]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-black text-slate-800">إدارة باقات الاشتراك</h1>
        <button className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm">
          <i className="fas fa-plus ml-1"></i> إضافة باقة
        </button>
      </div>

      <div className="flex overflow-x-auto gap-6 pb-8 snap-x no-scrollbar">
        {isLoading ? (
          <div className="text-center w-full py-20 text-blue-600"><i className="fas fa-spinner fa-spin text-3xl"></i></div>
        ) : plans.map(plan => (
          <div key={plan.id} className="min-w-[320px] bg-white border border-blue-100 rounded-[24px] p-6 shadow-sm snap-center flex flex-col items-center relative hover:shadow-xl transition-shadow group">
            <div className="absolute top-4 right-4 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-black border border-blue-100">
              <i className="far fa-calendar ml-1"></i> {plan.duration_days} يوم
            </div>
            
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl mt-4 mb-4 shadow-md group-hover:scale-110 transition-transform">
               <i className="fas fa-gem"></i>
            </div>
            
            <h2 className="text-xl font-black text-slate-800 mb-2">{plan.plan_name}</h2>
            
            <div className="flex items-baseline gap-1 mb-6 dir-ltr">
              <span className="text-4xl font-black text-blue-600">{plan.price}</span>
              <span className="text-sm font-bold text-blue-600 opacity-80">د.ج</span>
            </div>

            <ul className="w-full space-y-3 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <i className="fas fa-check bg-emerald-100 text-emerald-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0"></i>
                <span className="truncate">{plan.products_limit == 0 ? 'منتجات غير محدودة' : `إضافة حتى ${plan.products_limit} منتج`}</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <i className="fas fa-check bg-emerald-100 text-emerald-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0"></i>
                <span className="truncate">{plan.orders_limit == 0 ? 'طلبات غير محدودة' : `استقبال حتى ${plan.orders_limit} طلب`}</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                {plan.custom_color == 1 ? <i className="fas fa-check bg-emerald-100 text-emerald-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0"></i> : <i className="fas fa-times bg-slate-200 text-slate-400 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0"></i>}
                <span className={plan.custom_color == 1 ? '' : 'text-slate-400 line-through decoration-slate-300'}>تخصيص لون المتجر</span>
              </li>
            </ul>

            <div className="mt-auto w-full flex gap-3">
              <button className="flex-1 bg-blue-50 text-blue-600 py-3 rounded-xl font-black text-sm hover:bg-blue-100 transition-colors"><i className="fas fa-pen ml-1"></i> تعديل</button>
              <button className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-black text-sm hover:bg-red-100 transition-colors"><i className="fas fa-trash ml-1"></i> حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
