import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function InvoicePage() {
  const [searchParams] = useSearchParams();
  const storeSlug = searchParams.get('store');
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const dataStr = localStorage.getItem('latest_invoice');
    if (dataStr) {
      try {
        setInvoiceData(JSON.parse(dataStr));
      } catch (e) {
        console.error(e);
      }
    }
    // Simulate loading for the animation effect
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const primaryColor = invoiceData?.primary_color || '#2563eb';

  return (
    <div className="font-['Cairo'] bg-slate-50 min-h-screen text-slate-800 flex flex-col items-center justify-start pt-16 pb-5 px-2.5 antialiased" dir="rtl" style={{ '--primary': primaryColor } as React.CSSProperties}>
      
      <Link to={storeSlug ? `/shop?store=${storeSlug}` : '/'} className="fixed top-4 left-4 md:top-6 md:left-6 bg-[var(--primary)] text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full text-[13px] md:text-[15px] font-extrabold decoration-none flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-50 transition-transform active:scale-95">
        العودة <i className="fas fa-home"></i>
      </Link>

      <div className="w-full max-w-[480px] mx-auto">
        <div className="text-center mb-4">
          <div className="mx-auto mb-2.5 flex justify-center">
            {/* Animated SVG Checkmark */}
            <svg className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full block stroke-[4] stroke-[#16a34a] fill-none shadow-[inset_0_0_0_#16a34a] animate-[fill_0.4s_ease-in-out_0.4s_forwards,scale_0.3s_ease-in-out_0.9s_both]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="stroke-[#16a34a] stroke-[4] fill-none [stroke-dasharray:166] [stroke-dashoffset:166] animate-[stroke_0.6s_cubic-bezier(0.65,0,0.45,1)_forwards]" cx="26" cy="26" r="25"/>
                <path className="origin-center [stroke-dasharray:48] [stroke-dashoffset:48] animate-[stroke_0.3s_cubic-bezier(0.65,0,0.45,1)_0.8s_forwards]" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
          <h1 className="m-0 mb-1 text-lg md:text-[22px] font-black text-slate-900">تم استلام طلبك بنجاح</h1>
          <p className="m-0 text-slate-500 text-xs md:text-sm font-bold">شكراً لثقتك بنا، سيتم التواصل معك قريباً</p>
        </div>

        {isLoading ? (
          <div className="text-center text-slate-500 py-12 font-bold text-sm">
            <i className="fas fa-spinner fa-spin text-2xl mb-2.5 block"></i>
            جاري ترتيب الفاتورة...
          </div>
        ) : !invoiceData ? (
          <div className="bg-white rounded-2xl p-10 text-center text-red-500 font-bold text-sm border border-slate-100 shadow-sm">
            عذراً، لا توجد بيانات فاتورة لعرضها حالياً.
          </div>
        ) : (
          <div>
            {/* Products Card */}
            <div className="bg-white rounded-2xl md:rounded-[20px] mb-4 shadow-[0_4px_15px_rgba(0,0,0,0.03)] md:shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
              <div className="flex justify-between p-4 border-b border-slate-200 font-black text-[15px] text-black bg-slate-50">
                <span>المنتج</span>
                <span>سعر المنتج</span>
              </div>
              
              {invoiceData.cart_items?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-start p-4 border-b border-slate-100 gap-2.5">
                  <div className="flex gap-3 items-start flex-1">
                    <img src={item.image || 'https://via.placeholder.com/80'} className="w-[60px] h-[60px] rounded-lg object-cover border border-slate-200 bg-white" alt="" />
                    <div className="flex flex-col gap-1.5">
                      <div className="text-sm font-black text-black leading-tight">
                        {item.title} <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md text-[11px] font-extrabold mr-1">x{item.qty}</span>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {item.variations && Object.entries(item.variations).map(([k,v]: [string, any]) => (
                          <span key={k} className="bg-white border border-slate-200 px-2 py-0.5 rounded-lg text-[11px] font-extrabold text-slate-800 flex items-center gap-1 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                            {/^#([0-9A-F]{3}){1,2}$/i.test(v) ? (
                              <>{k} <span className="inline-block w-2.5 h-2.5 rounded-full border border-slate-300 align-middle" style={{backgroundColor: v}}></span></>
                            ) : v}
                          </span>
                        ))}
                        {item.offer_name && !item.offer_name.includes('توصيل مجاني') && (
                          <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-lg text-[11px] font-extrabold text-red-500 flex items-center gap-1 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                            <i className="fas fa-gift"></i> {item.offer_name}
                          </span>
                        )}
                        {String(item.free_shipping).toLowerCase() === 'true' && (
                          <span className="bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg text-[11px] font-extrabold text-red-500 flex items-center gap-1 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                            <i className="fas fa-gift"></i> توصيل مجاني متضمن
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-[15px] font-black text-[var(--primary)] dir-ltr whitespace-nowrap pt-1">
                    {(item.price * item.qty).toLocaleString()} د.ج
                  </div>
                </div>
              ))}

              <div className="p-4 bg-white">
                <div className="flex justify-between text-sm font-black mb-3 text-black">
                  <span>إجمالي سعر المنتجات</span>
                  <span className="dir-ltr">{invoiceData.sub_total}</span>
                </div>
                <div className="flex justify-between text-sm font-black mb-3 text-black">
                  <span>سعر التوصيل</span>
                  <span className="dir-ltr">{invoiceData.shipping_cost}</span>
                </div>
                {invoiceData.discount && invoiceData.discount !== '0 د.ج' && (
                  <div className="flex justify-between text-sm font-black mb-3 text-red-500">
                    <span>التخفيض</span>
                    <span className="dir-ltr">{invoiceData.discount}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-base font-black border-t border-slate-200 pt-4 mt-1">
                  <span>المجموع</span>
                  <span className="text-[var(--primary)] text-lg dir-ltr">{invoiceData.total_price}</span>
                </div>
              </div>
            </div>

            {/* Customer Info Card */}
            <div className="bg-white rounded-2xl md:rounded-[20px] mb-4 shadow-[0_4px_15px_rgba(0,0,0,0.03)] md:shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
              <div className="p-3 md:p-4 border-b border-dashed border-slate-200 font-black text-sm md:text-base text-[var(--primary)] flex items-center gap-2 bg-[#fafbfd]">
                <i className="fas fa-user"></i> معلومات الزبون
              </div>
              <div className="flex justify-between items-center p-2.5 md:p-3.5 border-b border-dotted border-slate-300 gap-2.5">
                <span className="text-slate-500 text-[12.5px] md:text-sm font-extrabold min-w-max">الاسم:</span>
                <span className="text-black text-[13px] md:text-[14.5px] font-black text-left flex items-center justify-end gap-1 break-words">{invoiceData.customer_name}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 md:p-3.5 border-b border-dotted border-slate-300 gap-2.5">
                <span className="text-slate-500 text-[12.5px] md:text-sm font-extrabold min-w-max">الهاتف:</span>
                <span className="text-slate-900 text-[13px] md:text-[14.5px] font-extrabold text-left flex items-center justify-end gap-1 break-words dir-ltr">{invoiceData.phone}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 md:p-3.5 border-b border-dotted border-slate-300 gap-2.5">
                <span className="text-slate-500 text-[12.5px] md:text-sm font-extrabold min-w-max">الولاية:</span>
                <span className="text-slate-900 text-[13px] md:text-[14.5px] font-extrabold text-left flex items-center justify-end gap-1 break-words dir-rtl">{invoiceData.state}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 md:p-3.5 border-b border-dotted border-slate-300 gap-2.5">
                <span className="text-slate-500 text-[12.5px] md:text-sm font-extrabold min-w-max">البلدية:</span>
                <span className="text-slate-900 text-[13px] md:text-[14.5px] font-extrabold text-left flex items-center justify-end gap-1 break-words dir-rtl">{invoiceData.municipality}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 md:p-3.5 border-b border-dotted border-slate-300 gap-2.5">
                <span className="text-slate-500 text-[12.5px] md:text-sm font-extrabold min-w-max">التوصيل:</span>
                <span className="text-slate-900 text-[13px] md:text-[14.5px] font-extrabold text-left flex items-center justify-end gap-1 break-words dir-rtl">
                  {invoiceData.delivery_method} 
                  {invoiceData.delivery_method?.includes('مكتب') ? <i className="fas fa-building text-slate-500 text-[13px] mr-1"></i> : <i className="fas fa-truck text-slate-500 text-[13px] mr-1"></i>}
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 md:p-3.5 gap-2.5">
                <span className="text-slate-500 text-[12.5px] md:text-sm font-extrabold min-w-max">الحالة:</span>
                <span className="text-slate-900 text-[13px] md:text-[14.5px] font-extrabold text-left flex items-center justify-end gap-1 break-words">
                  <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-lg text-[11.5px] md:text-[12.5px] font-black">
                    {invoiceData.delivery_status || 'قيد التجهيز'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
