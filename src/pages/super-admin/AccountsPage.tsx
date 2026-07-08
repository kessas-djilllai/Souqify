import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AccountsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Query users and join with stores and subscription_plans
      let query = supabase
        .from('users')
        .select(`
          id,
          full_name,
          email,
          stores (
            id,
            store_slug,
            subscription_plans (
              plan_name,
              price
            ),
            products (id),
            orders (id)
          )
        `);

      if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        // Map the Supabase nested response to the flat structure expected by the UI
        const mappedUsers = data.map((u: any) => {
          const store = u.stores && u.stores.length > 0 ? u.stores[0] : null;
          const plan = store?.subscription_plans;
          return {
            user_id: u.id,
            full_name: u.full_name,
            email: u.email,
            store_slug: store?.store_slug || '',
            plan_name: plan?.plan_name || 'مجانية',
            plan_price: plan?.price || 0,
            products_count: store?.products ? store.products.length : 0,
            orders_count: store?.orders ? store.orders.length : 0,
          };
        });

        // Sort users based on plan_price, products_count, orders_count
        mappedUsers.sort((a, b) => {
          if (b.plan_price !== a.plan_price) return b.plan_price - a.plan_price;
          if (b.products_count !== a.products_count) return b.products_count - a.products_count;
          return b.orders_count - a.orders_count;
        });

        setUsers(mappedUsers);
      }
    } catch (e) {
      console.error('Error fetching users from Supabase:', e);
      // Fallback
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  return (
      <div className="animate-[fadeInUp_0.4s_ease-out]">
        <div className="bg-blue-600 text-white p-4 rounded-xl text-center font-black mb-6 shadow-sm text-lg flex items-center justify-center gap-2">
          <i className="fas fa-users-cog"></i> جميع الحسابات المسجلة
        </div>

        <div className="relative mb-6">
          <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            className="w-full bg-white border-2 border-slate-200 rounded-xl py-3.5 pr-12 pl-4 font-bold text-sm outline-none focus:border-blue-600 transition-colors shadow-sm"
            placeholder="ابحث بالاسم أو البريد الإلكتروني..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full text-center py-20 text-blue-600"><i className="fas fa-spinner fa-spin text-3xl"></i></div>
          ) : users.map(user => (
            <div key={user.user_id} className="bg-white border border-slate-200 rounded-2xl p-5 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all group">
               <div className="flex items-center gap-4 mb-4">
                 <div className="relative shrink-0">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 flex justify-center items-center rounded-xl font-black text-xl">
                      {user.full_name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    {Number(user.plan_price) > 0 && <i className="fas fa-crown absolute -top-2 -right-2 text-amber-400 text-lg drop-shadow-sm rotate-12"></i>}
                 </div>
                 <div className="flex-1 overflow-hidden">
                    <div className="font-black text-sm text-slate-800 truncate">{user.full_name}</div>
                    <div className="font-bold text-xs text-slate-500 truncate">{user.email}</div>
                 </div>
               </div>

               <div className="flex justify-between items-center text-xs font-bold border-t border-slate-100 pt-4">
                 <div className="flex gap-3">
                   <div className="flex flex-col items-center">
                     <span className="text-slate-400 mb-1">المنتجات</span>
                     <span className="text-slate-800 bg-slate-100 px-2 py-1 rounded-md">{user.products_count || 0}</span>
                   </div>
                   <div className="flex flex-col items-center">
                     <span className="text-slate-400 mb-1">الطلبات</span>
                     <span className="text-slate-800 bg-slate-100 px-2 py-1 rounded-md">{user.orders_count || 0}</span>
                   </div>
                 </div>
                 <div className={`px-3 py-1.5 rounded-lg ${Number(user.plan_price) > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                   {user.plan_name || 'مجانية'}
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
  )
}
