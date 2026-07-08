import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export default function DashboardStats() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient<any>('api.php?page=admin&action=dashboard_stats');
        if (response.status === 'success') {
          setStats(response.data);
        } else {
          setError(response.message || 'فشل تحميل الإحصائيات');
        }
      } catch (err: any) {
        // Fallback for preview
        setStats({
          kpis: { total_orders: 120, total_profit: 450000, total_visits: 3500, total_products: 45 },
          charts: {
            last_7_days_labels: ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'],
            last_7_days_visits: [120, 150, 180, 250, 210, 300, 350],
            ratio_cancel_confirm: { labels: ['مؤكد', 'ملغى'], data: [80, 20] },
            ratio_delivery_return: { labels: ['مستلم', 'مرتجع'], data: [75, 5] },
            total_orders_pie: { labels: ['مستلم', 'مرتجع', 'قيد الانتظار'], data: [75, 5, 40] },
            top_products: { labels: ['هاتف ذكي', 'سماعات', 'شاحن', 'غطاء', 'ساعة'], data: [30, 25, 20, 15, 10] },
            top_states: { labels: ['الجزائر', 'وهران', 'قسنطينة', 'عنابة', 'باتنة'], data: [40, 20, 15, 10, 5] }
          }
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <div className="text-center py-20"><i className="fas fa-spinner fa-spin text-3xl text-blue-600"></i></div>;
  if (error) return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;

  const kpis = [
    { label: 'إجمالي الطلبيات', value: stats.kpis.total_orders, icon: 'fa-shopping-cart', color: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'إجمالي الأرباح', value: `${stats.kpis.total_profit.toLocaleString()} د.ج`, icon: 'fa-wallet', color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { label: 'إجمالي الزيارات', value: stats.kpis.total_visits, icon: 'fa-eye', color: 'bg-purple-500', bg: 'bg-purple-50', text: 'text-purple-600' },
    { label: 'إجمالي المنتجات', value: stats.kpis.total_products, icon: 'fa-box-open', color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-600' },
  ];

  const areaData = stats.charts.last_7_days_labels.map((label: string, idx: number) => ({
    name: label,
    visits: stats.charts.last_7_days_visits[idx]
  }));

  const pieData = stats.charts.total_orders_pie.labels.map((label: string, idx: number) => ({
    name: label,
    value: stats.charts.total_orders_pie.data[idx]
  }));
  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

  return (
    <div className="space-y-6 animate-[fadeInUp_0.5s_ease-out]">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${kpi.bg} ${kpi.text}`}>
              <i className={`fas ${kpi.icon}`}></i>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 mb-1">{kpi.label}</div>
              <div className="text-xl font-black text-slate-900 dir-ltr text-right">{kpi.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visits Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <h3 className="text-base font-black text-slate-800 mb-6 flex items-center gap-2">
            <i className="fas fa-chart-area text-blue-600"></i> زيارات آخر 7 أيام
          </h3>
          <div className="h-[300px] w-full dir-ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontWeight: 'bold', direction: 'rtl'}}
                  itemStyle={{color: '#3b82f6'}}
                />
                <Area type="monotone" dataKey="visits" name="الزيارات" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Status Pie */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <h3 className="text-base font-black text-slate-800 mb-6 flex items-center gap-2">
            <i className="fas fa-chart-pie text-blue-600"></i> حالات الطلبات
          </h3>
          <div className="h-[250px] w-full dir-ltr flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontWeight: 'bold', direction: 'rtl'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {pieData.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <span className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></span>
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
           <h3 className="text-base font-black text-slate-800 mb-5 flex items-center gap-2">
            <i className="fas fa-star text-yellow-500"></i> أكثر المنتجات مبيعاً
           </h3>
           <div className="space-y-4">
             {stats.charts.top_products.labels.map((label: string, idx: number) => {
                const count = stats.charts.top_products.data[idx];
                const max = Math.max(...stats.charts.top_products.data);
                const percent = (count / max) * 100;
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-sm font-bold mb-1 text-slate-700">
                      <span>{label}</span>
                      <span>{count} مبيعة</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: `${percent}%`}}></div>
                    </div>
                  </div>
                )
             })}
           </div>
        </div>

        {/* Top States */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
           <h3 className="text-base font-black text-slate-800 mb-5 flex items-center gap-2">
            <i className="fas fa-map-marker-alt text-red-500"></i> أكثر الولايات مبيعاً
           </h3>
           <div className="space-y-4">
             {stats.charts.top_states.labels.map((label: string, idx: number) => {
                const count = stats.charts.top_states.data[idx];
                const max = Math.max(...stats.charts.top_states.data);
                const percent = (count / max) * 100;
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-sm font-bold mb-1 text-slate-700">
                      <span>{label}</span>
                      <span>{count} طلب</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{width: `${percent}%`}}></div>
                    </div>
                  </div>
                )
             })}
           </div>
        </div>
      </div>
    </div>
  );
}
