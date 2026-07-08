import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SuperAdminLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('super_admin_token', 'demo_token');
      navigate('/super-admin/accounts');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-['Cairo'] relative overflow-hidden" dir="rtl">
      {/* Background decorations */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>

      <div className="bg-white w-full max-w-md rounded-[24px] p-8 md:p-10 shadow-[0_10px_40px_rgba(59,130,246,0.08)] border border-blue-50 text-center animate-[fadeInUp_0.4s_ease-out] relative z-10">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm">
          <i className="fas fa-shield-alt"></i>
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-2">الإدارة المركزية</h1>
        <p className="text-sm font-bold text-slate-500 mb-8">يرجى إدخال بيانات الاعتماد للوصول إلى لوحة التحكم</p>

        <form onSubmit={handleLogin} className="space-y-5 text-right">
          <div>
            <label className="block text-xs font-black text-slate-500 mb-2">اسم المستخدم</label>
            <div className="relative">
              <i className="fas fa-user absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pr-12 pl-4 font-bold text-sm outline-none focus:bg-white focus:border-blue-600 transition-colors" placeholder="ضع اسمك" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-500 mb-2">كلمة المرور</label>
            <div className="relative">
              <i className="fas fa-lock absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input type="password" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pr-12 pl-4 font-bold text-sm outline-none focus:bg-white focus:border-blue-600 transition-colors" placeholder="ضع كلمة المرور" />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white rounded-xl py-4 font-black mt-2 hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2">
            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : null}
            {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
