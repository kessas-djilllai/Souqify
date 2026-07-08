import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { supabase } from '../lib/supabase';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const storeSlug = searchParams.get('store');
  const categoryId = parseInt(searchParams.get('category') || '0');
  const page = parseInt(searchParams.get('page') || '1');
  
  const [storeData, setStoreData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Load cart on mount
  useEffect(() => {
    if (storeSlug) {
      const savedCart = localStorage.getItem(`traivo_cart_${storeSlug}`);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [storeSlug]);

  const saveCart = (newCart: any[]) => {
    setCart(newCart);
    if (storeSlug) {
      localStorage.setItem(`traivo_cart_${storeSlug}`, JSON.stringify(newCart));
    }
  };

  const fetchStoreData = useCallback(async (catId: number, pageNum: number, search: string) => {
    if (!storeSlug) {
      setError('الرجاء تحديد المتجر.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { data: storeInfo, error: storeError } = await supabase
        .from('stores')
        .select(`
          id,
          store_slug,
          appearance (
            store_title,
            primary_color,
            font_family,
            enable_cart,
            enable_slider,
            show_categories,
            store_image_1,
            store_image_2,
            store_image_3,
            store_image_4,
            main_logo
          )
        `)
        .eq('store_slug', storeSlug)
        .single();

      if (storeError || !storeInfo) {
        throw new Error('متجر غير موجود');
      }

      const appearance: any = storeInfo.appearance?.[0] || storeInfo.appearance || {};
      const storeId = storeInfo.id;

      if (categories.length === 0) {
        const { data: cats } = await supabase.from('categories').select('*').eq('store_id', storeId);
        setCategories(cats || []);
      }

      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('store_id', storeId)
        .eq('status', 'active');

      if (catId > 0) query = query.eq('category_id', catId);
      if (search) query = query.ilike('title', `%${search}%`);

      const from = (pageNum - 1) * 12;
      const to = from + 11;
      query = query.range(from, to);

      const { data: prods, count } = await query;

      setProducts(prods || []);
      setTotalPages(count ? Math.ceil(count / 12) : 1);
      
      const images = [appearance.store_image_1, appearance.store_image_2, appearance.store_image_3, appearance.store_image_4].filter(Boolean);

      setStoreData({
         title: appearance.store_title || 'TRAIVO',
         primary_color: appearance.primary_color || '#007bff',
         font_family: appearance.font_family || 'Cairo',
         enable_cart: appearance.enable_cart,
         enable_slider: appearance.enable_slider,
         show_categories: appearance.show_categories,
         images: images,
         main_logo: appearance.main_logo
      });
    } catch (err: any) {
      setError('فشل الاتصال بالخادم نهائياً.');
      console.error(err);
      
      // Mock Data for preview purposes
      setStoreData({ title: 'متجر تجريبي', primary_color: '#0d6efd', enable_cart: 1, enable_slider: 1, show_categories: 1, images: ['https://via.placeholder.com/1200x400/0d6efd/ffffff?text=Slide+1'] });
      setCategories([{id: 1, name: 'إلكترونيات'}, {id: 2, name: 'ملابس'}]);
      setProducts([
        { id: 1, title: 'هاتف ذكي', price: 50000, old_price: 60000, image_url: 'https://via.placeholder.com/300' },
        { id: 2, title: 'سماعات بلوتوث', price: 3000, image_url: 'https://via.placeholder.com/300' }
      ]);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, [storeSlug, categories.length]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStoreData(categoryId, page, searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [categoryId, page, searchQuery, fetchStoreData]);

  const handleCategoryChange = (id: number) => {
    setSearchParams(prev => {
      if (id > 0) prev.set('category', id.toString());
      else prev.delete('category');
      prev.set('page', '1');
      return prev;
    });
    setIsMenuOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => {
      prev.set('page', newPage.toString());
      return prev;
    });
  };

  const updateCartQty = (id: string, change: number) => {
    const newCart = [...cart];
    const item = newCart.find(i => i.id === id);
    if (item && !item.offer_id) {
      item.quantity = Math.max(1, item.quantity + change);
      saveCart(newCart);
    }
  };

  const removeFromCart = (id: string) => {
    saveCart(cart.filter(i => i.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (error && !storeData) {
    return <div className="text-center p-12 font-['Cairo'] text-red-500 font-bold text-xl">{error}</div>;
  }

  const primaryColor = storeData?.primary_color || '#007bff';

  return (
    <div className="font-['Cairo'] bg-slate-50 min-h-screen text-slate-800" dir="rtl" style={{ '--primary': primaryColor } as React.CSSProperties}>
      
      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm z-50 shadow-sm px-5 py-3 flex justify-between items-center">
        <button onClick={() => setIsMenuOpen(true)} className="text-2xl text-slate-800 hover:text-[var(--primary)] transition-colors w-8 flex justify-center items-center cursor-pointer bg-transparent border-none">
          <i className="fas fa-bars"></i>
        </button>
        
        <Link to={`/shop?store=${storeSlug}`} className="flex-1 text-center text-xl md:text-2xl font-black text-[var(--primary)] uppercase tracking-wide decoration-none">
          {storeData?.title || 'جاري التحميل...'}
        </Link>
        
        <div className="w-8 flex justify-center gap-2">
          {storeData?.enable_cart === 1 && (
            <button onClick={() => setIsCartOpen(true)} className="relative text-2xl text-slate-800 hover:text-[var(--primary)] transition-colors flex items-center justify-center cursor-pointer bg-transparent border-none">
              <i className="fas fa-shopping-cart"></i>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        {/* Search */}
        <div className="relative mb-5">
          <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            className="w-full py-3 pl-4 pr-10 border border-slate-200 rounded-xl font-bold text-sm bg-white shadow-sm transition-all focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_rgba(0,123,255,0.1)] outline-none"
            placeholder="ابحث عن منتج بالاسم أو الوصف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Slider (Simplified for React) */}
        {storeData?.enable_slider === 1 && storeData.images && storeData.images.length > 0 && (
          <div className="relative w-full rounded-2xl mb-5 shadow-md overflow-hidden bg-slate-200 h-[200px] md:h-[320px] lg:h-[420px]">
            <img src={storeData.images[currentSlide]} className="w-full h-full object-cover" alt="Slide" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
            
            {storeData.images.length > 1 && (
              <>
                <button onClick={() => setCurrentSlide(c => (c + 1) % storeData.images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-[var(--primary)] hover:text-white text-slate-800 border-none w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors z-10 shadow-sm">
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button onClick={() => setCurrentSlide(c => (c - 1 + storeData.images.length) % storeData.images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-[var(--primary)] hover:text-white text-slate-800 border-none w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors z-10 shadow-sm">
                  <i className="fas fa-chevron-right"></i>
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10 dir-rtl">
                  {storeData.images.map((_: any, i: number) => (
                    <div key={i} onClick={() => setCurrentSlide(i)} className={`cursor-pointer transition-all ${currentSlide === i ? 'w-5 h-2 bg-white rounded-full' : 'w-2 h-2 bg-white/40 rounded-full'}`}></div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Categories */}
        {storeData?.show_categories === 1 && categories.length > 0 && (
          <div className="flex overflow-x-auto gap-3 py-2 mb-3 scroll-smooth no-scrollbar">
            <button 
              onClick={() => handleCategoryChange(0)}
              className={`flex-none w-[85px] min-h-[100px] bg-white border rounded-2xl p-2.5 flex flex-col items-center justify-start text-center transition-all cursor-pointer shadow-sm ${categoryId === 0 ? 'border-[var(--primary)] bg-slate-50 shadow-[0_4px_15px_rgba(0,123,255,0.15)]' : 'border-slate-200'}`}
            >
              <div className="w-11 h-11 bg-slate-100 rounded-full mb-2 flex items-center justify-center text-slate-400 text-xl"><i className="fas fa-th"></i></div>
              <span className="text-xs font-extrabold text-slate-800 leading-tight w-full">الكل</span>
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex-none w-[85px] min-h-[100px] bg-white border rounded-2xl p-2.5 flex flex-col items-center justify-start text-center transition-all cursor-pointer shadow-sm ${categoryId === cat.id ? 'border-[var(--primary)] bg-slate-50 shadow-[0_4px_15px_rgba(0,123,255,0.15)]' : 'border-slate-200'}`}
              >
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="w-11 h-11 object-contain mb-2" />
                ) : (
                  <div className="w-11 h-11 bg-slate-100 rounded-full mb-2 flex items-center justify-center text-slate-400 text-xl"><i className="fas fa-tag"></i></div>
                )}
                <span className="text-xs font-extrabold text-slate-800 leading-tight w-full">{cat.name}</span>
              </button>
            ))}
          </div>
        )}

        <h2 className="text-xl font-black text-center my-6 text-slate-800">منتجات متجرنا</h2>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="w-full pt-[95%] relative bg-slate-100">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]"></div>
                </div>
                <div className="p-3">
                  <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse mb-3"></div>
                  <div className="h-8 w-full bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full text-center py-10 text-slate-500 font-extrabold">
            <i className="fas fa-box-open text-4xl block mb-4 text-slate-300"></i>
            {searchQuery ? 'لا توجد منتجات مطابقة لعملية البحث حالياً.' : 'لا توجد منتجات في هذا التصنيف حالياً.'}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
              {products.map(p => {
                const price = parseFloat(p.price) || 0;
                const oldPrice = parseFloat(p.old_price) || 0;
                const hasDiscount = oldPrice > price && price > 0;
                const discountPct = hasDiscount ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
                
                return (
                  <div key={p.id} onClick={() => navigate(`/checkout?id=${p.id}&store=${storeSlug}`)} className="bg-white rounded-[12px] border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col relative transition-transform cursor-pointer hover:-translate-y-1 text-right">
                    <div className="relative w-full pt-[95%] overflow-hidden bg-slate-50 border-b border-slate-100">
                      {hasDiscount && (
                        <div className="absolute top-2 right-2 bg-[var(--primary)] text-white px-2.5 py-1 rounded-full text-[11px] font-extrabold z-10 shadow-sm dir-rtl">
                          تخفيض {discountPct}%-
                        </div>
                      )}
                      <img src={p.image_url || 'https://via.placeholder.com/300x300?text=No+Image'} alt={p.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    </div>
                    <div className="p-3 flex flex-col flex-grow items-start">
                      <div className="text-yellow-400 text-[13px] mb-1"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
                      <div className="flex justify-start items-center gap-1.5 mb-1.5 w-full dir-rtl flex-wrap">
                        <span className="text-base font-black text-[var(--primary)]">{price.toLocaleString()} د.ج</span>
                        {hasDiscount && <span className="text-xs text-slate-400 line-through font-bold">{oldPrice.toLocaleString()} د.ج</span>}
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-800 mb-2.5 leading-tight line-clamp-2 min-h-[40px] w-full">{p.title}</h3>
                      <button className="bg-[var(--primary)] text-white border-none w-full py-2 rounded-lg font-extrabold text-sm cursor-pointer transition-colors mt-auto active:scale-95 hover:bg-blue-700">
                        تسوق الآن
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 mb-5 dir-ltr">
                <button disabled={page === 1} onClick={() => handlePageChange(page - 1)} className="w-10 h-10 flex justify-center items-center bg-white border border-slate-300 rounded-xl font-extrabold text-slate-800 cursor-pointer hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed">
                  <i className="fas fa-chevron-left"></i>
                </button>
                {Array.from({length: totalPages}, (_, i) => i + 1).map(pageNum => (
                  <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`w-10 h-10 flex justify-center items-center border rounded-xl font-extrabold cursor-pointer transition-colors ${page === pageNum ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'bg-white border-slate-300 text-slate-800 hover:border-[var(--primary)] hover:text-[var(--primary)]'}`}>
                    {pageNum}
                  </button>
                ))}
                <button disabled={page === totalPages} onClick={() => handlePageChange(page + 1)} className="w-10 h-10 flex justify-center items-center bg-white border border-slate-300 rounded-xl font-extrabold text-slate-800 cursor-pointer hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-slate-900 text-white pt-12 pb-5 mt-10">
        <div className="max-w-6xl mx-auto px-5">
           <div className="text-center mb-8 border-b border-white/10 pb-8">
             <Link to={`/shop?store=${storeSlug}`} className="text-3xl font-black text-white decoration-none inline-block mb-4">{storeData?.title || 'Souqify'}</Link>
             <p className="text-sm text-slate-400 leading-relaxed">نحن متجر إلكتروني رائد نسعى لتقديم أفضل المنتجات بأعلى جودة وبأسعار تنافسية. راحتكم وثقتكم هي هدفنا الأساسي.</p>
           </div>
           <div className="text-center text-xs text-slate-500 font-bold flex flex-col gap-1">
             <span>جميع الحقوق محفوظة لـ {storeData?.title || 'المتجر'} &copy; {new Date().getFullYear()}</span>
           </div>
        </div>
      </footer>

      {/* Overlays */}
      <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] transition-opacity duration-300 ${isMenuOpen || isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => {setIsMenuOpen(false); setIsCartOpen(false);}}></div>

      {/* Sidebar Menu */}
      <aside className={`fixed top-0 right-0 w-[280px] h-full bg-white z-[1001] transition-transform duration-300 flex flex-col shadow-[-5px_0_25px_rgba(0,0,0,0.1)] ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5 bg-[var(--primary)] text-white flex justify-between items-center">
          <h3 className="m-0 font-black text-lg"><i className="fas fa-bars ml-2"></i> القائمة الرئيسية</h3>
          <i className="fas fa-times cursor-pointer text-xl" onClick={() => setIsMenuOpen(false)}></i>
        </div>
        <ul className="p-5 flex-grow overflow-y-auto list-none m-0">
          <li>
            <button onClick={() => {handleCategoryChange(0);}} className="block w-full text-right p-4 text-slate-800 font-bold border-b border-slate-100 bg-transparent hover:bg-slate-50 hover:text-[var(--primary)] transition-colors">
              <i className="fas fa-home w-6 text-[var(--primary)]"></i> الرئيسية
            </button>
          </li>
          <li>
            <button onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)} className="flex w-full justify-between items-center text-right p-4 text-slate-800 font-bold border-b border-slate-100 bg-transparent hover:bg-slate-50 hover:text-[var(--primary)] transition-colors">
              <span><i className="fas fa-layer-group w-6 text-[var(--primary)]"></i> التصنيفات</span>
              <i className={`fas fa-chevron-down text-xs transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <ul className={`bg-slate-50 border-b border-slate-100 list-none p-0 m-0 ${isCategoryMenuOpen ? 'block' : 'hidden'}`}>
              <li><button onClick={() => handleCategoryChange(0)} className="block w-full text-right py-3 px-8 text-sm text-slate-500 font-extrabold border-none bg-transparent hover:text-[var(--primary)]">الكل</button></li>
              {categories.map(cat => (
                <li key={cat.id}><button onClick={() => handleCategoryChange(cat.id)} className="block w-full text-right py-3 px-8 text-sm text-slate-500 font-extrabold border-none bg-transparent hover:text-[var(--primary)]">{cat.name}</button></li>
              ))}
            </ul>
          </li>
        </ul>
      </aside>

      {/* Cart Drawer */}
      <aside className={`fixed top-0 left-0 w-full max-w-[380px] h-full bg-white z-[1001] transition-transform duration-300 flex flex-col shadow-[5px_0_25px_rgba(0,0,0,0.1)] ${isCartOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 bg-[var(--primary)] text-white flex justify-between items-center">
          <h3 className="m-0 font-black text-lg"><i className="fas fa-shopping-cart ml-2"></i> سلة التسوق</h3>
          <i className="fas fa-times cursor-pointer text-xl" onClick={() => setIsCartOpen(false)}></i>
        </div>
        <div className="p-5 flex-grow overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center text-slate-500 py-12 font-extrabold flex flex-col items-center gap-4">
              <i className="fas fa-shopping-basket text-4xl text-slate-300"></i>
              <p>السلة فارغة حالياً</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 mb-5 pb-5 border-b border-slate-100">
                <img src={item.image || 'https://via.placeholder.com/80'} className="w-20 h-20 object-cover rounded-xl border border-slate-200" alt={item.title} />
                <div className="flex-1 text-right">
                  <h4 className="text-sm font-extrabold mb-2 text-slate-800 line-clamp-2">{item.title.split(' (')[0].split(' [')[0]}</h4>
                  
                  {/* Variation badges */}
                  {item.variations && Object.keys(item.variations).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 mb-2">
                      <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-[11px] font-extrabold text-slate-800 flex items-center gap-1"><i className="fas fa-box"></i> {item.quantity} قطع</span>
                      {Object.entries(item.variations).map(([k, v]: [string, any]) => (
                        <span key={k} className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-[11px] font-extrabold text-slate-800">
                          {k}: {/^#([0-9A-F]{3}){1,2}$/i.test(v) ? <span className="inline-block w-2.5 h-2.5 rounded-full border border-slate-300 align-middle" style={{backgroundColor: v}}></span> : v}
                        </span>
                      ))}
                    </div>
                  )}
                  {item.offer_title && <div className="text-red-500 text-[11px] font-black mt-1 mb-1">🎁 {item.offer_title}</div>}
                  
                  <div className="text-sm font-black text-[var(--primary)] mb-2.5">{(item.price * item.quantity).toLocaleString()} د.ج</div>
                  
                  <div className="flex items-center gap-2 justify-end dir-ltr">
                    {item.offer_id ? (
                      <span className="text-xs font-bold text-slate-500">الكمية: {item.quantity}</span>
                    ) : (
                      <>
                        <button onClick={() => updateCartQty(item.id, 1)} className="w-7 h-7 border border-slate-300 bg-slate-50 rounded-md cursor-pointer font-extrabold text-[var(--primary)] flex items-center justify-center">+</button>
                        <span className="font-black text-sm min-w-[20px] text-center text-slate-800">{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.id, -1)} className="w-7 h-7 border border-slate-300 bg-slate-50 rounded-md cursor-pointer font-extrabold text-[var(--primary)] flex items-center justify-center">-</button>
                      </>
                    )}
                    <div onClick={() => removeFromCart(item.id)} className="text-red-500 cursor-pointer mr-auto p-1.5 bg-red-50 rounded-md text-sm hover:bg-red-100 transition-colors"><i className="fas fa-trash"></i></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-5 bg-slate-50 border-t border-slate-200">
          <div className="flex justify-between font-black text-base mb-4">
            <span className="text-slate-800">المجموع:</span>
            <span className="text-[var(--primary)] dir-ltr">{cartTotal.toLocaleString()} د.ج</span>
          </div>
          <button 
            onClick={() => {
              if (cart.length > 0) {
                const originalId = cart[0].original_id || cart[0].id.split('-')[0];
                navigate(`/checkout?id=${originalId}&store=${storeSlug}#cart`);
              }
            }}
            disabled={cart.length === 0}
            className="w-full bg-[var(--primary)] text-white border-none p-4 rounded-full font-black text-sm cursor-pointer flex justify-center items-center gap-2 shadow-[0_4px_12px_rgba(0,123,255,0.3)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            أكمل الطلب الآن <i className="fas fa-arrow-left"></i>
          </button>
        </div>
      </aside>

    </div>
  );
}
