import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar,
  XAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  LayoutDashboard, Users, Package,
  MessageSquare, Settings as SettingsIcon, LogOut, Search, Bell, User, CheckCircle, DollarSign, Video
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { farmerService } from '../services/farmerService';
import { paymentService } from '../services/paymentService';
import { harvestService } from '../services/harvestService';
import { fieldService } from '../services/fieldService';
import { reportService } from '../services/reportService';

const ManagerDashboardEnhanced: React.FC = () => {
  const { logout, user } = useAuth();
  const [farmers, setFarmers] = useState<any[]>([]);
  const [harvests, setHarvests] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [activeFields, setActiveFields] = useState(0);
  const [needsAttentionFields, setNeedsAttentionFields] = useState(0);
  const [activeMenu, setActiveMenu] = useState<'Dashboard' | 'Field Officer' | 'Financial Manager' | 'Approvals' | 'Reports'>('Dashboard');
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<{title:string; time:string; type:'pending'|'paid'|'rejected'}>>([]);
  const [selectedNotification, setSelectedNotification] = useState<{ title: string; time?: string; type: 'pending'|'paid'|'rejected'; desc?: string } | null>(null);
  const [showSendFO, setShowSendFO] = useState(false);
  const [sendForm, setSendForm] = useState<{title:string; message:string; urgency:'low'|'normal'|'high'}>({title:'', message:'', urgency:'normal'});
  const [sending, setSending] = useState(false);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [submittingDecision, setSubmittingDecision] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [farmersData, harvestsData, paymentsData, fieldsData] = await Promise.all([
        farmerService.getAllFarmers(),
        harvestService.getAllHarvests(),
        paymentService.getAllPayments(),
        fieldService.getAllFields(),
      ]);

      const farmersArr = Array.isArray(farmersData)
        ? farmersData
        : (farmersData?.data || farmersData?.items || farmersData?.farmers || []);
      const harvestsArr = Array.isArray(harvestsData)
        ? harvestsData
        : (harvestsData?.data || harvestsData?.items || []);
      const paymentsArr = Array.isArray(paymentsData)
        ? paymentsData
        : (paymentsData?.data || paymentsData?.items || []);

      const fieldsArr = Array.isArray(fieldsData)
        ? fieldsData
        : (fieldsData?.data || fieldsData?.items || []);

      setFarmers(farmersArr);
      setHarvests(harvestsArr);
      setPayments(paymentsArr);
      setFields(fieldsArr);

      const active = fieldsArr.filter((x: any) => (x.health_status === 'healthy' || x.health_status === 'needs_attention')).length;
      const needs = fieldsArr.filter((x: any) => x.health_status === 'needs_attention').length;
      setActiveFields(active);
      setNeedsAttentionFields(needs);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Build notifications: payments + budget requests sent to manager
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = Array.isArray(payments) ? payments : [];
      const payNotifs = list
        .slice()
        .sort((a:any,b:any)=> new Date(b.created_at||0).getTime() - new Date(a.created_at||0).getTime())
        .slice(0,10)
        .map((p:any) => ({
          title: `${(p.status||'pending').toString().toUpperCase()}: UGX ${Number(p.amount||0).toLocaleString()}`,
          time: p.created_at ? new Date(p.created_at).toLocaleString() : '',
          type: (p.status==='paid' ? 'paid' : (p.status==='rejected' ? 'rejected' : 'pending')) as 'pending'|'paid'|'rejected'
        }));

      let budgetNotifs: Array<{title:string; time:string; type:'pending'|'paid'|'rejected'}> = [];
      try {
        const res = await reportService.getReportsByType('payment_report');
        const arr = Array.isArray(res) ? res : (res?.data || res?.items || []);
        const mgr = (arr || []).filter((r:any) => String(r?.data?.sent_to || '').toLowerCase() === 'manager');
        budgetNotifs = mgr.slice(0,10).map((r:any) => {
          const cat = String(r?.data?.category || '').toLowerCase();
          const total = Number(r?.data?.total_amount || 0);
          const titleBase = cat === 'budget_request' ? 'BUDGET REQUEST' : 'BUDGET UPDATE';
          return {
            title: `${titleBase}: UGX ${isNaN(total)?'0':total.toLocaleString()}`,
            time: r.created_at ? new Date(r.created_at).toLocaleString() : '',
            type: 'pending' as const
          };
        });
      } catch {}

      const merged = [...budgetNotifs, ...payNotifs]
        .sort((a,b)=> new Date(b.time||0).getTime() - new Date(a.time||0).getTime())
        .slice(0,10);
      if (!cancelled) setNotifications(merged);
    })();
    return () => { cancelled = true; };
  }, [payments]);

  // Device stats data
  const deviceStatsData = [
    { day: 'Mon', devices: 95 },
    { day: 'Tue', devices: 97 },
    { day: 'Wed', devices: 94 },
    { day: 'Thu', devices: 98 },
    { day: 'Fri', devices: 96 }
  ];

  // Payments status summary
  const paymentStatusCounts = React.useMemo(() => {
    const list = Array.isArray(payments) ? payments : [];
    const agg = { pending: 0, approved: 0, paid: 0, rejected: 0 } as Record<string, number>;
    list.forEach((p: any) => {
      const s = String(p.status || 'pending').toLowerCase();
      if (s in agg) agg[s] += 1; else agg.pending += 1;
    });
    return agg;
  }, [payments]);
  const paymentStatusData = [
    { status: 'Pending', count: paymentStatusCounts.pending, color: '#f59e0b' },
    { status: 'Approved', count: paymentStatusCounts.approved, color: '#3b82f6' },
    { status: 'Paid', count: paymentStatusCounts.paid, color: '#10b981' },
    { status: 'Rejected', count: paymentStatusCounts.rejected, color: '#ef4444' },
  ];
  // Crop distribution (by tons) built from harvests
  const cropDistributionData = React.useMemo(() => {
    const map: Record<string, number> = {};
    (harvests || []).forEach((h: any) => {
      const name = h.crop_name || h.cropName || 'Other';
      const qty = Number(h.quantity_tons ?? h.quantityTons ?? h.quantity ?? 0);
      map[name] = (map[name] || 0) + (isNaN(qty) ? 0 : qty);
    });
    const palette = ['#8b5cf6','#22c55e','#3b82f6','#f59e0b','#ef4444','#14b8a6','#06b6d4'];
    return Object.entries(map).map(([name, value], i) => ({ name, value, color: palette[i % palette.length] }));
  }, [harvests]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900">
      {/* Header */}
      <div className="bg-teal-800 border-b border-teal-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-teal-600 p-3 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Farm Management</h1>
              <p className="text-sm text-teal-200">System Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-teal-300" />
              <input 
                type="text" 
                placeholder="Type here..." 
                className="bg-teal-700/50 border border-teal-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setNotifOpen(v => !v)}
                className="relative p-2 text-teal-200 hover:text-white"
              >
                <Bell className="w-6 h-6" />
                {payments.filter((p:any)=>p.status==='pending').length > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] leading-4 rounded-full text-center">
                    {Math.min(99, payments.filter((p:any)=>p.status==='pending').length)}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-teal-900 border border-teal-700 rounded-lg shadow-lg z-50">
                  <div className="px-3 py-2 border-b border-teal-700 text-sm text-white font-medium">Finance Notifications</div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-3 py-3 text-teal-300 text-sm">No notifications</div>
                    ) : notifications.map((n, idx) => (
                      <button key={idx} onClick={() => setSelectedNotification(n)} className="w-full text-left px-3 py-2 flex items-start gap-2 hover:bg-teal-800/60">
                        <span className={`mt-1 w-2 h-2 rounded-full ${n.type==='paid' ? 'bg-green-400' : n.type==='rejected' ? 'bg-red-400' : 'bg-yellow-400'}`}></span>
                        <div className="flex-1">
                          <div className="text-sm text-white">{n.title}</div>
                          <div className="text-xs text-teal-300">{n.time}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="px-3 py-2 border-t border-teal-700 text-right">
                    <button onClick={() => setActiveMenu('Financial Manager')} className="text-xs text-cyan-300 hover:text-cyan-200">Open Finance</button>
                  </div>
                </div>
              )}
            </div>
            <button className="relative p-2 text-teal-200 hover:text-white">
              <SettingsIcon className="w-6 h-6" />
            </button>
            <button className="relative p-2 text-teal-200 hover:text-white">
              <MessageSquare className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-teal-800 min-h-screen border-r border-teal-700 p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveMenu('Field Officer')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeMenu === 'Field Officer' ? 'bg-teal-600 text-white' : 'text-teal-200 hover:bg-teal-700'}`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Field Officer</span>
            </button>
            <button
              onClick={() => setActiveMenu('Financial Manager')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeMenu === 'Financial Manager' ? 'bg-teal-600 text-white' : 'text-teal-200 hover:bg-teal-700'}`}
            >
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">Financial Manager</span>
            </button>
            <button
              onClick={() => setShowSendFO(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-teal-900 bg-cyan-400/90 hover:bg-cyan-400"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Send to Field Officer</span>
            </button>
            <button
              onClick={() => setActiveMenu('Approvals')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeMenu === 'Approvals' ? 'bg-teal-600 text-white' : 'text-teal-200 hover:bg-teal-700'}`}
            >
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Approvals</span>
            </button>
            <button
              onClick={() => setActiveMenu('Reports')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeMenu === 'Reports' ? 'bg-teal-600 text-white' : 'text-teal-200 hover:bg-teal-700'}`}
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Reports</span>
            </button>
            
            <button 
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-600/20"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-semibold">{activeMenu === 'Dashboard' ? 'Manager Overview' : activeMenu}</h2>
            <div className="text-teal-200 text-sm">
              <button className={`mr-2 ${activeMenu === 'Dashboard' ? 'underline' : ''}`} onClick={() => setActiveMenu('Dashboard')}>Dashboard</button>
              <span>/</span>
              <span className="ml-2">{activeMenu}</span>
            </div>
          </div>
          
          {/* header action buttons */}
          <div className="flex items-center gap-3 mb-4">
            <button className="relative p-2 text-teal-200 hover:text-white">
              <SettingsIcon className="w-6 h-6" />
            </button>
            <button className="relative p-2 text-teal-200 hover:text-white">
              <MessageSquare className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          {activeMenu === 'Dashboard' && (
            <>
              <div className="mt-2 text-xs">
                <div className="text-emerald-200">Default: <span className="font-mono text-white">admin123</span></div>
                <div className="text-emerald-200">Change via server ENV ADMIN_SECRET.</div>
                {/* Backup Code Help */}
                <div className="bg-emerald-600/30 rounded-lg p-3">
                  <div className="text-xs text-emerald-100">On account creation, a one-time backup code is generated. Keep it safe. If you lose access, use “Login with Backup Code”.</div>
                </div>
              {selectedNotification && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
                  <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6" id="printable-notif-mgr">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">Notification Details</h3>
                      <button onClick={()=> setSelectedNotification(null)} className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm">Close</button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="font-medium">{selectedNotification.title}</div>
                      {selectedNotification.desc && <div className="text-gray-700">{selectedNotification.desc}</div>}
                      {selectedNotification.time && <div className="text-xs text-gray-500">{selectedNotification.time}</div>}
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        onClick={() => {
                          const node = document.getElementById('printable-notif-mgr');
                          if (!node) return window.print();
                          const w = window.open('', '_blank', 'width=800,height=600');
                          if (!w) return;
                          w.document.write(`<html><head><title>Notification</title></head><body>${node.innerHTML}</body></html>`);
                          w.document.close();
                          w.focus();
                          w.print();
                          w.close();
                        }}
                        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                      >Print</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
              {/* Weather */}
              <div className="lg:col-span-3 bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-sm font-semibold mb-3">Weather Report</h3>
                <p className="text-xs text-teal-200 mb-4">Welcome back and have a nice day!</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-5xl font-bold">37°C</div>
                    <div className="text-sm mt-1">77% Humidity</div>
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-4xl">
                    ☀️
                  </div>
                </div>
                <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  📊 Report us
                </button>
              </div>

            {/* Forecast */}
            <div className="lg:col-span-5 bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-sm font-semibold mb-4">Forecast by Google</h3>
              <div className="space-y-2">
                {[
                  { date: 'Mon 11/02', icon: '☀️', high: '40°C', low: '18°C' },
                  { date: 'Tue 12/02', icon: '☁️', high: '30°C', low: '17°C' },
                  { date: 'Wed 13/02', icon: '☁️', high: '28°C', low: '16°C' },
                  { date: 'Thu 14/02', icon: '🌧️', high: '27°C', low: '15°C' },
                  { date: 'Fri 16/02', icon: '☀️', high: '33°C', low: '19°C' }
                ].map((day, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-teal-600/30 rounded px-3 py-2">
                    <span className="text-xs w-20">{day.date}</span>
                    <span className="text-xl">{day.icon}</span>
                    <span className="text-xs text-right w-24">{day.high} - {day.low}</span>
                  </div>
                ))}
              </div>
            </div>

            
          </div>

          {/* Removed secondary cards per user request */}

          {/* Removed Field Officers and Farmers Management panels per user request */}

          {/* Fifth Row: CCTV, Devices, Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* CCTV */}
            <div className="lg:col-span-6 bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">CCTV</h3>
                <button className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-xs">View All</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-gray-800/50 px-2 py-1 rounded">⚫ Off</span>
                    <span className="text-xs">Field Camera 1</span>
                  </div>
                  <div className="flex items-center justify-center h-24 text-5xl">
                    <Video className="w-12 h-12" />
                  </div>
                  <div className="mt-2 text-center text-xs">Field Camera 1</div>
                  <div className="text-center text-xs text-orange-200">Camera Offline</div>
                  <button className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs">● Start</button>
                </div>
                <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-gray-800/50 px-2 py-1 rounded">⚫ Off</span>
                    <span className="text-xs">Barn Camera 2</span>
                  </div>
                  <div className="flex items-center justify-center h-24 text-5xl">
                    <Video className="w-12 h-12" />
                  </div>
                  <div className="mt-2 text-center text-xs">Barn Camera 2</div>
                  <div className="text-center text-xs text-gray-400">Camera Offline</div>
                  <button className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs">● Start</button>
                </div>
              </div>
            </div>

            {/* Crop Distribution */}
            <div className="lg:col-span-3 bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-sm font-semibold mb-2">Crop Distribution</h3>
              {cropDistributionData.length === 0 ? (
                <div className="text-xs text-teal-200">No harvest data yet.</div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={cropDistributionData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                        {cropDistributionData.map((entry, index) => (
                          <Cell key={`mgr-cd-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v:any)=>[`${v} tons`, 'Quantity']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-3 space-y-1 text-xs">
                    {cropDistributionData.slice(0,5).map((d, i) => (
                      <div key={`mgr-cd-leg-${i}`} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                          <span className="text-teal-200">{d.name}</span>
                        </div>
                        <span className="text-white font-semibold">{d.value} tons</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Payments Status */}
            <div className="lg:col-span-3 bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-sm font-semibold mb-2">Payments Status</h3>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="flex items-center justify-between bg-teal-700/40 rounded px-2 py-1"><span>Pending</span><span className="font-semibold text-yellow-300">{paymentStatusCounts.pending}</span></div>
                <div className="flex items-center justify-between bg-teal-700/40 rounded px-2 py-1"><span>Approved</span><span className="font-semibold text-blue-300">{paymentStatusCounts.approved}</span></div>
                <div className="flex items-center justify-between bg-teal-700/40 rounded px-2 py-1"><span>Paid</span><span className="font-semibold text-green-300">{paymentStatusCounts.paid}</span></div>
                <div className="flex items-center justify-between bg-teal-700/40 rounded px-2 py-1"><span>Rejected</span><span className="font-semibold text-red-300">{paymentStatusCounts.rejected}</span></div>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={paymentStatusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="status" stroke="rgba(255,255,255,0.5)" tick={{ fill: '#fff', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1d2e', border: 'none', borderRadius: '8px' }} formatter={(v:any)=>[v,'Count']} />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Stats */}
            <div className="lg:col-span-3 bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-sm font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-teal-200">Active Farmers</span>
                  <span className="text-2xl font-bold">248</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-teal-200">Total Fields</span>
                  <span className="text-2xl font-bold">{fields.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-teal-200">Active Fields</span>
                  <span className="text-2xl font-bold">{activeFields}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-teal-200">Needs Attention</span>
                  <span className="text-2xl font-bold text-yellow-300">{needsAttentionFields}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Field Activity & Recent Crops */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* Field Activity Stats */}
            <div className="lg:col-span-4 bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-sm font-semibold mb-4">Field Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-teal-200">Healthy</span>
                  <span className="text-2xl font-bold text-green-400">{fields.filter((f:any)=>f.health_status==='healthy').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-teal-200">Needs Attention</span>
                  <span className="text-2xl font-bold text-yellow-300">{needsAttentionFields}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-teal-200">Critical</span>
                  <span className="text-2xl font-bold text-red-300">{fields.filter((f:any)=>f.health_status==='critical').length}</span>
                </div>
              </div>
            </div>

            {/* Recent Crop Records from Field Officers */}
            <div className="lg:col-span-8 bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Crop Records</h3>
                <button className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-xs">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-teal-600">
                      <th className="text-left py-3">Farmer</th>
                      <th className="text-left py-3">Location</th>
                      <th className="text-left py-3">Crop</th>
                      <th className="text-left py-3">Variety</th>
                      <th className="text-left py-3">Size (ha)</th>
                      <th className="text-left py-3">Expected Yield (kg)</th>
                      <th className="text-left py-3">Stage</th>
                      <th className="text-left py-3">Visit Type</th>
                      <th className="text-left py-3">Health</th>
                      <th className="text-left py-3">Notes</th>
                      <th className="text-left py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Array.isArray(fields) ? fields : [])
                      .slice()
                      .sort((a:any,b:any)=> new Date(b.created_at||b.planting_date||0).getTime() - new Date(a.created_at||a.planting_date||0).getTime())
                      .slice(0,6)
                      .map((f:any, idx:number)=> (
                        <tr key={idx} className="border-b border-teal-600/40">
                          <td className="py-3">{f.farmer_id || 'N/A'}</td>
                          <td className="py-3">{f.location || 'N/A'}</td>
                          <td className="py-3">{f.crop_type || f.crop_name || 'N/A'}</td>
                          <td className="py-3">{f.variety || '—'}</td>
                          <td className="py-3">{f.size_hectares ?? '—'}</td>
                          <td className="py-3">{(f.expected_yield_kg ?? '—')}</td>
                          <td className="py-3">{f.crop_stage || '—'}</td>
                          <td className="py-3">{f.visit_type || '—'}</td>
                          <td className="py-3">{f.health_status || '—'}</td>
                          <td className="py-3">{f.notes ? String(f.notes).slice(0,24) + (String(f.notes).length>24?'…':'') : '—'}</td>
                          <td className="py-3">{f.planting_date ? new Date(f.planting_date).toLocaleDateString() : (f.created_at ? new Date(f.created_at).toLocaleDateString() : '—')}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          </>)}

          {activeMenu === 'Field Officer' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Field Activity Stats */}
              <div className="lg:col-span-4 bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-sm font-semibold mb-4">Field Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-teal-200">Healthy</span>
                    <span className="text-2xl font-bold text-green-400">{fields.filter((f:any)=>f.health_status==='healthy').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-teal-200">Needs Attention</span>
                    <span className="text-2xl font-bold text-yellow-300">{needsAttentionFields}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-teal-200">Critical</span>
                    <span className="text-2xl font-bold text-red-300">{fields.filter((f:any)=>f.health_status==='critical').length}</span>
                  </div>
                </div>
              </div>

              {/* Recent Crop Records */}
              <div className="lg:col-span-8 bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent Crop Records</h3>
                  <button className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-xs">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-teal-600">
                        <th className="text-left py-3">Farmer</th>
                        <th className="text-left py-3">Location</th>
                        <th className="text-left py-3">Crop</th>
                        <th className="text-left py-3">Size (ha)</th>
                        <th className="text-left py-3">Stage</th>
                        <th className="text-left py-3">Health</th>
                        <th className="text-left py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(Array.isArray(fields) ? fields : [])
                        .slice()
                        .sort((a:any,b:any)=> new Date(b.created_at||b.planting_date||0).getTime() - new Date(a.created_at||a.planting_date||0).getTime())
                        .slice(0,8)
                        .map((f:any, idx:number)=> (
                          <tr key={idx} className="border-b border-teal-600/40">
                            <td className="py-3">{f.farmer_id || 'N/A'}</td>
                            <td className="py-3">{f.location || 'N/A'}</td>
                            <td className="py-3">{f.crop_type || f.crop_name || 'N/A'}</td>
                            <td className="py-3">{f.size_hectares ?? '—'}</td>
                            <td className="py-3">{f.crop_stage || '—'}</td>
                            <td className="py-3">{f.health_status || '—'}</td>
                            <td className="py-3">{f.planting_date ? new Date(f.planting_date).toLocaleDateString() : (f.created_at ? new Date(f.created_at).toLocaleDateString() : '—')}</td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Financial Manager' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-sm font-semibold mb-2">Total Revenue</h3>
                  <div className="text-3xl font-bold text-green-400">UGX {(payments.filter((p: any) => p.status === 'paid').reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0) / 1000000).toFixed(1)}M</div>
                </div>
                <div className="bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-sm font-semibold mb-2">Transactions</h3>
                  <div className="text-3xl font-bold text-blue-400">{payments.length}</div>
                </div>
                <div className="bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-sm font-semibold mb-2">Pending</h3>
                  <div className="text-3xl font-bold text-yellow-300">{payments.filter((p: any) => p.status === 'pending').length}</div>
                </div>
              </div>
            </>
          )}

          {activeMenu === 'Approvals' && (
            <div className="bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Approvals</h3>
              <div className="text-sm text-teal-200">Pending payments: {payments.filter((p: any) => p.status === 'pending').length}</div>
              <div className="mt-6 bg-teal-900/40 rounded-lg p-4 border border-teal-600">
                <div className="text-sm font-medium mb-2">Decision Report to Finance</div>
                <label className="block text-xs text-teal-200 mb-1">Notes</label>
                <textarea
                  value={decisionNotes}
                  onChange={(e)=>setDecisionNotes(e.target.value)}
                  className="w-full rounded-md bg-teal-800 border border-teal-600 text-white placeholder-teal-300 px-3 py-2 h-24"
                  placeholder="Add any notes for Finance (optional)"
                />
                <div className="mt-3 flex items-center gap-3">
                  <button
                    disabled={submittingDecision}
                    onClick={async ()=>{
                      try {
                        setSubmittingDecision(true);
                        await reportService.createReport({
                          type: 'payment_report',
                          generated_by: (user as any)?._id || (user as any)?.id,
                          date_range_start: new Date() as any,
                          date_range_end: new Date() as any,
                          data: {
                            category: 'manager_decision',
                            decision: 'approved',
                            notes: decisionNotes || undefined,
                            sent_to: 'finance',
                          },
                        } as any);
                        setDecisionNotes('');
                        alert('Decision sent to Finance: Approved');
                      } catch {
                        alert('Failed to send decision');
                      } finally { setSubmittingDecision(false); }
                    }}
                    className={`px-4 py-2 rounded-md text-teal-900 ${submittingDecision ? 'bg-emerald-300' : 'bg-emerald-400 hover:bg-emerald-300'}`}
                  >Approve</button>
                  <button
                    disabled={submittingDecision}
                    onClick={async ()=>{
                      try {
                        setSubmittingDecision(true);
                        await reportService.createReport({
                          type: 'payment_report',
                          generated_by: (user as any)?._id || (user as any)?.id,
                          date_range_start: new Date() as any,
                          date_range_end: new Date() as any,
                          data: {
                            category: 'manager_decision',
                            decision: 'rejected',
                            notes: decisionNotes || undefined,
                            sent_to: 'finance',
                          },
                        } as any);
                        setDecisionNotes('');
                        alert('Decision sent to Finance: Rejected');
                      } catch {
                        alert('Failed to send decision');
                      } finally { setSubmittingDecision(false); }
                    }}
                    className={`px-4 py-2 rounded-md text-white ${submittingDecision ? 'bg-red-500/70' : 'bg-red-500 hover:bg-red-400'}`}
                  >Reject</button>
                </div>
              </div>
            </div>
          )}

          {showSendFO && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6" role="dialog" aria-modal="true">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Message Field Officer</h3>
                  <button onClick={()=>setShowSendFO(false)} className="text-sm px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200">Close</button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input value={sendForm.title} onChange={e=>setSendForm(s=>({...s, title:e.target.value}))} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="Enter title" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea value={sendForm.message} onChange={e=>setSendForm(s=>({...s, message:e.target.value}))} className="mt-1 w-full border rounded-md px-3 py-2 h-28" placeholder="Details for the field officer" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Urgency</label>
                    <select value={sendForm.urgency} onChange={e=>setSendForm(s=>({...s, urgency:e.target.value as any}))} className="mt-1 w-full border rounded-md px-3 py-2">
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button onClick={()=>setShowSendFO(false)} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">Cancel</button>
                  <button
                    disabled={sending || !sendForm.title || !sendForm.message}
                    onClick={async ()=>{
                      try{
                        setSending(true);
                        await reportService.createReport({
                          type: 'performance',
                          generated_by: (user as any)?._id || (user as any)?.id,
                          date_range_start: new Date(),
                          date_range_end: new Date(),
                          data: {
                            category: 'manager_to_field',
                            sent_to: 'field_officer',
                            title: sendForm.title,
                            message: sendForm.message,
                            urgency: sendForm.urgency,
                          },
                        } as any);
                        setShowSendFO(false);
                        setSendForm({title:'', message:'', urgency:'normal'});
                        alert('Sent to Field Officer');
                      }catch(e){
                        alert('Failed to send.');
                      }finally{
                        setSending(false);
                      }
                    }}
                    className={`px-4 py-2 rounded text-white ${sending ? 'bg-cyan-400' : 'bg-cyan-600 hover:bg-cyan-700'}`}
                  >{sending ? 'Sending…' : 'Send'}</button>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Reports' && (
            <div className="bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Reports</h3>
                <button
                  onClick={() => {
                    const node = document.getElementById('mgr-report-print');
                    if (!node) return window.print();
                    const w = window.open('', '_blank', 'width=1000,height=700');
                    if (!w) return;
                    w.document.write(`<html><head><title>Manager Report</title></head><body>${node.innerHTML}</body></html>`);
                    w.document.close(); w.focus(); w.print(); w.close();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-teal-500 text-teal-900 hover:bg-teal-400 text-sm font-medium"
                >Print</button>
              </div>
              <div className="text-sm text-teal-200 mb-4">Farmers: {farmers.length} • Harvests: {harvests.length} • Payments: {payments.length}</div>
              <div id="mgr-report-print" className="space-y-6 text-teal-50">
                <div className="bg-teal-900/40 rounded-lg p-4 border border-teal-600">
                  <div className="font-semibold mb-2">Farmers</div>
                  <div className="overflow-auto">
                    <table className="min-w-full text-sm">
                      <thead className="text-teal-200">
                        <tr>
                          <th className="text-left pr-4 py-2">ID</th>
                          <th className="text-left pr-4 py-2">Name</th>
                          <th className="text-left pr-4 py-2">Contact</th>
                          <th className="text-left pr-4 py-2">Registered</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-teal-700/60">
                        {farmers.map((f:any) => (
                          <tr key={String(f._id || f.id)}>
                            <td className="py-2 pr-4 font-mono text-xs">{String(f._id || f.id).slice(0,8)}…</td>
                            <td className="py-2 pr-4">{f.name || f.full_name || f.first_name || '—'}</td>
                            <td className="py-2 pr-4">{f.phone || f.email || '—'}</td>
                            <td className="py-2 pr-4">{f.registration_date ? new Date(f.registration_date).toLocaleDateString() : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-teal-900/40 rounded-lg p-4 border border-teal-600">
                  <div className="font-semibold mb-2">Harvests</div>
                  <div className="overflow-auto">
                    <table className="min-w-full text-sm">
                      <thead className="text-teal-2 00">
                        <tr>
                          <th className="text-left pr-4 py-2">Field</th>
                          <th className="text-left pr-4 py-2">Farmer</th>
                          <th className="text-left pr-4 py-2">Crop</th>
                          <th className="text-left pr-4 py-2">Qty (tons)</th>
                          <th className="text-left pr-4 py-2">Quality</th>
                          <th className="text-left pr-4 py-2">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-teal-700/60">
                        {harvests.map((h:any) => (
                          <tr key={String(h._id || h.id)}>
                            <td className="py-2 pr-4 font-mono text-xs">{String(h.field_id || h.fieldId || '—').toString().slice(0,8)}…</td>
                            <td className="py-2 pr-4 font-mono text-xs">{String(h.farmer_id || '—').toString().slice(0,8)}…</td>
                            <td className="py-2 pr-4">{h.crop_name || h.cropName || '—'}</td>
                            <td className="py-2 pr-4">{Number(h.quantity_tons ?? h.quantityTons ?? h.quantity ?? 0)}</td>
                            <td className="py-2 pr-4">{h.quality_grade || h.quality || '—'}</td>
                            <td className="py-2 pr-4">{h.harvest_date ? new Date(h.harvest_date).toLocaleDateString() : (h.date ? new Date(h.date).toLocaleDateString() : '—')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-teal-900/40 rounded-lg p-4 border border-teal-600">
                  <div className="font-semibold mb-2">Payments</div>
                  <div className="overflow-auto">
                    <table className="min-w-full text-sm">
                      <thead className="text-teal-200">
                        <tr>
                          <th className="text-left pr-4 py-2">ID</th>
                          <th className="text-left pr-4 py-2">Farmer</th>
                          <th className="text-left pr-4 py-2">Amount</th>
                          <th className="text-left pr-4 py-2">Status</th>
                          <th className="text-left pr-4 py-2">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-teal-700/60">
                        {payments.map((p:any) => (
                          <tr key={String(p._id || p.id)}>
                            <td className="py-2 pr-4 font-mono text-xs">{String(p._id || p.id).slice(0,8)}…</td>
                            <td className="py-2 pr-4 font-mono text-xs">{String(p.farmer_id || '—').toString().slice(0,8)}…</td>
                            <td className="py-2 pr-4">{Number(p.amount || 0).toLocaleString()}</td>
                            <td className="py-2 pr-4 capitalize">{String(p.status || 'pending')}</td>
                            <td className="py-2 pr-4">{p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          
        </div>
      </div>
    </div>
      );
};

export default ManagerDashboardEnhanced;
