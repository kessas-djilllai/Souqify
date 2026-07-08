import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    store_name: '',
    store_slug: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const currentDomain = window.location.host;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'store_slug') {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setFormData({ ...formData, [name]: slug });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Check if email already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingUser) {
        throw new Error('البريد الإلكتروني مسجل بالفعل.');
      }

      // 2. Check if store_slug already exists
      const { data: existingStore } = await supabase
        .from('stores')
        .select('id')
        .eq('store_slug', formData.store_slug)
        .maybeSingle();
        
      if (existingStore) {
        throw new Error('رابط المتجر هذا مستخدم بالفعل، يرجى اختيار رابط آخر.');
      }

      // 3. Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
          }
        }
      });

      if (authError) throw authError;
      
      const userId = authData.user?.id;
      if (!userId) throw new Error('فشل إنشاء الحساب');

      // 4. Insert into users table
      const { error: userError } = await supabase
        .from('users')
        .upsert([{
          id: userId,
          email: formData.email,
          full_name: formData.full_name,
          role: 'admin'
        }], { onConflict: 'id' });

      if (userError) {
        if (userError.code === '23503') {
          throw new Error('هذا البريد الإلكتروني مسجل مسبقاً، يرجى تسجيل الدخول.');
        }
        if (userError.code !== '23505') {
          throw userError;
        }
      }

      // 5. Create the store
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .insert([{
          user_id: userId,
          store_name: formData.store_name,
          store_slug: formData.store_slug,
          plan_id: 1 // Default free plan assuming ID 1 exists
        }])
        .select('id')
        .single();

      if (storeError) throw storeError;
      
      const storeId = storeData.id;

      // 5. Create default appearance
      await supabase
        .from('appearance')
        .insert([{
          store_id: storeId,
          store_title: formData.store_name,
          primary_color: '#000000',
          font_family: 'Cairo'
        }]);

      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Registration Error:', err);
      setError(err.message || 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة لاحقاً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-['Cairo'] bg-slate-50 min-h-screen flex items-center justify-center p-2.5" dir="rtl">
      <div className="grid grid-cols-1 gap-2 w-full max-w-[360px]">
        <div className="bg-white p-4 px-5 rounded-2xl border border-slate-200 shadow-[0_8px_20px_rgba(0,0,0,0.03)] text-center">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl mx-auto mb-2">
            <i className="fas fa-store-alt"></i>
          </div>
          <h2 className="m-0 font-black text-lg text-slate-800">ابدأ تجارتك الآن</h2>
          <p className="mt-1 mb-0 text-[11px] text-slate-500 font-extrabold">أنشئ حسابك واحصل على متجرك الخاص في ثوانٍ</p>
        </div>

        <form onSubmit={handleRegister} className="bg-white p-4 px-5 rounded-2xl border border-slate-200 shadow-[0_8px_20px_rgba(0,0,0,0.03)] relative overflow-hidden">
          {error && (
            <div className="bg-red-50 text-red-600 p-2 rounded-lg text-[11px] font-black mb-3 text-center border border-red-200 flex items-center justify-center gap-1.5 animate-[shake_0.4s_ease-in-out]">
              <i className="fas fa-exclamation-circle"></i> <span>{error}</span>
            </div>
          )}

          <div className="mb-2.5 text-right">
            <label className="block text-[11px] font-black mb-1 text-slate-600">الإسم الكامل</label>
            <input 
              type="text" 
              name="full_name"
              className="w-full p-2 px-3 border-2 border-slate-200 rounded-lg font-bold text-xs bg-slate-50 text-slate-800 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none"
              placeholder="أدخل اسمك" 
              value={formData.full_name}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="mb-2.5 text-right">
            <label className="block text-[11px] font-black mb-1 text-slate-600">البريد الإلكتروني</label>
            <input 
              type="email" 
              name="email"
              className="w-full p-2 px-3 border-2 border-slate-200 rounded-lg font-bold text-xs bg-slate-50 text-slate-800 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none"
              placeholder="name@example.com" 
              value={formData.email}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="mb-2.5 text-right">
            <label className="block text-[11px] font-black mb-1 text-slate-600">كلمة المرور</label>
            <div className="relative flex items-center">
              <input 
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="w-full p-2 pl-9 pr-3 border-2 border-slate-200 rounded-lg font-bold text-xs bg-slate-50 text-slate-800 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none"
                placeholder="•••••••• (أكثر من 8 أحرف)" 
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <i 
                className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} absolute left-2.5 text-slate-400 cursor-pointer text-sm p-1 transition-colors hover:text-blue-600`} 
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                style={{ color: showPassword ? '#0d6efd' : '#94a3b8' }}
              ></i>
            </div>
          </div>

          <hr className="border-0 border-t border-dashed border-slate-300 my-2.5" />

          <div className="mb-2.5 text-right">
            <label className="block text-[11px] font-black mb-1 text-slate-600">اسم المتجر</label>
            <input 
              type="text" 
              name="store_name"
              className="w-full p-2 px-3 border-2 border-slate-200 rounded-lg font-bold text-xs bg-slate-50 text-slate-800 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none"
              placeholder="مثال: متجر الأناقة أو Style Shop" 
              value={formData.store_name}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="mb-2.5 text-right">
            <label className="block text-[11px] font-black mb-1 text-slate-600">رابط المتجر</label>
            <input 
              type="text" 
              name="store_slug"
              className="w-full p-2 px-3 border-2 border-slate-200 rounded-lg font-bold text-xs bg-slate-50 text-slate-800 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none"
              placeholder="my-store" 
              value={formData.store_slug}
              onChange={handleInputChange}
              required 
            />
            <div className="text-[10px] text-slate-500 mt-1 dir-ltr text-left bg-slate-100 p-1 px-2 rounded-md font-bold">
              {currentDomain}/shop?store=<span className="text-blue-600">{formData.store_slug || '...'}</span>
            </div>
          </div>

          <button 
            type="submit" 
            className={`w-full bg-blue-600 text-white border-none p-2.5 rounded-lg font-black text-sm cursor-pointer transition-all mt-1.5 flex justify-center items-center gap-2 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(13,110,253,0.2)] active:translate-y-0 ${isSubmitting ? 'opacity-70 cursor-not-allowed transform-none shadow-none text-transparent' : ''}`}
            disabled={isSubmitting}
          >
            إنشاء حساب مجاناً <i className="fas fa-arrow-left text-xs"></i>
          </button>
          
          {isSubmitting && (
            <div className="absolute inset-0 bg-white/50 z-10 pointer-events-none overflow-hidden rounded-2xl">
                <div className="absolute top-0 bottom-0 left-0 right-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_1.5s_infinite]"></div>
            </div>
          )}
        </form>
        
        <div className="text-center mt-1">
          <Link to="/login" className="inline-flex items-center justify-center gap-1.5 text-xs text-blue-600 font-extrabold transition-colors py-1 px-2.5 rounded-lg hover:bg-blue-50 decoration-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            الذهاب إلى تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
