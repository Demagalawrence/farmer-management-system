import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, TrendingUp, Users, DollarSign, Truck, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';
import UserProfileDropdown from './UserProfileDropdown';
import FieldGoogleMap from './FieldGoogleMap';
import ProcessPaymentModal from './ProcessPaymentModal';
import { useToast } from './Toast';
import { paymentService } from '../services/paymentService';
import { financeService } from '../services/financeService';
import { harvestService } from '../services/harvestService';
import { farmerService } from '../services/farmerService';
import { formatUGX } from '../utils/currency';

const ManagerDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const { showToast, ToastComponent } = useToast();
  const [pendingPayments, setPendingPayments] = React.useState<any[]>([]);
  const [ppLoading, setPpLoading] = React.useState(false);
  const [ppError, setPpError] = React.useState('');
  const [approvals, setApprovals] = React.useState<any[]>([]);
  const [approvalsLoading, setApprovalsLoading] = React.useState(false);
  const [approvalsError, setApprovalsError] = React.useState('');
  const [allPayments, setAllPayments] = React.useState<any[]>([]);
  const [approvedPayments, setApprovedPayments] = React.useState<any[]>([]);
  const [recentHarvests, setRecentHarvests] = React.useState<any[]>([]);
  const [ratesModalOpen, setRatesModalOpen] = React.useState(false);
  const [ratesLoading, setRatesLoading] = React.useState(false);
  const [ratesError, setRatesError] = React.useState('');
  const [ratesData, setRatesData] = React.useState<{ farmerId: string; totalQuantity: number; harvests: any[]; lastDate?: string } | null>(null);
  const [farmers, setFarmers] = React.useState<any[]>([]);
  const [allFarmsModalOpen, setAllFarmsModalOpen] = React.useState(false);
  const [processPaymentModalOpen, setProcessPaymentModalOpen] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState<any>(null);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setPpLoading(true);
        setPpError('');
        const [pendingRes, approvalsRes, approvedRes, allPaysRes, farmersRes, harvestsRes] = await Promise.all([
          paymentService.getPaymentsByStatus('pending'),
          financeService.getApprovalRequests('pending'),
          paymentService.getPaymentsByStatus('approved'),
          paymentService.getAllPayments(),
          farmerService.getAllFarmers(),
          harvestService.getAllHarvests(),
        ]);
        if (!mounted) return;
        console.log('📊 [Manager Dashboard] Approved payments response:', approvedRes);
        const approvedData = Array.isArray(approvedRes) ? approvedRes : (approvedRes?.data || approvedRes?.items || []);
        console.log('📊 [Manager Dashboard] Approved payments data:', approvedData);
        setPendingPayments(Array.isArray(pendingRes) ? pendingRes : (pendingRes?.data || pendingRes?.items || []));
        setApprovals(approvalsRes?.data || approvalsRes || []);
        setApprovedPayments(approvedData);
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

  const openProcessPaymentModal = (payment: any) => {
    setSelectedPayment(payment);
    setProcessPaymentModalOpen(true);
  };

  const handlePaymentProcessed = async () => {
    // Reload approved payments
    try {
      const approvedRes = await paymentService.getPaymentsByStatus('approved');
      setApprovedPayments(Array.isArray(approvedRes) ? approvedRes : (approvedRes?.data || approvedRes?.items || []));
      showToast('✅ Payment processed successfully! Farmer will receive mobile money/bank alert.', 'success');
    } catch (e) {
      setApprovalsError('Failed to reload payments');
      showToast('❌ Failed to reload payments', 'error');
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
      {/* Premium Gradient Header - Matching Financial Manager & Field Officer Style */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-[#6B2C91] via-[#9932CC] to-[#E85D75] shadow-lg">
        <div className="w-full px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section - Logo and Title */}
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full border-2 border-white bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-3xl">🌾</span>
                </div>
              </div>
              
              {/* Title */}
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-white leading-tight">Manager Portal</h1>
                <p className="text-xs text-white/80">Farm Management System</p>
              </div>
            </div>
            
            {/* Right Section - Utilities */}
            <div className="flex items-center space-x-1">
              {/* Notifications */}
              <div className="flex flex-col items-center space-y-1">
                <NotificationBell />
                <span className="text-xs font-medium text-white">Notifications</span>
              </div>
              
              {/* User Profile Dropdown */}
              <UserProfileDropdown
                userName={user?.name || 'Manager'}
                onLogout={logout}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Add top padding to account for fixed header */}
      <div className="pt-20"></div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
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

            {/* Approved Payments - Ready to Process */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Approved Payments - Ready to Process</h2>
                  <p className="text-xs text-gray-500 mt-1">Payments approved by Financial Manager, awaiting final processing</p>
                </div>
                {approvalsLoading && <span className="text-sm text-gray-500">Loading...</span>}
              </div>
              {approvalsError && <p className="text-sm text-red-600 mb-3">{approvalsError}</p>}
              {approvedPayments.length === 0 && !approvalsLoading ? (
                <p className="text-sm text-gray-600">No approved payments waiting.</p>
              ) : (
                <div className="space-y-3">
                  {approvedPayments.slice(0,6).map((p) => (
                    <div key={(p._id || p.id) as string} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm text-gray-800">
                        <div className="font-medium">Farmer: {(p.farmer_id && p.farmer_id.toString) ? p.farmer_id.toString() : (p.farmer_id || '—')}</div>
                        <div className="text-gray-600">Amount: {formatUGX(Number(p.amount))}</div>
                        <div className="text-xs text-green-600 mt-1">✓ Approved by Financial Manager</div>
                      </div>
                      <button
                        onClick={() => openProcessPaymentModal(p)}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all"
                      >
                        💰 Process Payment
                      </button>
                    </div>
                  ))}
                </div>
              )}
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

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Map and Charts */}
            <div className="lg:col-span-2 space-y-8">
              {/* Farm Locations Map */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">Farm Locations</h2>
                    <span className="text-xs text-gray-500">Interactive map showing all registered farms</span>
                  </div>
                  <button 
                    onClick={() => setAllFarmsModalOpen(!allFarmsModalOpen)}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white rounded-lg hover:from-[#6D28D9] hover:to-[#7C3AED] transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    {allFarmsModalOpen ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        Hide Farms List
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        View All Farms ({farmers.length})
                      </>
                    )}
                  </button>
                </div>
                
                <div className="relative z-0">
                  <FieldGoogleMap farmers={farmers} height="400px" />
                </div>
                <p className="mt-2 text-xs text-gray-500">Click on map markers to view farmer details and work rates.</p>

                {/* Farms List - Collapsible */}
                {allFarmsModalOpen && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">All Registered Farms ({farmers.length})</h3>
                      <p className="text-sm text-gray-500">Complete list with details and GPS status</p>
                    </div>
                    
                    {farmers.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>No farms registered yet</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {farmers.map((farmer, index) => (
                          <div 
                            key={farmer._id} 
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-bold">
                                    {index + 1}
                                  </span>
                                  <h4 className="font-semibold text-gray-900">{farmer.name || 'Unknown Farmer'}</h4>
                                </div>
                                <p className="text-xs text-gray-500">ID: {String(farmer._id).substring(0, 12)}...</p>
                              </div>
                              {farmer.location?.coordinates ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                  </svg>
                                  GPS
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  No GPS
                                </span>
                              )}
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>{farmer.contact || farmer.phone || 'No contact'}</span>
                              </div>
                              
                              {farmer.crops && farmer.crops.length > 0 && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                  </svg>
                                  <span className="truncate">{farmer.crops.join(', ')}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <button 
                                onClick={() => openWorkRates(String(farmer._id))}
                                className="w-full px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                              >
                                View Work Rates & Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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

            {/* Right Column - Crop Distribution & Activities */}
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

      {/* Work Rates Modal */}
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

      {/* Process Payment Modal */}
      {selectedPayment && (
        <ProcessPaymentModal
          isOpen={processPaymentModalOpen}
          onClose={() => setProcessPaymentModalOpen(false)}
          payment={selectedPayment}
          onSuccess={handlePaymentProcessed}
        />
      )}

      {/* Toast Notifications */}
      {ToastComponent}
    </div>
    </>
  );
};

export default ManagerDashboard;
