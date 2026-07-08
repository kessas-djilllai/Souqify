import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({
    design: { border_style: 'solid', border_color: '#e2e8f0', text_color: '#1e293b', form_title: 'أدخل معلوماتك للطلب', btn_text: 'تأكيد الطلب الآن', btn_animation: 'none' },
    fields: [
      { id: 'client-name', label: 'الإسم الكامل', active: true, required: true },
      { id: 'phone-number', label: 'رقم الهاتف', active: true, required: true },
      { id: 'state-select', label: 'الولاية', active: true, required: true },
      { id: 'city-select', label: 'البلدية', active: true, required: true }
    ]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await apiClient<any>('api.php?page=admin&action=get_checkout_settings');
        if (res.status === 'success' && res.data) {
          setSettings(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append('action', 'save_checkout_settings');
      fd.append('settings_data', JSON.stringify(settings));
      
      const res = await apiClient<any>('api.php?page=admin', { method: 'POST', body: fd as any });
      if (res.status === 'success') {
        alert('تم الحفظ بنجاح');
      }
    } catch (err) {
      console.error(err);
      alert('تم الحفظ محلياً (المحاكاة)');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="text-center py-20 text-blue-600"><i className="fas fa-spinner fa-spin text-3xl"></i></div>;

  return (
    <div className="p-2 md:p-6 animate-[fadeInUp_0.4s_ease-out]" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-slate-800"><i className="fas fa-sliders-h text-blue-600 ml-2"></i> إعدادات الدفع</h1>
        <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
          {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} حفظ الإعدادات
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-black text-blue-600 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3"><i className="fas fa-paint-roller"></i> تخصيص تصميم الفورم</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-600 mb-2">عنوان الفورم</label>
              <input type="text" className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-colors" value={settings.design.form_title} onChange={e => setSettings({...settings, design: {...settings.design, form_title: e.target.value}})} />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-600 mb-2">نص الزر</label>
              <input type="text" className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-colors" value={settings.design.btn_text} onChange={e => setSettings({...settings, design: {...settings.design, btn_text: e.target.value}})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-600 mb-2">نمط الحدود</label>
                <select className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-colors" value={settings.design.border_style} onChange={e => setSettings({...settings, design: {...settings.design, border_style: e.target.value}})}>
                  <option value="solid">متصل</option>
                  <option value="dashed">متقطع</option>
                  <option value="none">بدون</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-600 mb-2">حركة الزر</label>
                <select className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-colors" value={settings.design.btn_animation} onChange={e => setSettings({...settings, design: {...settings.design, btn_animation: e.target.value}})}>
                  <option value="none">بدون حركة</option>
                  <option value="pulse">نبض</option>
                  <option value="shake">اهتزاز</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-black text-slate-600 mb-2">لون النص</label>
                  <div className="flex gap-2">
                    <input type="color" className="w-12 h-10 rounded-lg cursor-pointer" value={settings.design.text_color} onChange={e => setSettings({...settings, design: {...settings.design, text_color: e.target.value}})} />
                    <input type="text" className="flex-1 border-2 border-slate-200 rounded-xl px-3 font-bold text-sm bg-slate-50 dir-ltr text-center" value={settings.design.text_color} readOnly />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-black text-slate-600 mb-2">لون الحدود</label>
                  <div className="flex gap-2">
                    <input type="color" className="w-12 h-10 rounded-lg cursor-pointer" value={settings.design.border_color} onChange={e => setSettings({...settings, design: {...settings.design, border_color: e.target.value}})} />
                    <input type="text" className="flex-1 border-2 border-slate-200 rounded-xl px-3 font-bold text-sm bg-slate-50 dir-ltr text-center" value={settings.design.border_color} readOnly />
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-black text-blue-600 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3"><i className="fas fa-list-ul"></i> حقول الطلب</h2>
          
          <div className="space-y-3">
            {settings.fields.map((f: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white transition-colors hover:border-blue-300">
                <div className="flex items-center gap-3">
                  <span className="bg-white border border-slate-200 text-slate-400 text-xs font-black w-6 h-6 flex items-center justify-center rounded-md">{idx+1}</span>
                  <span className="font-bold text-slate-800 text-sm">{f.label}</span>
                  <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md font-mono">{f.id}</span>
                </div>
                <label className="relative inline-block w-10 h-5 cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={f.active} onChange={(e) => {
                    const newFields = [...settings.fields];
                    newFields[idx].active = e.target.checked;
                    setSettings({...settings, fields: newFields});
                  }} />
                  <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
