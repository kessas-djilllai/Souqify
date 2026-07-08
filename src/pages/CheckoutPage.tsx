import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../api/client';
import { supabase } from '../lib/supabase';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const storeSlug = searchParams.get('store');
  const productId = parseInt(searchParams.get('id') || '0');
  const isMultiCart = location.hash === '#cart';

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [storeData, setStoreData] = useState<any>(null);
  const [productData, setProductData] = useState<any>(null);
  const [shippingZones, setShippingZones] = useState<any[]>([]);
  
  // Quick Checkout State
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [selectedVariations, setSelectedVariations] = useState<any>({});
  
  // Multi Cart State
  const [cart, setCart] = useState<any[]>([]);
  
  // Shared Form State
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    state: '',
    municipality: '',
    address: '',
    notes: '',
    delivery_method: 'home',
    coupon: ''
  });
  
  const [couponInfo, setCouponInfo] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Computed values
  let currentActivePrice = parseFloat(productData?.price || '0');
  let oldPrice = parseFloat(productData?.old_price || '0');

  // Load product & store data
  useEffect(() => {
    if (!storeSlug || !productId) {
      setError('الرابط غير صحيح. يرجى العودة إلى المتجر واختيار المنتج مرة أخرى.');
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const { data: storeInfo, error: storeError } = await supabase
          .from('stores')
          .select(`
            id,
            appearance ( store_title, primary_color, font_family ),
            settings ( setting_key, setting_value )
          `)
          .eq('store_slug', storeSlug)
          .single();

        if (storeError || !storeInfo) throw new Error('المتجر غير موجود');
        const storeId = storeInfo.id;
        const appearance = storeInfo.appearance?.[0] || storeInfo.appearance || {};
        
        let checkoutSettingsStr = storeInfo.settings?.find((s:any) => s.setting_key === 'checkout_settings')?.setting_value;
        let checkoutSettings = checkoutSettingsStr ? JSON.parse(checkoutSettingsStr) : {
          design: { form_title: 'الطلب السريع', btn_text: 'أطلب الآن', border_style: 'solid', border_color: '#e2e8f0', text_color: '#1e293b' },
          fields: [
            { id: 'client-name', label: 'الإسم الكامل', active: true, required: true },
            { id: 'phone-number', label: 'رقم الهاتف', active: true, required: true },
            { id: 'state-select', label: 'الولاية', active: true, required: true },
            { id: 'city-select', label: 'البلدية', active: true, required: true }
          ]
        };

        setStoreData({
          title: appearance.store_title || 'TRAIVO',
          primary_color: appearance.primary_color || '#1d4ed8',
          font_family: appearance.font_family || 'Cairo',
          checkout_settings: checkoutSettings
        });

        const { data: product, error: prodError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .eq('store_id', storeId)
          .single();

        if (prodError || !product) throw new Error('المنتج غير موجود');

        let varsObj = null;
        if (product.variations) {
          try { varsObj = JSON.parse(product.variations); } catch(e){}
        }
        let offersArr = null;
        if (product.offers) {
          try { offersArr = JSON.parse(product.offers); } catch(e){}
        }

        const prod = {
          ...product,
          main_image: product.image_url,
          variations: varsObj,
          offers: offersArr,
          processed_gallery: product.gallery_images ? JSON.parse(product.gallery_images) : []
        };

        setProductData(prod);
        setSelectedImage(prod.main_image);

        if (prod.variations?.attributes) {
            const initVars: any = {};
            Object.keys(prod.variations.attributes).forEach(k => {
              const attr = prod.variations.attributes[k];
              if (attr.vals && attr.vals.length > 0) {
                initVars[k] = { name: attr.name, value: attr.vals[0] };
              }
            });
            setSelectedVariations(initVars);
        }

        const { data: zones } = await supabase.from('shipping_zones').select('*').eq('store_id', storeId).eq('is_active', true);
        setShippingZones(zones || []);

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'حدث خطأ في تحميل المنتج.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [storeSlug, productId]);

  useEffect(() => {
    if (storeSlug) {
      const savedCart = localStorage.getItem(`traivo_cart_${storeSlug}`);
      if (savedCart) {
        try { setCart(JSON.parse(savedCart)); } catch (e) {}
      }
    }
  }, [storeSlug]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear municipality when state changes
    if (name === 'state') {
        setFormData(prev => ({ ...prev, municipality: '' }));
    }
  };

  const verifyCoupon = async () => {
    if (!formData.coupon) {
      setCouponInfo(null);
      setCouponError('');
      return;
    }
    setCouponLoading(true);
    setCouponError('');
    try {
      // Mock validation
      if (formData.coupon.toLowerCase() === 'discount10') {
         setCouponInfo({ code: formData.coupon, type: 'percent', value: 10 });
      } else {
         setCouponError('الكود غير صالح');
         setCouponInfo(null);
      }
    } finally {
      setCouponLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (formData.coupon) verifyCoupon();
    }, 800);
    return () => clearTimeout(delayDebounceFn);
  }, [formData.coupon]);

  // Price Calculation Logic
  if (selectedOffer && parseFloat(selectedOffer.price) > 0) {
      currentActivePrice = parseFloat(selectedOffer.price);
  }
  let displayPrice = currentActivePrice;
  if (selectedOffer) displayPrice = currentActivePrice * parseInt(selectedOffer.qty || 1);

  // Total Calculation
  const selectedZone = shippingZones.find(z => z.name === formData.state);
  let shippingCost = 0;
  if (selectedZone) {
      shippingCost = formData.delivery_method === 'home' ? parseFloat(selectedZone.home_price) : parseFloat(selectedZone.desk_price);
  }

  let productsCost = isMultiCart ? cart.reduce((s,i) => s + (i.price * i.quantity), 0) : (displayPrice * (selectedOffer ? 1 : qty));
  
  let isFreeShipping = false;
  if (isMultiCart) {
      isFreeShipping = cart.length > 0 && cart.every(item => String(item.free_shipping).toLowerCase() === 'true' || item.free_shipping === 1);
  } else {
      if (selectedOffer && (String(selectedOffer.free_shipping).toLowerCase() === 'true' || selectedOffer.free_shipping === 1)) {
          isFreeShipping = true;
      }
  }
  if (isFreeShipping) shippingCost = 0;

  let discountValue = 0;
  if (couponInfo) {
      discountValue = couponInfo.type === 'percent' ? productsCost * (parseFloat(couponInfo.value) / 100) : parseFloat(couponInfo.value);
      if (discountValue > productsCost) discountValue = productsCost;
  }
  let finalTotal = (productsCost - discountValue) + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In real scenario, post to api.php?page=checkout
      // Here we simulate success and redirect to factur
      setTimeout(() => {
        // Save invoice mock data
        const invoiceData = {
          order_id: 'ORD-' + Math.floor(Math.random() * 10000),
          customer_name: formData.customer_name,
          phone: formData.phone,
          state: formData.state,
          municipality: formData.municipality,
          delivery_method: formData.delivery_method === 'home' ? 'توصيل للمنزل' : 'توصيل للمكتب',
          delivery_status: 'قيد التجهيز',
          primary_color: storeData?.primary_color || '#2563eb',
          sub_total: productsCost + ' د.ج',
          discount: discountValue > 0 ? '-' + discountValue + ' د.ج' : '0 د.ج',
          shipping_cost: formData.state ? (shippingCost === 0 ? 'مجاني' : shippingCost + ' د.ج') : '-',
          total_price: finalTotal + ' د.ج',
          cart_items: isMultiCart ? cart : [{
             title: productData?.title,
             image: selectedImage,
             qty: selectedOffer ? parseInt(selectedOffer.qty) : qty,
             price: currentActivePrice,
             variations: Object.keys(selectedVariations).reduce((acc:any, k) => { acc[selectedVariations[k].name] = selectedVariations[k].value; return acc; }, {}),
             offer_name: selectedOffer?.title || null,
             free_shipping: isFreeShipping
          }]
        };
        localStorage.setItem('latest_invoice', JSON.stringify(invoiceData));
        navigate(`/factur?store=${storeSlug}`);
      }, 1500);
    } catch (err) {
      alert('حدث خطأ أثناء الإرسال');
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center pt-20 font-['Cairo'] text-blue-600 font-bold text-xl"><i className="fas fa-spinner fa-spin text-4xl mb-4 block"></i> جاري التحميل...</div>;
  if (error) return <div className="text-center pt-20 font-['Cairo'] text-red-500 font-bold text-xl">{error}</div>;

  const primaryColor = storeData?.primary_color || '#1d4ed8';

  return (
    <div className="font-['Cairo'] bg-[#f8fafc] min-h-screen text-slate-800" dir="rtl" style={{ '--primary': primaryColor } as React.CSSProperties}>
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm z-50 shadow-sm px-5 py-3 flex justify-between items-center">
        <Link to={`/shop?store=${storeSlug}`} className="text-2xl text-slate-800 hover:text-[var(--primary)] transition-colors w-8 flex justify-center items-center cursor-pointer bg-transparent border-none decoration-none">
          <i className="fas fa-arrow-right"></i>
        </Link>
        <div className="flex-1 text-center text-xl font-black text-[var(--primary)] uppercase tracking-wide">
          {storeData?.title || 'إتمام الطلب'}
        </div>
        <div className="w-8"></div>
      </header>

      <main className="max-w-[1100px] mx-auto py-4 md:py-8 px-4 flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
        
        {/* Left Column (Form) */}
        <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 md:p-8 border-2 border-slate-200 shadow-sm relative">
                <h2 className="text-lg font-black text-[var(--primary)] mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <i className="fas fa-bolt"></i> {storeData?.checkout_settings?.design?.form_title || 'الطلب السريع'}
                </h2>
                
                {storeData?.checkout_settings?.fields?.map((field: any) => {
                  if (!field.active) return null;
                  return (
                    <div key={field.id} className="mb-4">
                      <label className="block text-[13px] font-black mb-2 text-slate-800">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      
                      {field.id === 'client-name' && <input type="text" name="customer_name" required={field.required} value={formData.customer_name} onChange={handleInputChange} className="w-full p-3.5 border border-slate-300 rounded-xl font-bold text-sm bg-slate-50 transition-colors focus:border-[var(--primary)] focus:bg-white outline-none" placeholder={field.label} />}
                      {field.id === 'phone-number' && <input type="tel" name="phone" dir="ltr" required={field.required} value={formData.phone} onChange={handleInputChange} className="w-full p-3.5 border border-slate-300 rounded-xl font-bold text-sm bg-slate-50 transition-colors focus:border-[var(--primary)] focus:bg-white outline-none text-right" placeholder={field.label} />}
                      {field.id === 'state-select' && (
                        <select name="state" required={field.required} value={formData.state} onChange={handleInputChange} className="w-full p-3.5 border border-slate-300 rounded-xl font-bold text-sm bg-slate-50 transition-colors focus:border-[var(--primary)] focus:bg-white outline-none">
                          <option value="" disabled>اختر الولاية</option>
                          {shippingZones.map(z => <option key={z.id} value={z.name}>{z.name}</option>)}
                        </select>
                      )}
                      {field.id === 'city-select' && (
                        <select name="municipality" required={field.required} value={formData.municipality} onChange={handleInputChange} disabled={!formData.state} className="w-full p-3.5 border border-slate-300 rounded-xl font-bold text-sm bg-slate-50 transition-colors focus:border-[var(--primary)] focus:bg-white outline-none disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed">
                          <option value="" disabled>اختر البلدية</option>
                          {selectedZone?.municipalities?.split(',').map((m: string) => <option key={m.trim()} value={m.trim()}>{m.trim()}</option>)}
                        </select>
                      )}
                    </div>
                  );
                })}

                <div className="mb-6">
                  <label className="block text-[13px] font-black mb-2 text-slate-800">طريقة التوصيل <span className="text-red-500">*</span></label>
                  <select name="delivery_method" required value={formData.delivery_method} onChange={handleInputChange} className="w-full p-3.5 border border-slate-300 rounded-xl font-bold text-sm bg-slate-50 transition-colors focus:border-[var(--primary)] focus:bg-white outline-none">
                    <option value="home">توصيل للمنزل</option>
                    <option value="desk">توصيل للمكتب (نقطة استلام)</option>
                  </select>
                </div>

                <h3 className="text-[15px] font-black text-[var(--primary)] mt-6 mb-4 flex items-center gap-2 pb-2.5 border-b border-slate-100"><i className="fas fa-receipt"></i> ملخص الطلبية</h3>
                
                <div className="mb-4 pb-4 border-b border-dashed border-slate-100">
                  <label className="block text-sm font-black mb-2 text-[var(--primary)]"><i className="fas fa-ticket-alt"></i> رمز التخفيض (اختياري)</label>
                  <input type="text" name="coupon" value={formData.coupon} onChange={handleInputChange} placeholder="أدخل الكود هنا..." className={`w-full p-3 h-11 border border-slate-300 rounded-xl font-bold text-[13px] bg-slate-50 outline-none transition-colors ${couponInfo ? 'border-green-500 bg-green-50 text-green-600' : couponError ? 'border-red-500 bg-red-50 text-red-600' : 'focus:border-[var(--primary)] focus:bg-white'}`} />
                  <div className="text-xs font-black mt-2">
                    {couponLoading && <span className="text-slate-500"><i className="fas fa-spinner fa-spin"></i> جاري التحقق...</span>}
                    {couponInfo && <span className="text-green-600"><i className="fas fa-check-circle"></i> تم تطبيق التخفيض</span>}
                    {couponError && <span className="text-red-500"><i className="fas fa-times-circle"></i> {couponError}</span>}
                  </div>
                </div>

                <div className="flex justify-between font-black text-sm mb-2.5"><span className="text-[var(--primary)]">أسعار المنتجات</span> <span className="text-slate-800 dir-ltr">{productsCost.toLocaleString()} د.ج</span></div>
                <div className="flex justify-between font-black text-sm mb-2.5"><span className="text-[var(--primary)]">الشحن</span> <span className="text-slate-800 dir-ltr">{!formData.state ? '-' : shippingCost === 0 ? 'مجاني' : shippingCost.toLocaleString() + ' د.ج'}</span></div>
                {discountValue > 0 && (
                   <div className="flex justify-between font-black text-sm mb-2.5"><span className="text-[var(--primary)]">التخفيض</span> <span className="text-red-500 dir-ltr">-{discountValue.toLocaleString()} د.ج</span></div>
                )}
                
                <div className="flex justify-between font-black text-lg mt-1.5 pt-4 border-t border-dashed border-slate-300"><span className="text-[var(--primary)] text-base">المجموع النهائي</span> <span className="text-[var(--primary)] dir-ltr">{finalTotal.toLocaleString()} د.ج</span></div>

                <button type="submit" disabled={isSubmitting} className={`w-full bg-[var(--primary)] text-white border-none p-4 rounded-full font-black text-lg cursor-pointer flex justify-center items-center gap-2 mt-6 shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-transform active:scale-95 hover:brightness-110 ${isSubmitting ? 'opacity-75 cursor-not-allowed transform-none' : ''}`}>
                  {isSubmitting ? <><i className="fas fa-spinner fa-spin"></i> جاري الطلب...</> : <>{storeData?.checkout_settings?.design?.btn_text || 'أطلب الآن'} {!isMultiCart && <span className="bg-white/20 px-2 py-0.5 rounded-lg mx-1">{selectedOffer ? selectedOffer.qty : qty}</span>} <i className="fas fa-check-circle"></i></>}
                </button>
            </form>
        </div>

        {/* Right Column (Product/Cart Details) */}
        <div className="w-full lg:w-1/2 order-1 lg:order-2">
          {isMultiCart ? (
             <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
                <h2 className="text-lg font-black text-[var(--primary)] mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <i className="fas fa-box-open"></i> المنتجات المطلوبة
                </h2>
                <div>
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start py-4 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="flex gap-4">
                         <img src={item.image} className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border border-slate-200 bg-slate-50" alt="" />
                         <div className="pt-1">
                           <h4 className="text-sm font-extrabold text-slate-900 mb-1.5">{item.title}</h4>
                           <div className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full text-xs font-black inline-block">الكمية: {item.quantity}</div>
                           {item.offer_title && <div className="text-red-500 text-[11px] font-black mt-1">🎁 {item.offer_title}</div>}
                         </div>
                      </div>
                      <div className="text-left font-black text-[var(--primary)] text-base dir-ltr">
                        {(item.price * item.quantity).toLocaleString()} د.ج
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          ) : (
             <>
               {/* Single Product Details */}
               <div className="mb-5 px-4 md:px-0">
                 <div className="bg-white rounded-2xl p-0 overflow-hidden text-center mb-4 relative shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-slate-100">
                    {oldPrice > currentActivePrice && currentActivePrice > 0 && (
                      <div className="absolute top-3 right-3 bg-[var(--primary)] text-white px-4 py-1.5 rounded-full text-sm font-black z-10 shadow-[0_4px_10px_rgba(0,0,0,0.1)] dir-rtl">
                         تخفيض : {Math.round(((oldPrice - currentActivePrice) / oldPrice) * 100)}%
                      </div>
                    )}
                    <img src={selectedImage} className="w-full max-h-[400px] object-contain transition-opacity duration-200 block m-0" alt="Product" />
                 </div>
                 
                 {/* Thumbnails */}
                 {productData?.processed_gallery?.length > 0 && (
                   <div className="flex gap-3 overflow-x-auto pb-2 mb-6 scroll-smooth no-scrollbar">
                     {productData.processed_gallery.map((img: string, idx: number) => (
                       <img key={idx} src={img} onClick={() => setSelectedImage(img)} className={`w-20 h-20 object-cover rounded-xl border-2 cursor-pointer bg-slate-50 flex-shrink-0 transition-colors shadow-[0_2px_5px_rgba(0,0,0,0.05)] ${selectedImage === img ? 'border-[var(--primary)]' : 'border-transparent'}`} alt="" />
                     ))}
                   </div>
                 )}

                 <div className="text-right mb-6">
                   <h1 className="text-3xl font-black leading-snug mb-3 text-slate-900">{productData?.title}</h1>
                   <div className="text-slate-500 text-sm font-bold mb-4 leading-relaxed">{productData?.short_description}</div>
                   <div className="flex items-baseline gap-3 dir-rtl mt-2">
                     <div className="text-3xl font-black text-[var(--primary)] leading-none">{displayPrice.toLocaleString()} د.ج</div>
                     {oldPrice > currentActivePrice && <div className="text-lg text-slate-400 line-through font-bold">{oldPrice.toLocaleString()} د.ج</div>}
                   </div>
                 </div>

                 {/* Offers */}
                 {productData?.offers?.length > 0 && (
                   <div className="mb-6">
                     <div className="text-lg font-black text-[var(--primary)] mb-4 flex items-center gap-2 border-r-4 border-[var(--primary)] pr-3 text-right">
                       <i className="fas fa-tags"></i> عروض خاصة
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {productData.offers.map((offer: any) => {
                         const isSelected = selectedOffer?.id === offer.id;
                         const offerPrice = parseFloat(offer.price) || 0;
                         const offerQty = parseInt(offer.qty) || 1;
                         const offerTotal = offerPrice * offerQty;
                         return (
                           <div key={offer.id} onClick={() => setSelectedOffer(isSelected ? null : offer)} className={`bg-white rounded-xl p-4 border-2 relative cursor-pointer transition-all flex items-center justify-start gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-right dir-rtl ${isSelected ? 'border-[var(--primary)] bg-slate-50' : 'border-slate-200'}`}>
                              {offer.is_best && <div className="absolute top-0 left-0 bg-red-500 text-white px-3 py-1 rounded-br-xl rounded-tl-xl text-[11px] font-black shadow-[2px_2px_5px_rgba(0,0,0,0.1)] z-10">أفضل عرض <i className="fas fa-star text-[9px] mr-1"></i></div>}
                              <div className="w-[70px] h-[70px] rounded-lg shrink-0 relative border border-slate-200 bg-white flex items-center justify-center">
                                <img src={selectedImage} className="w-full h-full object-cover rounded-md" alt="" />
                                <div className="absolute -bottom-2 -left-2 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-[0_2px_5px_rgba(0,0,0,0.15)] border border-slate-200 z-10">
                                   <input type="radio" checked={isSelected} readOnly className={`appearance-none w-3.5 h-3.5 m-0 cursor-pointer border-2 rounded-full outline-none transition-colors relative ${isSelected ? 'border-[var(--primary)] bg-[var(--primary)]' : 'border-slate-300'}`} />
                                   {isSelected && <div className="absolute w-1.5 h-1.5 bg-white rounded-full pointer-events-none"></div>}
                                </div>
                              </div>
                              <div className="flex-1 text-right flex flex-col gap-1.5 pr-1">
                                <div className="text-[15px] font-black text-slate-900 m-0">{offer.title}</div>
                                <div className="flex gap-1.5 flex-wrap">
                                  <span className="bg-slate-100 text-slate-900 px-2 py-1 rounded-md text-[11px] font-extrabold flex items-center gap-1 border border-slate-200"><i className="fas fa-box"></i> {offerQty} قطع</span>
                                  {offer.free_shipping && <span className="bg-emerald-50 text-emerald-500 border border-emerald-200 px-2 py-1 rounded-md text-[11px] font-extrabold flex items-center gap-1"><i className="fas fa-truck"></i> توصيل مجاني</span>}
                                </div>
                              </div>
                              <div className="flex flex-col justify-center items-end shrink-0">
                                {offerQty > 1 && (
                                  <div className="text-[11px] text-slate-500 font-bold mb-0.5 flex items-center justify-end gap-1 dir-rtl">
                                    <span>{offerQty}</span><span>×</span><span className="dir-ltr">{offerPrice.toLocaleString()} د.ج</span>
                                  </div>
                                )}
                                <div className="text-lg font-black text-[var(--primary)] dir-ltr whitespace-nowrap text-left">{offerTotal.toLocaleString()} د.ج</div>
                              </div>
                           </div>
                         );
                       })}
                     </div>
                   </div>
                 )}

                 {/* Actions */}
                 <div className="flex items-center gap-4 mb-6">
                   <div className="flex items-center border border-slate-300 rounded-full h-12 w-[120px] bg-white shrink-0">
                     <button type="button" onClick={() => !selectedOffer && setQty(Math.max(1, qty + 1))} disabled={!!selectedOffer} className="w-10 bg-transparent border-none text-xl text-[var(--primary)] cursor-pointer font-bold transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">+</button>
                     <div className="flex-1 text-center font-extrabold text-slate-900">{selectedOffer ? selectedOffer.qty : qty}</div>
                     <button type="button" onClick={() => !selectedOffer && setQty(Math.max(1, qty - 1))} disabled={!!selectedOffer} className="w-10 bg-transparent border-none text-xl text-[var(--primary)] cursor-pointer font-bold transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">-</button>
                   </div>
                   {/* In a real scenario we could have "Add to cart" here too, but this is checkout page */}
                 </div>

                 {/* Policies */}
                 <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-right dir-rtl">
                    <div className="flex gap-4 items-start mb-4">
                      <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center text-[var(--primary)] text-lg shrink-0 border border-slate-200"><i className="fas fa-shield-alt"></i></div>
                      <div>
                        <h3 className="text-[15px] font-black text-slate-900 mb-1">سياسة الضمان</h3>
                        <p className="text-[13px] font-bold text-slate-500 leading-relaxed m-0">نضمن لكم جودة المنتج وفي حال وجود أي عيب مصنعي يتم استبداله فوراً.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center text-[var(--primary)] text-lg shrink-0 border border-slate-200"><i className="fas fa-truck"></i></div>
                      <div>
                        <h3 className="text-[15px] font-black text-slate-900 mb-1">سياسة التوصيل</h3>
                        <p className="text-[13px] font-bold text-slate-500 leading-relaxed m-0">توصيل سريع لـ 58 ولاية، الدفع يتم يداً بيد عند الاستلام.</p>
                      </div>
                    </div>
                 </div>
               </div>
             </>
          )}
        </div>
      </main>
    </div>
  );
}
