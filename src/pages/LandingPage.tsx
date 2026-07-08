import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const isLoggedIn = false; // We can implement auth context later
  const ctaLink = isLoggedIn ? '/admin/dashboard' : '/register';
  const ctaText = isLoggedIn ? 'الذهاب للوحة التحكم' : 'أنشئ متجرك مجاناً';
  const navBtnText = isLoggedIn ? 'لوحة التحكم' : 'تسجيل الدخول';
  const navBtnLink = isLoggedIn ? '/admin/dashboard' : '/login';

  return (
    <div className="font-['Cairo'] bg-[#f8fafc] text-[#1e293b] min-h-screen" dir="rtl">
      <nav className="flex justify-between items-center px-4 md:px-10 py-4 bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-slate-200/50">
        <Link to="/" className="text-2xl font-black text-blue-600 flex items-center gap-2 decoration-none">
          <i className="fas fa-store"></i> Souqify
        </Link>
        <Link to={navBtnLink} className="bg-blue-50 text-blue-600 px-5 py-2 rounded-xl font-bold text-sm transition-all duration-300 hover:bg-blue-600 hover:text-white decoration-none">
          {navBtnText} <i className="fas fa-user-circle"></i>
        </Link>
      </nav>

      <main className="pt-24 pb-20">
        <section className="px-4 md:px-10 text-center max-w-4xl mx-auto animate-[fadeInUp_0.8s_ease-out] pt-16">
          <div className="inline-block bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-sm font-bold mb-6 border border-blue-600/20">
            <i className="fas fa-rocket"></i> منصة التجارة الإلكترونية الأسهل
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-5">
            أنشئ متجرك الإلكتروني <span className="text-blue-600">بدون تعقيد</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
            منصة Souqify توفر لك لوحة تحكم عصرية، إدارة كاملة لمنتجاتك ومبيعاتك بكل سهولة ومن هاتفك فقط!
          </p>
          
          <Link to={ctaLink} className="inline-flex items-center gap-2 bg-gradient-to-br from-blue-600 to-blue-500 text-white px-10 py-4 rounded-2xl text-lg font-extrabold shadow-[0_15px_30px_rgba(13,110,253,0.25)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(13,110,253,0.35)] active:scale-95 decoration-none">
            {ctaText} <i className="fas fa-arrow-left"></i>
          </Link>
        </section>

        <section className="px-4 md:px-10 py-20 max-w-6xl mx-auto">
          <h2 className="text-center text-3xl font-black mb-10">لماذا تختار Souqify؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[minmax(200px,auto)]">
            
            <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-[24px] p-8 border-none shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col justify-center transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center text-3xl mb-5">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3 className="text-xl font-extrabold mb-3 text-white">إدارة من الهاتف</h3>
              <p className="text-sm text-white/90 leading-relaxed">
                تم تصميم لوحة التحكم خصيصاً لتكون سلسة وسريعة الاستجابة على جميع الشاشات. أدر طلبياتك، أضف منتجاتك، وتابع أرباحك من هاتفك المحمول وفي أي مكان.
              </p>
            </div>

            <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col justify-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-600/30">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-5">
                <i className="fas fa-wallet"></i>
              </div>
              <h3 className="text-xl font-extrabold mb-3">أسعار اشتراك رمزية</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                وفر أموالك وابدأ تجارتك الإلكترونية بأقل التكاليف، مع باقات اشتراك رخيصة جداً ومدروسة لتناسب كافة الميزانيات والمبتدئين.
              </p>
            </div>

            <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col justify-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-600/30">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-5">
                <i className="fas fa-chart-pie"></i>
              </div>
              <h3 className="text-xl font-extrabold mb-3">إحصائيات دقيقة</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                مخططات بيانية فورية تظهر أرباحك، عدد الزيارات، وحالات الطلبات لمساعدتك في اتخاذ قرارات تسويقية ناجحة.
              </p>
            </div>

            <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col justify-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-600/30">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-5">
                <i className="fas fa-palette"></i>
              </div>
              <h3 className="text-xl font-extrabold mb-3">تصميم جذاب</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                واجهة متجر عصرية وسريعة تقدم لزبائنك تجربة شراء مريحة وترفع من نسبة المبيعات.
              </p>
            </div>

            <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col justify-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-600/30">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-5">
                <i className="fas fa-credit-card"></i>
              </div>
              <h3 className="text-xl font-extrabold mb-3">باقات اشتراك مرنة</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                ترقية الحساب تلقائياً ودفع آمن عبر البطاقة الذهبية لدعم استمرارية وتطور متجرك.
              </p>
            </div>

          </div>
        </section>
      </main>

      <footer className="text-center p-8 bg-white border-t border-slate-200 text-slate-500 text-sm font-semibold">
        <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} لـ منصة Souqify</p>
      </footer>
    </div>
  );
}
