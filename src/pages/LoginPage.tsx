import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Assuming your backend login endpoint returns success and maybe a token
      const response = await apiClient<any>('login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (response.status === 'success') {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
        navigate('/admin/dashboard');
      } else {
        setError(response.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة لاحقاً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-['Cairo'] bg-slate-50 min-h-screen flex items-center justify-center p-3" dir="rtl">
      <div className="grid grid-cols-1 gap-2.5 w-full max-w-[400px]">
        <div className="bg-white p-5 px-6 rounded-2xl border border-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.03)] text-center">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl mx-auto mb-2.5">
            <i className="fas fa-store"></i>
          </div>
          <h2 className="m-0 font-black text-xl text-slate-800">تسجيل الدخول</h2>
          <p className="mt-1 mb-0 text-xs text-slate-500 font-extrabold">مرحباً بعودتك إلى منصة Souqify</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-5 px-6 rounded-2xl border border-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.03)] relative overflow-hidden">
          {error && (
            <div className="bg-red-50 text-red-600 p-2.5 rounded-xl text-xs font-black mb-4 text-center border border-red-200 flex items-center justify-center gap-2 animate-[shake_0.4s_ease-in-out]">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          <div className="mb-4 text-right">
            <label className="block text-xs font-black mb-1.5 text-slate-600">البريد الإلكتروني</label>
            <input 
              type="email" 
              className={`w-full p-2.5 px-4 border-2 border-slate-200 rounded-xl font-bold text-sm bg-slate-50 text-slate-800 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none ${isSubmitting ? 'opacity-50 pointer-events-none bg-slate-200' : ''}`}
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              autoFocus
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-4 text-right">
            <label className="block text-xs font-black mb-1.5 text-slate-600">كلمة المرور</label>
            <div className="relative flex items-center">
              <input 
                type={showPassword ? 'text' : 'password'}
                className={`w-full p-2.5 pl-10 pr-4 border-2 border-slate-200 rounded-xl font-bold text-sm bg-slate-50 text-slate-800 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none ${isSubmitting ? 'opacity-50 pointer-events-none bg-slate-200 text-transparent' : ''}`}
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <i 
                className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} absolute left-3 text-slate-400 cursor-pointer text-sm p-1 transition-colors hover:text-blue-600 ${isSubmitting ? 'hidden' : ''}`} 
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                style={{ color: showPassword ? '#0d6efd' : '#94a3b8' }}
              ></i>
            </div>
          </div>

          <button 
            type="submit" 
            className={`w-full bg-blue-600 text-white border-none p-3 rounded-xl font-black text-sm cursor-pointer transition-all mt-2.5 flex justify-center items-center gap-2 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(13,110,253,0.3)] active:translate-y-0 ${isSubmitting ? 'opacity-70 cursor-not-allowed transform-none shadow-none bg-slate-200 text-transparent pointer-events-none' : ''}`}
            disabled={isSubmitting}
          >
            تسجيل الدخول <i className="fas fa-arrow-left text-[13px]"></i>
          </button>
          
          {/* Shimmer effect placeholder when submitting */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-white/50 z-10 pointer-events-none overflow-hidden rounded-2xl">
                <div className="absolute top-0 bottom-0 left-0 right-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_1.5s_infinite]"></div>
            </div>
          )}
        </form>
        
        <div className="text-center mt-1">
          <Link to="/register" className="inline-flex items-center justify-center gap-1.5 text-xs text-blue-600 font-extrabold transition-colors py-1.5 px-3 rounded-lg hover:bg-blue-50 decoration-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            ليس لديك متجر؟ أنشئ واحداً الآن
          </Link>
        </div>
      </div>
    </div>
  );
}
