import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, AlertTriangle, PieChart as PieChartIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { paymentService } from '../services/paymentService';
import { farmerService } from '../services/farmerService';
import { formatUGX } from '../utils/currency';
import TopNavigationBar from './TopNavigationBar';
import ReportDistributionModal from './ReportDistributionModal';
import { useToast } from './Toast';

const FinancialManagerDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const { showToast, ToastComponent } = useToast();
  const [allPayments, setAllPayments] = React.useState<any[]>([]);
  const [apLoading, setApLoading] = React.useState(false);
  const [apError, setApError] = React.useState('');
  const pendingRef = React.useRef<HTMLDivElement | null>(null);
  const [farmers, setFarmers] = React.useState<any[]>([]);
  const [showReportModal, setShowReportModal] = React.useState(false);

  // Helpers and derived finance statistics
  const currency = (n: number) => formatUGX(n);
  const totalDueAll = React.useMemo(() =>
    allPayments
      .filter((p) => p.status === 'pending' || p.status === 'approved')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0)
  , [allPayments]);
  const pendingCount = React.useMemo(() => allPayments.filter((p) => p.status === 'pending').length, [allPayments]);
  const approvedCount = React.useMemo(() => allPayments.filter((p) => p.status === 'approved').length, [allPayments]);
  const paidCount = React.useMemo(() => allPayments.filter((p) => p.status === 'paid').length, [allPayments]);
  const farmersCount = React.useMemo(() => farmers.length, [farmers]);

  const renderStatusBadge = (s: string) => {
    const base = 'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide';
    if (s === 'pending') return <span className={`${base} bg-yellow-100 text-yellow-800`}>PENDING</span>;
    if (s === 'approved') return <span className={`${base} bg-blue-100 text-blue-800`}>APPROVED</span>;
    if (s === 'paid') return <span className={`${base} bg-green-100 text-green-800`}>PAID</span>;
    if (s === 'rejected') return <span className={`${base} bg-red-100 text-red-800`}>REJECTED</span>;
    return <span className={`${base} bg-gray-100 text-gray-700`}>—</span>;
  };

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setApLoading(true);
        setApError('');
        const [allPays, farmersRes] = await Promise.all([
          paymentService.getAllPayments(),
          farmerService.getAllFarmers()
        ]);
        if (!mounted) return;
        const all = Array.isArray(allPays?.data) ? allPays.data : (Array.isArray(allPays) ? allPays : []);
        setAllPayments(all);
        setFarmers(farmersRes?.data || []);
      } catch (e) {
        if (!mounted) return;
        setApError('Failed to load approved payments');
      } finally {
        if (mounted) setApLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const approvePending = async (id: string) => {
    try {
      await paymentService.updatePayment(id, { status: 'approved' } as any);
      // Update state to reflect approval
      setAllPayments((prev) => 
        prev.map((p) => (String(p._id || p.id) === id ? { ...p, status: 'approved' } : p))
      );
      showToast('✅ Payment approved and sent to Manager for processing', 'success');
    } catch (e) {
      showToast('❌ Failed to approve payment', 'error');
    }
  };
  const handleGenerateInvoice = () => {
    // TODO: Implement invoice generation flow
    alert('Generate Invoice: This feature will open the invoice creation flow.');
  };
  const handleFinancialReport = () => {
    setShowReportModal(true);
  };

  const handlePendingClick = () => {
    pendingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const handleBudgetPlanning = () => {
    // TODO: Implement budget planning navigation/modal
    alert('Budget Planning: This will open the budget planning module.');
  };
  // Financial KPIs data
  const financialKPIs = [
    { title: 'Total Revenue', value: 'UGX 2.4M', change: '+12.5%', trend: 'up', icon: DollarSign },
    { title: 'Net Profit', value: 'UGX 680K', change: '+8.2%', trend: 'up', icon: TrendingUp },
    { title: 'Operating Costs', value: 'UGX 1.72M', change: '-3.1%', trend: 'down', icon: TrendingDown },
    { title: 'Cash Flow', value: 'UGX 420K', change: '+15.7%', trend: 'up', icon: CreditCard }
  ];

  // Revenue and profit trends data
  const revenueData = [
    { month: 'Jan', revenue: 180000, profit: 45000, expenses: 135000 },
    { month: 'Feb', revenue: 195000, profit: 52000, expenses: 143000 },
    { month: 'Mar', revenue: 210000, profit: 58000, expenses: 152000 },
    { month: 'Apr', revenue: 225000, profit: 65000, expenses: 160000 },
    { month: 'May', revenue: 240000, profit: 72000, expenses: 168000 },
    { month: 'Jun', revenue: 255000, profit: 78000, expenses: 177000 },
    { month: 'Jul', revenue: 270000, profit: 85000, expenses: 185000 },
    { month: 'Aug', revenue: 285000, profit: 92000, expenses: 193000 },
    { month: 'Sep', revenue: 300000, profit: 98000, expenses: 202000 },
    { month: 'Oct', revenue: 315000, profit: 105000, expenses: 210000 },
    { month: 'Nov', revenue: 330000, profit: 112000, expenses: 218000 },
    { month: 'Dec', revenue: 345000, profit: 118000, expenses: 227000 }
  ];

  // Budget allocation data
  const budgetData = [
    { category: 'Seeds & Fertilizers', allocated: 450000, spent: 420000, percentage: 93 },
    { category: 'Equipment', allocated: 300000, spent: 285000, percentage: 95 },
    { category: 'Labor', allocated: 600000, spent: 580000, percentage: 97 },
    { category: 'Utilities', allocated: 150000, spent: 135000, percentage: 90 },
    { category: 'Maintenance', allocated: 200000, spent: 175000, percentage: 88 }
  ];

  // Payment status data (live)
  const paymentStatusData = React.useMemo(() => {
    const OVERDUE_DAYS = 30;
    const now = Date.now();
    let completedAmt = 0;
    let pendingAmt = 0;
    let overdueAmt = 0;

    (allPayments || []).forEach((p: any) => {
      const amt = Number(p.amount || 0);
      if (!amt) return;
      const created = p.created_at ? new Date(p.created_at).getTime() : undefined;
      const ageDays = created ? Math.floor((now - created) / (1000 * 60 * 60 * 24)) : 0;
      if (p.status === 'paid') {
        completedAmt += amt;
      } else if (p.status === 'pending' || p.status === 'approved') {
        if (created && ageDays > OVERDUE_DAYS) overdueAmt += amt; else pendingAmt += amt;
      }
    });

    const total = completedAmt + pendingAmt + overdueAmt;
    const pct = (v: number) => (total > 0 ? Math.round((v / total) * 100) : 0);

    return [
      { name: 'Completed', value: pct(completedAmt), color: '#22c55e', amount: completedAmt },
      { name: 'Pending', value: pct(pendingAmt), color: '#f59e0b', amount: pendingAmt },
      { name: 'Overdue', value: pct(overdueAmt), color: '#ef4444', amount: overdueAmt },
    ];
  }, [allPayments]);

  // ROI by crop data
  const roiData = [
    { crop: 'Wheat', roi: 18.5, investment: 250000, returns: 296250 },
    { crop: 'Corn', roi: 22.3, investment: 180000, returns: 220140 },
    { crop: 'Rice', roi: 15.8, investment: 200000, returns: 231600 },
    { crop: 'Soybeans', roi: 20.1, investment: 150000, returns: 180150 },
    { crop: 'Vegetables', roi: 25.7, investment: 120000, returns: 150840 }
  ];

  // Financial alerts
  const financialAlerts = [
    { id: 1, type: 'warning', message: 'Equipment budget 95% utilized', priority: 'medium' },
    { id: 2, type: 'danger', message: '10 overdue payments totaling UGX 240K', priority: 'high' },
    { id: 3, type: 'info', message: 'Q4 profit target 85% achieved', priority: 'low' },
    { id: 4, type: 'warning', message: 'Utility costs increased by 12%', priority: 'medium' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <TopNavigationBar 
        userName={user?.name || 'Buayism'}
        onReportsClick={handleFinancialReport}
        onNotificationsClick={() => alert('Notifications')}
        onProfileClick={logout}
        onPendingClick={handlePendingClick}
        pendingCount={pendingCount}
      />

      {/* Main Content - Add padding-top to account for fixed navbar */}
      <div className="pt-20">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Financial KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {financialKPIs.map((kpi, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{kpi.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                    )}
                    <p className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change}
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <kpi.icon className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <p className="text-xs text-gray-500">Total Due</p>
            <p className="text-xl font-semibold text-gray-900">{currency(totalDueAll)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <p className="text-xs text-gray-500">Pending</p>
            <p className="text-xl font-semibold text-gray-900">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <p className="text-xs text-gray-500">Verified</p>
            <p className="text-xl font-semibold text-gray-900">{approvedCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <p className="text-xs text-gray-500">Paid</p>
            <p className="text-xl font-semibold text-gray-900">{paidCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <p className="text-xs text-gray-500">Farmers</p>
            <p className="text-xl font-semibold text-gray-900">{farmersCount}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Farmers Payment Overview */}
          <div ref={pendingRef} className="lg:col-span-3 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Farmers Payment Overview</h2>
              <span className="text-sm text-gray-500">Summary of dues and statuses</span>
            </div>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#7C3AED] to-[#9333EA]">
                    <th className="py-4 px-6 text-left text-white text-sm font-semibold uppercase tracking-wider">Farmer Name / ID</th>
                    <th className="py-4 px-6 text-left text-white text-sm font-semibold uppercase tracking-wider">Total Amount Due</th>
                    <th className="py-4 px-6 text-left text-white text-sm font-semibold uppercase tracking-wider">Last Payment Date</th>
                    <th className="py-4 px-6 text-left text-white text-sm font-semibold uppercase tracking-wider">Payment Status</th>
                    <th className="py-4 px-6 text-left text-white text-sm font-semibold uppercase tracking-wider">Amount Paid</th>
                    <th className="py-4 px-6 text-left text-white text-sm font-semibold uppercase tracking-wider">Bank/Mobile Money Details</th>
                    <th className="py-4 px-6 text-left text-white text-sm font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {farmers.map((f, index) => {
                    const fId = String(f._id);
                    const pays = allPayments.filter((p) => String(p.farmer_id) === fId);
                    const totalDue = pays
                      .filter((p) => p.status === 'pending' || p.status === 'approved')
                      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
                    const totalPaid = pays
                      .filter((p) => p.status === 'paid')
                      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
                    const paidDates = pays
                      .filter((p) => p.status === 'paid' && p.payment_date)
                      .map((p) => new Date(p.payment_date));
                    const lastPaid = paidDates.length ? new Date(Math.max.apply(null, paidDates as any)) : null;
                    const hasPending = pays.some((p) => p.status === 'pending');
                    const hasApproved = pays.some((p) => p.status === 'approved');
                    const hasPaid = pays.some((p) => p.status === 'paid');
                    const status = hasPending ? 'Pending' : hasApproved ? 'Verified' : (hasPaid ? 'Paid' : '—');
                    const pendingForFarmer = pays.filter((p) => p.status === 'pending');
                    return (
                      <tr key={fId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-900">{f.name || 'Farmer'} <span className="text-gray-500 text-xs">({fId.substring(0, 8)}...)</span></td>
                        <td className="py-4 px-6 text-gray-700">{currency(totalDue)}</td>
                        <td className="py-4 px-6 text-gray-700">{lastPaid ? lastPaid.toLocaleDateString() : '—'}</td>
                        <td className="py-4 px-6">{renderStatusBadge(status.toLowerCase())}</td>
                        <td className="py-4 px-6 font-semibold text-gray-900">{hasPaid ? currency(totalPaid) : '—'}</td>
                        <td className="py-4 px-6 text-gray-700">{f.contact || '—'}</td>
                        <td className="py-4 px-6">
                          {pendingForFarmer.length > 0 ? (
                            <div className="space-y-1">
                              {pendingForFarmer.slice(0,2).map((p) => (
                                <div key={String(p._id)} className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">{currency(Number(p.amount))}</span>
                                  <button onClick={() => approvePending(String(p._id || p.id))} className="px-3 py-1 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded text-xs font-medium transition-colors">Approve</button>
                                </div>
                              ))}
                              {pendingForFarmer.length > 2 && (
                                <div className="text-xs text-gray-500">+{pendingForFarmer.length - 2} more</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {farmers.length === 0 && (
                    <tr>
                      <td className="py-8 px-6 text-gray-400 text-center text-sm" colSpan={7}>No farmers found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Left Column - Revenue Trends and Budget */}
          <div className="lg:col-span-2 space-y-8">
            {/* Revenue and Profit Trends */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Revenue & Profit Trends</h2>
                <select className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-fm-primary focus:border-transparent">
                  <option>Last 12 Months</option>
                  <option>Last 6 Months</option>
                  <option>Last 3 Months</option>
                </select>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatUGX(Number(value)), '']} />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#0369A1" 
                      strokeWidth={3}
                      name="Revenue"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#22c55e" 
                      strokeWidth={3}
                      name="Profit"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      name="Expenses"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-fm-primary"></div>
                  <span className="text-sm">Revenue</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Profit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Expenses</span>
                </div>
              </div>
            </div>

            {/* Budget Allocation */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Budget Allocation</h2>
              
              <div className="space-y-6">
                {budgetData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900">
                          {formatUGX(item.spent)} / {formatUGX(item.allocated)}
                        </span>
                        <div className="text-xs text-gray-500">{item.percentage}% utilized</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          item.percentage >= 95 ? 'bg-red-500' :
                          item.percentage >= 90 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ROI by Crop */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">ROI by Crop Type</h2>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roiData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="crop" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'ROI']} />
                    <Bar dataKey="roi" fill="#0369A1" name="ROI %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Status and Alerts */}
          <div className="space-y-8">
            {/* Payment Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Payment Status</h2>
              
              <div className="h-48 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                    >
                      {paymentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {paymentStatusData.map((item, index) => (
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
                      <div className="text-xs text-gray-500">{formatUGX(item.amount)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Alerts */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Financial Alerts</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
              </div>

              <div className="space-y-4">
                {financialAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.type === 'danger' ? 'bg-red-50 border-red-500' :
                      alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                        alert.type === 'danger' ? 'text-red-500' :
                        alert.type === 'warning' ? 'text-yellow-500' :
                        'text-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                        <p className={`text-xs mt-1 ${
                          alert.priority === 'high' ? 'text-red-600' :
                          alert.priority === 'medium' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`}>
                          Priority: {alert.priority}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Financial Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button onClick={handleGenerateInvoice} className="w-full p-3 bg-fm-secondary text-fm-primary rounded-lg hover:bg-fm-primary-light transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5" />
                    <span className="font-medium">Generate Invoice</span>
                  </div>
                </button>
                <button onClick={handleFinancialReport} className="w-full p-3 bg-fm-secondary text-fm-primary rounded-lg hover:bg-fm-primary-light transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <PieChartIcon className="w-5 h-5" />
                    <span className="font-medium">Financial Report</span>
                  </div>
                </button>
                <button onClick={handleBudgetPlanning} className="w-full p-3 bg-fm-secondary text-fm-primary rounded-lg hover:bg-fm-primary-light transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-medium">Budget Planning</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Report Distribution Modal */}
      <ReportDistributionModal 
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />

      {/* Toast Notifications */}
      {ToastComponent}
    </div>
  );
};

export default FinancialManagerDashboard;
