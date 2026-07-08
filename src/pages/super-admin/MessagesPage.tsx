import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function MessagesPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'received' | 'remaining'>('all');
  const [sentUserIds, setSentUserIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from('users').select('id, full_name, email');
      if (error) throw error;
      if (data) {
        setUsers(data.map((u: any) => ({
          id: u.id,
          username: u.full_name,
          email: u.email
        })));
      }
    } catch (e) {
      console.error('Error fetching users for messages:', e);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username.includes(search) || u.email.includes(search);
    const hasReceived = sentUserIds.has(u.id);
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'received') return matchesSearch && hasReceived;
    if (activeTab === 'remaining') return matchesSearch && !hasReceived;
    return false;
  });

  return (
    <div className="animate-[fadeInUp_0.4s_ease-out] pb-10 max-w-4xl mx-auto">
      <div className="flex gap-3 w-full mb-6">
        <button className="flex-1 bg-blue-600 text-white rounded-xl py-4 font-black shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
           <i className="fas fa-paper-plane"></i> إرسال للمتبقين ({users.length - sentUserIds.size})
        </button>
        <button 
          onClick={() => setSentUserIds(new Set())}
          className="bg-red-50 text-red-500 rounded-xl px-6 py-4 font-bold border border-red-100 hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
           <i className="fas fa-sync-alt"></i> تصفير
        </button>
      </div>

      <div className="flex bg-slate-100 p-1.5 rounded-[16px] mb-6 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-sm whitespace-nowrap transition-all ${activeTab === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
          الكل
        </button>
        <button 
          onClick={() => setActiveTab('received')}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-sm whitespace-nowrap transition-all flex items-center justify-center gap-2 ${activeTab === 'received' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
          <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full">{sentUserIds.size}</span> المستلمة
        </button>
        <button 
          onClick={() => setActiveTab('remaining')}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-sm whitespace-nowrap transition-all flex items-center justify-center gap-2 ${activeTab === 'remaining' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
          <span className="bg-slate-400 text-white text-[10px] px-2 py-0.5 rounded-full">{users.length - sentUserIds.size}</span> المتبقية
        </button>
      </div>

      <div className="relative mb-6">
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث بالاسم أو الإيميل..." 
          className="w-full bg-white border border-slate-200 rounded-xl py-4 pr-12 pl-4 font-bold text-sm shadow-sm focus:border-blue-500 outline-none transition-colors"
        />
        <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
      </div>

      <div className="flex flex-col gap-3">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-bold">لا يوجد مستخدمين في هذه القائمة</div>
        ) : (
          filteredUsers.map(user => (
            <div key={user.id} className="bg-white p-4 rounded-[16px] border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-500 hover:shadow-md transition-all active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 flex items-center justify-center rounded-xl font-black text-xl shrink-0">
                  {user.username.charAt(0)}
                </div>
                <div>
                  <div className="font-black text-slate-800 text-sm flex items-center gap-2">
                    {sentUserIds.has(user.id) && <i className="fas fa-check-circle text-emerald-500"></i>}
                    {user.username}
                  </div>
                  <div className="font-bold text-slate-500 text-xs mt-1">{user.email}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
