import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, AlertTriangle, PieChart as PieChartIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { paymentService } from '../services/paymentService';
import { farmerService } from '../services/farmerService';
import { formatUGX } from '../utils/currency';
import { reportService } from '../services/reportService';

const FinancialManagerDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [approvedPayments, setApprovedPayments] = React.useState<any[]>([]);
  const [allPayments, setAllPayments] = React.useState<any[]>([]);
  const [apLoading, setApLoading] = React.useState(false);
  const [apError, setApError] = React.useState('');
  const approvedRef = React.useRef<HTMLDivElement | null>(null);
  const [farmers, setFarmers] = React.useState<any[]>([]);
  const [processing, setProcessing] = React.useState(false);
  const [showProcessModal, setShowProcessModal] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState<any | null>(null);
  const [payMethod, setPayMethod] = React.useState<'cash' | 'bank_transfer' | 'mobile_money' | 'check'>('bank_transfer');
  const [payRef, setPayRef] = React.useState('');
  const [highlightApproved, setHighlightApproved] = React.useState(false);
  const [showBudgetModal, setShowBudgetModal] = React.useState(false);
  const [budgetReports, setBudgetReports] = React.useState<any[]>([]);
  const [budgetLoading, setBudgetLoading] = React.useState(false);
  const [budgetError, setBudgetError] = React.useState('');
  const [showPlanModal, setShowPlanModal] = React.useState(false);
  const [planningRequest, setPlanningRequest] = React.useState<any | null>(null);
  const [planForm, setPlanForm] = React.useState<{seeds:string; fertilizers:string; equipment:string; water:string; other:string}>({seeds:'', fertilizers:'', equipment:'', water:'', other:''});
  const [lastPlan, setLastPlan] = React.useState<{
    requested: Record<string, number>;
    approved: Record<string, number>;
  } | null>(null);
  const [showReportModal, setShowReportModal] = React.useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = React.useState(false);
  const [reportForm, setReportForm] = React.useState({
    type: 'performance' as 'harvest_summary' | 'payment_report' | 'performance',
    date_range_start: '',
    date_range_end: '',
    notes: ''
  });
  const [invoiceForm, setInvoiceForm] = React.useState({
    title: 'Invoice',
    amount: '',
    notes: ''
  });
  const [actionError, setActionError] = React.useState('');
  const [actionMessage, setActionMessage] = React.useState('');

  // Helpers and derived finance statistics
  const currency = (n: number) => formatUGX(n);
  const totalDueAll = React.useMemo(() =>
    allPayments
      .filter((p) => p.status === 'pending' || p.status === 'approved')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0)
  , [allPayments]);
  const pendingCount = React.useMemo(() => allPayments.filter((p) => p.status === 'pending').length, [allPayments]);
  const approvedCount = React.useMemo(() => approvedPayments.length, [approvedPayments]);
  const paidCount = React.useMemo(() => allPayments.filter((p) => p.status === 'paid').length, [allPayments]);
  const farmersCount = React.useMemo(() => farmers.length, [farmers]);

  const renderStatusBadge = (s: string) => {
    const base = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium';
    if (s === 'pending') return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
    if (s === 'approved') return <span className={`${base} bg-blue-100 text-blue-800`}>Verified</span>;
    if (s === 'paid') return <span className={`${base} bg-green-100 text-green-800`}>Paid</span>;
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
        setApprovedPayments(all.filter((p: any) => p.status === 'approved'));
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

  const markPaid = async (id: string) => {
    try {
      setProcessing(true);
      await paymentService.updatePayment(id, { status: 'paid', payment_date: new Date() as any });
      setApprovedPayments((prev) => prev.filter((p) => (p._id || p.id) !== id));
      setShowProcessModal(false);
      setSelectedPayment(null);
      setPayRef('');
      alert('Payment marked as paid. Manager will be notified.');
    } catch (e) {
      setApError('Failed to mark as paid');
    } finally {
      setProcessing(false);
    }
  };
  const openProcess = (payment: any) => {
    setSelectedPayment(payment);
    setShowProcessModal(true);
  };
  const approvePending = async (id: string) => {
    try {
      await paymentService.updatePayment(id, { status: 'approved' } as any);
      // Update both states from the same updated array to avoid staleness and lints
      setAllPayments((prev) => {
        const updated = prev.map((p) => (String(p._id || p.id) === id ? { ...p, status: 'approved' } : p));
        setApprovedPayments(updated.filter((p) => p.status === 'approved'));
        return updated;
      });
      alert('Payment approved');
    } catch (e) {
      alert('Failed to approve payment');
    }
  };
  const handleGenerateInvoice = () => {
    setActionError('');
    setActionMessage('');
    setShowInvoiceModal(true);
  };
  const handleFinancialReport = () => {
    setActionError('');
    setActionMessage('');
    setShowReportModal(true);
  };
  const submitFinancialReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionError('');
      setActionMessage('');
      await reportService.createReport({
        type: reportForm.type,
        date_range_start: new Date(reportForm.date_range_start) as any,
        date_range_end: new Date(reportForm.date_range_end) as any,
        data: { notes: reportForm.notes, sent_to: 'manager' },
      } as any);
      setActionMessage('✅ Financial report sent to Manager');
      setShowReportModal(false);
      setReportForm({ type: 'performance', date_range_start: '', date_range_end: '', notes: '' });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to send report';
      setActionError(msg);
    }
  };
  const submitInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionError('');
      setActionMessage('');
      const amt = parseFloat(invoiceForm.amount as any);
      if (isNaN(amt) || amt <= 0) {
        setActionError('Amount must be a positive number');
        return;
      }
      await reportService.createReport({
        type: 'payment_report',
        date_range_start: new Date() as any,
        date_range_end: new Date() as any,
        data: { category: 'invoice', title: invoiceForm.title, amount: amt, notes: invoiceForm.notes, sent_to: 'manager' },
      } as any);
      setActionMessage('✅ Invoice sent to Manager');
      setShowInvoiceModal(false);
      setInvoiceForm({ title: 'Invoice', amount: '', notes: '' });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to send invoice';
      setActionError(msg);
    }
  };
  const handleProcessPayments = () => {
    if (!approvedPayments || approvedPayments.length === 0) {
      alert('No approved payments to process yet. Approve a request first.');
      return;
    }
    approvedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setHighlightApproved(true);
    setTimeout(() => setHighlightApproved(false), 1500);
  };
  const loadBudgetRequests = async () => {
    try {
      setBudgetLoading(true);
      setBudgetError('');
      const byType = await reportService.getReportsByType('payment_report');
      const list = Array.isArray(byType) ? byType : (byType?.data || byType?.items || []);
      let budgets = list.filter((r: any) => String(r.type) === 'payment_report' && (r.data?.category === 'budget_request' || r.data?.sent_to === 'finance'));
      if (!budgets.length) {
        try {
          const allRes = await reportService.getAllReports();
          const all = Array.isArray(allRes) ? allRes : (allRes?.data || allRes?.items || []);
          budgets = all.filter((r: any) => String(r.type) === 'payment_report' && (r.data?.category === 'budget_request' || r.data?.sent_to === 'finance'));
        } catch {}
      }
      setBudgetReports(budgets);
    } catch (e) {
      setBudgetError('Failed to load budget requests');
    } finally {
      setBudgetLoading(false);
    }
  };
  const handleBudgetPlanning = () => {
    setShowBudgetModal(true);
    loadBudgetRequests();
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
  const initialBudgetData = React.useMemo(() => ([
    { key: 'seeds', category: 'Seeds', allocated: 250000, spent: 0 },
    { key: 'fertilizers', category: 'Fertilizers', allocated: 200000, spent: 0 },
    { key: 'equipment', category: 'Equipment', allocated: 300000, spent: 0 },
    { key: 'water', category: 'Water', allocated: 150000, spent: 0 },
    { key: 'other', category: 'Other', allocated: 200000, spent: 0 }
  ]), []);
  const [budgetData, setBudgetData] = React.useState(initialBudgetData);
  const computedBudgetData = React.useMemo(() => budgetData.map(b => ({
    ...b,
    percentage: Math.min(100, Math.round((Number(b.spent||0) / Math.max(1, Number(b.allocated||0))) * 100))
  })), [budgetData]);

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
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🌾</span>
                </div>

            {/* Approved Payments to Process */}
            <div ref={approvedRef} className={`bg-white rounded-lg shadow-sm p-6 ${highlightApproved ? 'ring-2 ring-purple-400' : ''}` }>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Approved Payments</h2>
                {apLoading && <span className="text-sm text-gray-500">Loading...</span>}
              </div>
              {apError && <p className="text-sm text-red-600 mb-3">{apError}</p>}
              {approvedPayments.length === 0 && !apLoading ? (
                <p className="text-sm text-gray-600">No approved payments to process.</p>
              ) : (
                <div className="space-y-3">
                  {approvedPayments.slice(0,6).map((p) => {
                    const f = farmers.find((x) => String(x._id) === String(p.farmer_id));
                    return (
                      <div key={(p._id || p.id) as string} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-800">
                          <div className="font-medium">{f?.name || f?.full_name || f?.first_name || 'Farmer'} <span className="text-gray-500">({String(p.farmer_id)})</span></div>
                          <div className="text-gray-600">Amount: {formatUGX(Number(p.amount))}</div>
                        </div>
                        <button
                          onClick={() => openProcess(p)}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm"
                        >
                          Process
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
                <span className="text-xl font-bold text-gray-900">FARM MANAGEMENT</span>
                <span className="text-sm text-gray-500">System</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
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
          </div>
        </div>

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
          <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Farmers Payment Overview</h2>
              <span className="text-sm text-gray-500">Summary of dues and statuses</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border rounded-lg overflow-hidden">
                <thead>
                  <tr className="text-left text-gray-600 bg-gray-50 border-b">
                    <th className="py-2 pr-4 text-xs uppercase tracking-wide">Farmer Name / ID</th>
                    <th className="py-2 pr-4 text-xs uppercase tracking-wide">Total Amount Due</th>
                    <th className="py-2 pr-4 text-xs uppercase tracking-wide">Last Payment Date</th>
                    <th className="py-2 pr-4 text-xs uppercase tracking-wide">Payment Status</th>
                    <th className="py-2 pr-4 text-xs uppercase tracking-wide">Bank/Mobile Money Details</th>
                    <th className="py-2 pr-4 text-xs uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {farmers.map((f) => {
                    const fId = String(f._id);
                    const pays = allPayments.filter((p) => String(p.farmer_id) === fId);
                    const totalDue = pays
                      .filter((p) => p.status === 'pending' || p.status === 'approved')
                      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
                    const paidDates = pays
                      .filter((p) => p.status === 'paid' && p.payment_date)
                      .map((p) => new Date(p.payment_date));
                    const lastPaid = paidDates.length ? new Date(Math.max.apply(null, paidDates as any)) : null;
                    const hasPending = pays.some((p) => p.status === 'pending');
                    const hasApproved = pays.some((p) => p.status === 'approved');
                    const status = hasPending ? 'Pending' : hasApproved ? 'Verified' : (pays.some((p) => p.status === 'paid') ? 'Paid' : '—');
                    const pendingForFarmer = pays.filter((p) => p.status === 'pending');
                    return (
                      <tr key={fId} className="border-t even:bg-gray-50/50 hover:bg-gray-50">
                        <td className="py-2 pr-4 font-medium text-gray-900">{f.name || 'Farmer'} <span className="text-gray-500">({fId})</span></td>
                        <td className="py-2 pr-4">{currency(totalDue)}</td>
                        <td className="py-2 pr-4">{lastPaid ? lastPaid.toLocaleDateString() : '—'}</td>
                        <td className="py-2 pr-4">{renderStatusBadge(status.toLowerCase())}</td>
                        <td className="py-2 pr-4">{f.contact || '—'}</td>
                        <td className="py-2 pr-4">
                          {pendingForFarmer.length > 0 ? (
                            <div className="space-y-1">
                              {pendingForFarmer.slice(0,3).map((p) => (
                                <div key={String(p._id)} className="flex items-center justify-between bg-gray-50 rounded px-2 py-1 border">
                                  <span>Req: {currency(Number(p.amount))}</span>
                                  <button onClick={() => approvePending(String(p._id || p.id))} className="px-2 py-0.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs">Approve</button>
                                </div>
                              ))}
                              {pendingForFarmer.length > 3 && (
                                <div className="text-xs text-gray-500">+{pendingForFarmer.length - 3} more</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">No pending requests</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {farmers.length === 0 && (
                    <tr>
                      <td className="py-4 text-gray-500" colSpan={6}>No farmers found</td>
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
                <select className="text-sm border border-gray-300 rounded px-3 py-1">
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
                      stroke="#3b82f6" 
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
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
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

            {/* Budget Allocation (live, updates when you plan) */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Budget Allocation</h2>
              
              <div className="space-y-6">
                {computedBudgetData.map((item, index) => {
                  const reqForItem = lastPlan?.requested?.[item.key as string] ?? null;
                  const apprForItem = lastPlan?.approved?.[item.key as string] ?? null;
                  const savedVal = (reqForItem !== null && apprForItem !== null)
                    ? Math.max(0, Number(reqForItem) - Number(apprForItem))
                    : Math.max(0, Number(item.allocated) - Number(item.spent));
                  return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900">
                          {formatUGX(Number(item.spent))} / {formatUGX(Number(item.allocated))}
                        </span>
                        <div className="text-xs text-gray-500">{item.percentage}% utilized</div>
                        {reqForItem !== null && (
                          <div className="text-[11px] text-gray-500">Requested: {formatUGX(Number(reqForItem))} · Approved: {formatUGX(Number(apprForItem||0))}</div>
                        )}
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
                    <div className="flex justify-end"><div className="text-xs text-gray-500">Saved: {formatUGX(savedVal)}</div></div>
                  </div>
                  );
                })}
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
                    <Bar dataKey="roi" fill="#22c55e" name="ROI %" />
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
                <button onClick={handleGenerateInvoice} className="w-full p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5" />
                    <span className="font-medium">Generate Invoice</span>
                  </div>
                </button>
                <button onClick={handleFinancialReport} className="w-full p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <PieChartIcon className="w-5 h-5" />
                    <span className="font-medium">Financial Report</span>
                  </div>
                </button>
                <button onClick={handleProcessPayments} className="w-full p-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5" />
                    <span className="font-medium">Process Payments</span>
                  </div>
                </button>
                <button onClick={handleBudgetPlanning} className="w-full p-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-left">
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

      {showReportModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Send Financial Report</h3>
              <button onClick={() => setShowReportModal(false)} className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm">Close</button>
            </div>
            <form onSubmit={submitFinancialReport} className="space-y-3">
              <select className="w-full border rounded px-3 py-2" value={reportForm.type} onChange={(e)=>setReportForm({...reportForm, type: e.target.value as any})}>
                <option value="performance">Performance</option>
                <option value="payment_report">Payment Report</option>
                <option value="harvest_summary">Harvest Summary</option>
              </select>
              <input type="date" className="w-full border rounded px-3 py-2" value={reportForm.date_range_start} onChange={(e)=>setReportForm({...reportForm, date_range_start: e.target.value})} required />
              <input type="date" className="w-full border rounded px-3 py-2" value={reportForm.date_range_end} onChange={(e)=>setReportForm({...reportForm, date_range_end: e.target.value})} required />
              <textarea className="w-full border rounded px-3 py-2" rows={3} placeholder="Notes" value={reportForm.notes} onChange={(e)=>setReportForm({...reportForm, notes: e.target.value})} />
              {actionError && <div className="text-sm text-red-600">{actionError}</div>}
              {actionMessage && <div className="text-sm text-green-600">{actionMessage}</div>}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={()=>setShowReportModal(false)} className="px-4 py-2 rounded bg-gray-200 text-gray-800">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">Send to Manager</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Generate Invoice</h3>
              <button onClick={() => setShowInvoiceModal(false)} className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm">Close</button>
            </div>
            <form onSubmit={submitInvoice} className="space-y-3">
              <input className="w-full border rounded px-3 py-2" placeholder="Title" value={invoiceForm.title} onChange={(e)=>setInvoiceForm({...invoiceForm, title: e.target.value})} />
              <input className="w-full border rounded px-3 py-2" placeholder="Amount" value={invoiceForm.amount} onChange={(e)=>setInvoiceForm({...invoiceForm, amount: e.target.value})} />
              <textarea className="w-full border rounded px-3 py-2" rows={3} placeholder="Notes" value={invoiceForm.notes} onChange={(e)=>setInvoiceForm({...invoiceForm, notes: e.target.value})} />
              {actionError && <div className="text-sm text-red-600">{actionError}</div>}
              {actionMessage && <div className="text-sm text-green-600">{actionMessage}</div>}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={()=>setShowInvoiceModal(false)} className="px-4 py-2 rounded bg-gray-200 text-gray-800">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white">Send to Manager</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBudgetModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Budget Planning — Submitted Requests</h3>
              <button onClick={() => setShowBudgetModal(false)} className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm">Close</button>
            </div>

            {budgetLoading && <div className="text-sm text-gray-600">Loading budget requests…</div>}
            {budgetError && <div className="text-sm text-red-600 mb-3">{budgetError}</div>}

            {!budgetLoading && !budgetError && (
              <div className="space-y-4">
                {budgetReports.length === 0 ? (
                  <div className="text-sm text-gray-600">No budget requests submitted yet.</div>
                ) : (
                  budgetReports.map((r: any) => {
                    const items = r.data?.items || {};
                    const total = Number(r.data?.total_amount || 0);
                    const created = r.created_at ? new Date(r.created_at).toLocaleString() : '—';
                    const by = String(r.generated_by || '—');
                    const entries = Object.entries(items)
                      .filter(([_, v]) => Number(v) > 0)
                      .map(([k, v]) => ({ key: k, value: Number(v) }));
                    return (
                      <div key={String(r._id || Math.random())} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-700">From: <span className="font-medium">{by.substring(0,6)}…</span></div>
                          <div className="text-xs text-gray-500">{created}</div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="space-y-1">
                            {entries.slice(0,6).map((e) => (
                              <div key={e.key} className="flex justify-between">
                                <span className="text-gray-600 capitalize">{e.key}</span>
                                <span className="font-medium">{formatUGX(e.value)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-between">
                            <span className="text-sm font-medium text-amber-800">Total</span>
                            <span className="text-lg font-bold text-amber-900">{formatUGX(total)}</span>
                          </div>
                        </div>
                        {r.data?.notes && (
                          <div className="mt-2 text-xs text-gray-600">Notes: {r.data.notes}</div>
                        )}
                        <div className="mt-3 flex justify-end gap-2">
                          <button className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm" onClick={() => {
                            setPlanningRequest(r);
                            const it = r?.data?.items || {};
                            setPlanForm({
                              seeds: String(it.seeds || ''),
                              fertilizers: String(it.fertilizers || ''),
                              equipment: String(it.equipment || ''),
                              water: String(it.water || ''),
                              other: String(it.other || ''),
                            });
                            setShowPlanModal(true);
                          }}>Start Planning</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showPlanModal && planningRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Plan Budget for Request</h3>
              <button onClick={() => setShowPlanModal(false)} className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm">Close</button>
            </div>

            <div className="space-y-4">
              {([
                { key: 'seeds', label: 'Seeds', mapTo: 'seeds' },
                { key: 'fertilizers', label: 'Fertilizers', mapTo: 'fertilizers' },
                { key: 'equipment', label: 'Equipment', mapTo: 'equipment' },
                { key: 'water', label: 'Water', mapTo: 'water' },
                { key: 'other', label: 'Other', mapTo: 'other' },
              ] as const).map(({ key, label, mapTo }) => {
                const requested = Number((planningRequest?.data?.items || {})[key] || 0);
                const val = planForm[key as keyof typeof planForm] || '';
                const cat = (budgetData.find(b => b.key === mapTo) as any) || { allocated: 0, spent: 0 };
                const planned = Number(val || 0);
                const remaining = Math.max(0, Number(cat.allocated) - (Number(cat.spent) + planned));
                return (
                  <div key={key} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">{label}</div>
                      <div className="text-xs text-gray-600">Requested: {formatUGX(requested)}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Approve Amount</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={val}
                          onChange={(e)=> setPlanForm({ ...planForm, [key]: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                          placeholder="0"
                        />
                      </div>
                      <div className="text-xs text-gray-600 md:text-right">
                        Remaining in {cat.category || 'category'}: <span className="font-medium">{formatUGX(remaining)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowPlanModal(false)} className="px-4 py-2 rounded bg-gray-200 text-gray-800">Cancel</button>
              <button
                onClick={() => {
                  // Apply planned amounts to budgetData categories
                  const toNum = (v:string)=>{ const n = parseFloat(v as any); return isNaN(n)?0:n; };
                  const adds = {
                    seeds: toNum(planForm.seeds),
                    fertilizers: toNum(planForm.fertilizers),
                    equipment: toNum(planForm.equipment),
                    water: toNum(planForm.water),
                    other: toNum(planForm.other),
                  } as Record<string, number>;
                  setBudgetData(prev => prev.map(b => ({
                    ...b,
                    spent: Number(b.spent) + (adds[b.key as keyof typeof adds] || 0)
                  })));
                  // Track requested vs approved for savings display
                  const reqItems = (planningRequest?.data?.items || {}) as Record<string, number>;
                  setLastPlan({
                    requested: {
                      seeds: Number(reqItems.seeds || 0),
                      fertilizers: Number(reqItems.fertilizers || 0),
                      equipment: Number(reqItems.equipment || 0),
                      water: Number(reqItems.water || 0),
                      other: Number(reqItems.other || 0),
                    },
                    approved: {
                      seeds: adds.seeds,
                      fertilizers: adds.fertilizers,
                      equipment: adds.equipment,
                      water: adds.water,
                      other: adds.other,
                    }
                  });
                  setShowPlanModal(false);
                }}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >Save Plan</button>
            </div>
          </div>
        </div>
      )}

      {showProcessModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Process Payment</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Farmer ID</span><span className="font-medium">{String(selectedPayment.farmer_id)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Amount</span><span className="font-medium">{formatUGX(Number(selectedPayment.amount))}</span></div>
              <div>
                <label className="block text-gray-700 mb-1">Payment Method</label>
                <select value={payMethod} onChange={(e) => setPayMethod(e.target.value as any)} className="w-full border rounded px-3 py-2">
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Reference (optional)</label>
                <input value={payRef} onChange={(e) => setPayRef(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Txn ref / notes" />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button onClick={() => { setShowProcessModal(false); setSelectedPayment(null); }} className="px-4 py-2 rounded bg-gray-200 text-gray-800">Cancel</button>
              <button disabled={processing} onClick={() => markPaid(String(selectedPayment._id || selectedPayment.id))} className="px-4 py-2 rounded bg-purple-600 text-white disabled:opacity-60">
                {processing ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialManagerDashboard;
