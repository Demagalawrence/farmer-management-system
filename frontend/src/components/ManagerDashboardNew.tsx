import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, TrendingUp, Users, DollarSign, Truck, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { paymentService } from '../services/paymentService';
import { financeService } from '../services/financeService';
import { harvestService } from '../services/harvestService';
import { farmerService } from '../services/farmerService';
import { formatUGX } from '../utils/currency';

const ManagerDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [pendingPayments, setPendingPayments] = React.useState<any[]>([]);
  const [ppLoading, setPpLoading] = React.useState(false);
  const [ppError, setPpError] = React.useState('');
  const [approvals, setApprovals] = React.useState<any[]>([]);
  const [approvalsLoading, setApprovalsLoading] = React.useState(false);
  const [approvalsError, setApprovalsError] = React.useState('');
  const [allPayments, setAllPayments] = React.useState<any[]>([]);
  const [recentHarvests, setRecentHarvests] = React.useState<any[]>([]);
  const [ratesModalOpen, setRatesModalOpen] = React.useState(false);
  const [ratesLoading, setRatesLoading] = React.useState(false);
  const [ratesError, setRatesError] = React.useState('');
  const [ratesData, setRatesData] = React.useState<{ farmerId: string; totalQuantity: number; harvests: any[]; lastDate?: string } | null>(null);
  const [farmers, setFarmers] = React.useState<any[]>([]);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setPpLoading(true);
        setPpError('');
        const [pendingRes, approvalsRes, allPaysRes, farmersRes, harvestsRes] = await Promise.all([
          paymentService.getPaymentsByStatus('pending'),
          financeService.getApprovalRequests('pending'),
          paymentService.getAllPayments(),
          farmerService.getAllFarmers(),
          harvestService.getAllHarvests(),
        ]);
        if (!mounted) return;
        setPendingPayments(Array.isArray(pendingRes) ? pendingRes : (pendingRes?.items || []));
        setApprovals(approvalsRes?.data || approvalsRes || []);
        setAllPayments(allPaysRes?.data || allPaysRes || []);
        setFarmers(farmersRes?.data || farmersRes || []);
        const hvArr = Array.isArray(harvestsRes) ? harvestsRes : (harvestsRes?.data || harvestsRes?.items || []);
        setRecentHarvests(hvArr
          .slice()
          .sort((a:any,b:any)=> new Date(b.harvest_date||b.created_at||0).getTime()-new Date(a.harvest_date||a.created_at||0).getTime())
          .slice(0,6)
        );
      } catch (e) {
        if (!mounted) return;
        setPpError('Failed to load pending payments');
        setApprovalsError('Failed to load finance requests');
      } finally {
        if (mounted) setPpLoading(false);
        if (mounted) setApprovalsLoading(false);
      }
    };
    setApprovalsLoading(true);
    load();
    return () => { mounted = false; };
  }, []);

  const approvePayment = async (id: string) => {
    try {
      await paymentService.updatePayment(id, { status: 'approved' });
      setPendingPayments((prev) => prev.filter((p) => (p._id || p.id) !== id));
    } catch (e) {
      setPpError('Approval failed');
    }
  };
  // Map markers come from farmers list; default layout used when coords are absent

  // Performance metrics data
  const performanceData = [
    { metric: 'Crop Yield', value: 85, color: '#22c55e' },
    { metric: 'Efficiency', value: 92, color: '#3b82f6' },
    { metric: 'Quality Score', value: 78, color: '#f59e0b' },
    { metric: 'Sustainability', value: 88, color: '#10b981' }
  ];

  // Revenue analytics data
  const revenueData = [
    { month: 'Jan', revenue: 45000, profit: 12000 },
    { month: 'Feb', revenue: 52000, profit: 15000 },
    { month: 'Mar', revenue: 48000, profit: 13500 },
    { month: 'Apr', revenue: 61000, profit: 18000 },
    { month: 'May', revenue: 55000, profit: 16500 },
    { month: 'Jun', revenue: 67000, profit: 20000 },
    { month: 'Jul', revenue: 58000, profit: 17500 },
    { month: 'Aug', revenue: 72000, profit: 22000 },
    { month: 'Sep', revenue: 65000, profit: 19500 },
    { month: 'Oct', revenue: 69000, profit: 21000 },
    { month: 'Nov', revenue: 63000, profit: 18500 },
    { month: 'Dec', revenue: 75000, profit: 23000 }
  ];

  // Crop distribution data
  const cropDistributionData = [
    { name: 'Wheat', value: 35, color: '#f59e0b', acres: 1200 },
    { name: 'Corn', value: 25, color: '#22c55e', acres: 850 },
    { name: 'Rice', value: 20, color: '#3b82f6', acres: 680 },
    { name: 'Vegetables', value: 12, color: '#ef4444', acres: 410 },
    { name: 'Fruits', value: 8, color: '#8b5cf6', acres: 270 }
  ];

  // Recent activities data
  const recentActivities = [
    { id: 1, activity: 'Harvest completed at North Farm', time: '2 hours ago', type: 'harvest' },
    { id: 2, activity: 'New irrigation system installed', time: '4 hours ago', type: 'maintenance' },
    { id: 3, activity: 'Quality inspection passed', time: '6 hours ago', type: 'inspection' },
    { id: 4, activity: 'Fertilizer application scheduled', time: '8 hours ago', type: 'treatment' },
    { id: 5, activity: 'Equipment maintenance completed', time: '1 day ago', type: 'maintenance' }
  ];

  // Key metrics for cards
  const keyMetrics = [
    { title: 'Total Revenue', value: 'UGX 742K', change: '+12.5%', icon: DollarSign, color: 'text-green-600' },
    { title: 'Active Farms', value: '24', change: '+2', icon: MapPin, color: 'text-blue-600' },
    { title: 'Total Workers', value: '156', change: '+8', icon: Users, color: 'text-purple-600' },
    { title: 'Equipment', value: '89', change: '+3', icon: Truck, color: 'text-orange-600' }
  ];

  // Manager decisions on finance approval requests
  const decideApproval = async (id: string, decision: 'approved' | 'denied') => {
    try {
      await financeService.decideApproval(id, decision);
      setApprovals((prev) => prev.filter((r) => String(r._id || r.id) !== id));
    } catch (e) {
      setApprovalsError(`Failed to ${decision} request`);
    }
  };

  // Open farmer work rates (aggregated from recent harvests)
  const openWorkRates = async (farmerId: string) => {
    try {
      setRatesLoading(true);
      setRatesError('');
      const res = await harvestService.getHarvestsByFarmerId(farmerId);
      const list = (res && (res as any).data) ? (res as any).data : (Array.isArray(res) ? (res as any) : []);
      const totalQuantity = list.reduce((sum: number, h: any) => sum + Number(h.quantity || 0), 0);
      const last = list.length ? new Date(Math.max.apply(null, list.map((h: any) => new Date(h.harvest_date || h.date || Date.now()).getTime()))) : null;
      setRatesData({ farmerId, totalQuantity, harvests: list.slice(0, 10), lastDate: last ? last.toLocaleDateString() : undefined });
      setRatesModalOpen(true);
    } catch (e) {
      setRatesError('Failed to load work rates');
    } finally {
      setRatesLoading(false);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🌾</span>
                </div>

            {/* Finance Requests (Notifications) */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Finance Requests</h2>
                {approvalsLoading && <span className="text-sm text-gray-500">Loading...</span>}
              </div>
              {approvalsError && <p className="text-sm text-red-600 mb-3">{approvalsError}</p>}
              {(!approvals || approvals.length === 0) ? (
                <p className="text-sm text-gray-600">No approval requests.</p>
              ) : (
                <div className="space-y-3">
                  {approvals.slice(0,6).map((req) => {
                    const payIds: string[] = (req.payment_ids || []).map((x: any) => String(x));
                    const pays = allPayments.filter((p) => payIds.includes(String(p._id || p.id)));
                    const farmerIds = Array.from(new Set(pays.map((p) => String(p.farmer_id))));
                    const total = req.total_amount || pays.reduce((s: number, p: any) => s + Number(p.amount || 0), 0);
                    return (
                      <div key={String(req._id || req.id)} className="p-3 bg-gray-50 rounded-lg border">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-800">
                            <div className="font-medium">Total: {formatUGX(Number(total))} · {farmerIds.length} farmer(s)</div>
                            <div className="text-gray-600 text-xs">Note: {req.note || '—'}</div>
                          </div>
                          <div className="space-x-2">
                            <button onClick={() => decideApproval(String(req._id || req.id), 'approved')} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm">Approve</button>
                            <button onClick={() => decideApproval(String(req._id || req.id), 'denied')} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm">Deny</button>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {farmerIds.slice(0,4).map((fid) => (
                            <button key={fid} onClick={() => openWorkRates(fid)} className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">
                              View Work Rates ({fid.substring(0,6)}…)
                            </button>
                          ))}
                          {farmerIds.length > 4 && <span className="text-xs text-gray-500">+{farmerIds.length - 4} more</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pending Payments (Manager Approval) */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Pending Payment Approvals</h2>
                {ppLoading && <span className="text-sm text-gray-500">Loading...</span>}
              </div>
              {ppError && <p className="text-sm text-red-600 mb-3">{ppError}</p>}
              {pendingPayments.length === 0 && !ppLoading ? (
                <p className="text-sm text-gray-600">No pending requests.</p>
              ) : (
                <div className="space-y-3">
                  {pendingPayments.slice(0,6).map((p) => (
                    <div key={(p._id || p.id) as string} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-800">
                        <div className="font-medium">Farmer: {(p.farmer_id && p.farmer_id.toString) ? p.farmer_id.toString() : (p.farmer_id || '—')}</div>
                        <div className="text-gray-600">Amount: {formatUGX(Number(p.amount))}</div>
                      </div>
                      <button
                        onClick={() => approvePayment((p._id || p.id) as string)}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                      >
                        Approve
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
                <span className="text-xl font-bold text-gray-900">AGRO</span>
                <span className="text-sm text-gray-500">FARM MANAGEMENT</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
              <button className="p-2 bg-gray-100 rounded-lg">
                <span className="text-lg">🔔</span>
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              {/* Logout Button */}
              <button 
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium shadow-lg hover:shadow-xl"
                title="Logout"
              >
                🚪 Logout
              </button>
            </div>

            {/* Recent Harvests */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Recent Harvests</h2>
              </div>
              {(!recentHarvests || recentHarvests.length===0) ? (
                <p className="text-sm text-gray-600">No recent harvests.</p>
              ) : (
                <div className="space-y-3">
                  {recentHarvests.map((h:any, idx:number)=>{
                    const farmerName = (farmers.find((f:any)=> String(f._id)===String(h.farmer_id))?.name) || String(h.farmer_id).substring(0,6)+"…";
                    return (
                      <div key={(h._id||idx) as any} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-800">
                          <div className="font-medium">{farmerName}</div>
                          <div className="text-gray-600 text-xs">{h.crop_type || 'Crop'} · {Number(h.quantity_tons||0).toLocaleString()} tons</div>
                        </div>
                        <div className="text-xs text-gray-500">{h.harvest_date ? new Date(h.harvest_date).toLocaleDateString() : '—'}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {keyMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                  <p className={`text-sm ${metric.color} mt-1`}>{metric.change} from last month</p>
                </div>
                <div className={`p-3 rounded-lg bg-gray-100`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Map and Performance */}
          <div className="lg:col-span-2 space-y-8">
            {/* Farm Locations Map (Default layout if no coordinates) */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Farm Locations</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800">View All Farms</button>
              </div>
              
              {/* Default Map: simple gradient background with deterministic markers for farmers */}
              <div className="relative h-80 bg-gradient-to-br from-green-100 to-green-200 rounded-lg overflow-hidden border-2 border-green-100">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200"></div>
                
                {/* Deterministic positions derived from index so markers always render */}
                {(farmers && farmers.length ? farmers : Array.from({ length: 6 }).map((_, i) => ({ _id: `demo-${i}`, name: `Farm ${i+1}` })) ).map((f: any, index: number) => {
                  const left = 10 + (index * 17) % 70; // 10% to 80%
                  const top = 20 + (index * 13) % 60;  // 20% to 80%
                  const color = 'bg-green-600';
                  return (
                    <div
                      key={String(f._id || index)}
                      className={`group absolute w-4 h-4 rounded-full ${color} border-2 border-white shadow-lg cursor-pointer`}
                      style={{ left: `${left}%`, top: `${top}%` }}
                      title={f.name || 'Farmer'}
                      onClick={() => openWorkRates(String(f._id || ''))}
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-gray-700 text-xs px-2 py-1 rounded shadow">
                        {f.name || 'Farmer'}
                      </div>
                    </div>
                  );
                })}
                
                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-md">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span>Farmers</span>
                    </div>
                  </div>
                </div>
                
                {/* Info hint */}
                <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-md text-xs text-gray-600">
                  Click markers to view work rates
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Performance Metrics</h2>
              <div className="grid grid-cols-2 gap-6">
                {performanceData.map((item, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{item.metric}</span>
                      <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${item.value}%`,
                          backgroundColor: item.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Analytics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Revenue Analytics</h2>
                <select className="text-sm border border-gray-300 rounded px-3 py-1">
                  <option>Last 12 Months</option>
                  <option>Last 6 Months</option>
                  <option>Last 3 Months</option>
                </select>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                    <Bar dataKey="profit" fill="#22c55e" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column - Crop Distribution, Recent Activities, Recent Harvests */}
          <div className="space-y-8">
            {/* Crop Distribution */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Crop Distribution</h2>
              
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cropDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {cropDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {cropDistributionData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{item.value}%</div>
                      <div className="text-xs text-gray-500">{item.acres} acres</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Recent Activities</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
              </div>

              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'harvest' ? 'bg-green-500' :
                      activity.type === 'maintenance' ? 'bg-blue-500' :
                      activity.type === 'inspection' ? 'bg-yellow-500' :
                      'bg-purple-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                  <Package className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">Add Crop</span>
                </button>
                <button className="p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                  <MapPin className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">New Farm</span>
                </button>
                <button className="p-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                  <Users className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">Add Worker</span>
                </button>
                <button className="p-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors">
                  <TrendingUp className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">Reports</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {(ratesModalOpen && ratesData) ? (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Farmer Work Rates</h3>
          {ratesLoading ? (
            <p className="text-sm text-gray-600">Loading...</p>
          ) : ratesError ? (
            <p className="text-sm text-red-600">{ratesError}</p>
          ) : (
            <div className="text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Farmer ID</span>
                <span className="font-medium">{ratesData!.farmerId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Total Harvest Quantity</span>
                <span className="font-medium">{Number(ratesData!.totalQuantity).toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Last Harvest Date</span>
                <span className="font-medium">{ratesData!.lastDate || '—'}</span>
              </div>
              <div className="max-h-48 overflow-auto border rounded">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-gray-600">
                      <th className="py-1 px-2">Date</th>
                      <th className="py-1 px-2">Crop</th>
                      <th className="py-1 px-2">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratesData!.harvests.map((h, i) => (
                      <tr key={i} className="border-t">
                        <td className="py-1 px-2">{h.harvest_date ? new Date(h.harvest_date).toLocaleDateString() : '—'}</td>
                        <td className="py-1 px-2">{h.crop_type || '—'}</td>
                        <td className="py-1 px-2">{Number(h.quantity || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <button onClick={() => setRatesModalOpen(false)} className="px-4 py-2 rounded bg-gray-200 text-gray-800">Close</button>
          </div>
        </div>
      </div>
    ) : null}
    </>
  );
};

export default ManagerDashboard;
