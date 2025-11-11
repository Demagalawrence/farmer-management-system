import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  LayoutDashboard, DollarSign, TrendingUp, TrendingDown,
  MessageSquare, Settings, Star, History, LogOut, Search, Bell, User,
  CheckCircle, Clock, XCircle, FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { paymentService } from '../services/paymentService';
import { financeService } from '../services/financeService';
import ProfilePage from './ProfilePage';
import ReportsPage from './ReportsPage';
import ApprovalsPage from './ApprovalsPage';
import SettingsPage from './Settings';

const FinanceDashboardModern: React.FC = () => {
  const { logout, user } = useAuth();
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data states
  const [payments, setPayments] = useState<any[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [paymentsRes, approvalsRes] = await Promise.all([
          paymentService.getAllPayments(),
          financeService.getApprovalRequests('pending'),
        ]);
        
        setPayments(paymentsRes?.data || paymentsRes || []);
        setApprovals(approvalsRes?.data || approvalsRes || []);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate metrics
  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const approvedPayments = payments.filter(p => p.status === 'approved').length;
  const rejectedPayments = payments.filter(p => p.status === 'rejected').length;
  const totalTransactions = payments.length;

  // Monthly revenue trend
  const monthlyRevenue: { [key: string]: number } = {};
  payments.filter(p => p.status === 'paid').forEach(p => {
    const date = new Date(p.payment_date || p.created_at);
    const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
    monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + (Number(p.amount) || 0);
  });
  
  const revenueTrendData = Object.keys(monthlyRevenue).slice(-6).map(month => ({
    month,
    revenue: Number((monthlyRevenue[month] / 1000000).toFixed(2))
  }));

  // Payment status breakdown
  const paymentStatusData = [
    { name: 'Week 1', paid: 12, pending: 5 },
    { name: 'Week 2', paid: 18, pending: 3 },
    { name: 'Week 3', paid: 15, pending: 7 },
    { name: 'Week 4', paid: 22, pending: 4 },
  ];

  // Top payment categories
  const paymentsByType: { [key: string]: number } = {};
  payments.filter(p => p.status === 'paid').forEach(p => {
    const type = p.payment_type || 'Other';
    paymentsByType[type] = (paymentsByType[type] || 0) + (Number(p.amount) || 0);
  });
  
  const topCategories = Object.entries(paymentsByType)
    .map(([name, amount]) => ({
      name,
      amount: Number((amount / 1000000).toFixed(2)),
      percentage: Math.min(100, Math.round((amount / Math.max(...Object.values(paymentsByType))) * 100)),
      color: ['#4ECDC4', '#45B7D1', '#FF8A4C', '#C44569'][Object.keys(paymentsByType).indexOf(name) % 4]
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);

  // Payment success rate
  const successRate = totalTransactions > 0 
    ? Math.round((payments.filter(p => p.status === 'paid').length / totalTransactions) * 100) 
    : 0;

  // Recent transactions
  const recentTransactions = payments
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Pending approvals
  const pendingApprovals = approvals.filter(a => a.status === 'pending').slice(0, 5);

  // Sidebar menu
  const menuItems = [
    { icon: User, label: 'Profile' },
    { icon: DollarSign, label: 'Financial Manager' },
    { icon: TrendingUp, label: 'Reports' },
    { icon: FileText, label: 'Approvals' },
    { icon: Settings, label: 'Settings' },
  ];

  // Page Navigation
  if (activeMenu === 'Settings') {
    return <SettingsPage onBack={() => setActiveMenu('Dashboard')} />;
  }

  if (activeMenu === 'Profile') {
    return <ProfilePage onBack={() => setActiveMenu('Dashboard')} />;
  }

  if (activeMenu === 'Reports') {
    return <ReportsPage onBack={() => setActiveMenu('Dashboard')} />;
  }

  if (activeMenu === 'Approvals') {
    return <ApprovalsPage onBack={() => setActiveMenu('Dashboard')} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1419] text-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#1a1d2e] border-r border-gray-800 flex flex-col">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">💰</span>
            </div>
            <span className="text-xl font-bold text-white">AGRO FMS</span>
          </div>
        </div>

        <nav className="flex-1 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveMenu(item.label)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 text-cyan-400 border-l-4 border-cyan-400'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-4 pb-6">
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all border border-red-500/30"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-[#1a1d2e] border-b border-gray-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search transactions, payments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0f1419] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-200">
                <Bell className="w-6 h-6" />
                {pendingPayments > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-white">{user?.name}</div>
                  <div className="text-gray-400 text-xs">Finance Manager</div>
                </div>
              </div>
              
              {/* Logout Button */}
              <button 
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium shadow-lg hover:shadow-xl flex items-center space-x-2"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-8">
          {/* Search Results */}
          {searchQuery && (
            <div className="mb-6 bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Search Results for "{searchQuery}"</h2>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-sm text-green-400 hover:text-green-300"
                >
                  Clear Search
                </button>
              </div>
              
              {/* Payments Results */}
              {payments.filter(p => 
                p.payment_method?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.amount?.toString().includes(searchQuery)
              ).length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Payments ({payments.filter(p => 
                    p.payment_method?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.amount?.toString().includes(searchQuery)
                  ).length})</h3>
                  <div className="space-y-2">
                    {payments.filter(p => 
                      p.payment_method?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.amount?.toString().includes(searchQuery)
                    ).slice(0, 10).map((payment: any) => (
                      <div key={payment.id} className="bg-[#0f1419] p-3 rounded-lg border border-gray-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-white">UGX {Number(payment.amount).toLocaleString()}</div>
                            <div className="text-sm text-gray-400">{payment.payment_method} • {new Date(payment.payment_date || payment.created_at).toLocaleDateString()}</div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            payment.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                            payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Approvals Results */}
              {approvals.filter(a => 
                a.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.status?.toLowerCase().includes(searchQuery.toLowerCase())
              ).length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Approvals ({approvals.filter(a => 
                    a.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    a.status?.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length})</h3>
                  <div className="space-y-2">
                    {approvals.filter(a => 
                      a.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      a.status?.toLowerCase().includes(searchQuery.toLowerCase())
                    ).slice(0, 5).map((approval: any) => (
                      <div key={approval.id} className="bg-[#0f1419] p-3 rounded-lg border border-gray-800">
                        <div className="font-medium text-white">{approval.type}</div>
                        <div className="text-sm text-gray-400">Status: {approval.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {payments.filter(p => 
                p.payment_method?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.amount?.toString().includes(searchQuery)
              ).length === 0 &&
              approvals.filter(a => 
                a.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.status?.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p>No results found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-12 gap-6">
            {/* Financial Overview */}
            <div className="col-span-8 bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Financial Overview</h2>
                <p className="text-sm text-gray-500">Payment & Transaction Summary</p>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-3">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {(totalRevenue / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs text-gray-500 mb-1">Total Revenue</div>
                  <div className="text-xs text-green-400 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% growth
                  </div>
                </div>

                <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mb-3">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{pendingPayments}</div>
                  <div className="text-xs text-gray-500 mb-1">Pending</div>
                  <div className="text-xs text-yellow-400">
                    {(pendingAmount / 1000000).toFixed(1)}M UGX
                  </div>
                </div>

                <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{approvedPayments}</div>
                  <div className="text-xs text-gray-500 mb-1">Approved</div>
                  <div className="text-xs text-green-400">Ready to process</div>
                </div>

                <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center mb-3">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{rejectedPayments}</div>
                  <div className="text-xs text-gray-500 mb-1">Rejected</div>
                  <div className="text-xs text-red-400">Requires review</div>
                </div>
              </div>
            </div>

            {/* Success Rate Gauge */}
            <div className="col-span-4 bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-2">Success Rate</h3>
              <p className="text-sm text-gray-500 mb-6">Payment Processing</p>
              
              <div className="relative flex justify-center items-end">
                <svg viewBox="0 0 200 120" className="w-full">
                  <defs>
                    <linearGradient id="gaugeGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#34D399" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 30 100 A 70 70 0 0 1 170 100"
                    fill="none"
                    stroke="#2D3748"
                    strokeWidth="20"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 30 100 A 70 70 0 0 1 170 100"
                    fill="none"
                    stroke="url(#gaugeGradient3)"
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeDasharray={`${(successRate / 100) * 220} 220`}
                  />
                  <text x="100" y="90" textAnchor="middle" fill="#fff" fontSize="36" fontWeight="bold">
                    {successRate}%
                  </text>
                </svg>
              </div>
              <p className="text-center text-xs text-gray-400 mt-4">
                Excellent payment processing rate
              </p>
            </div>

            {/* Top Payment Categories */}
            <div className="col-span-4 bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Payment Categories</h3>
              <div className="space-y-4">
                {topCategories.map((category, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-white">{category.name}</span>
                      <span className="text-xs text-gray-400">{category.amount}M UGX</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${category.percentage}%`,
                          backgroundColor: category.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Status Trend */}
            <div className="col-span-4 bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Payment Status</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={paymentStatusData}>
                  <XAxis dataKey="name" stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <Bar dataKey="paid" fill="#10B981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="pending" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-400">Paid</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-gray-400">Pending</span>
                </div>
              </div>
            </div>

            {/* Revenue Trend */}
            <div className="col-span-8 bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Revenue Trend (M UGX)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={revenueTrendData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                  <XAxis dataKey="month" stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <YAxis stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1d2e', border: '1px solid #374151' }} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10B981" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Transactions */}
            <div className="col-span-6 bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Recent Transactions</h3>
              <div className="space-y-2">
                {recentTransactions.map((txn, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#0f1419] rounded-lg border border-gray-800">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        txn.status === 'paid' ? 'bg-green-500' : 
                        txn.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {txn.payment_type || 'Payment'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(txn.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">
                        UGX {(Number(txn.amount) / 1000).toFixed(0)}K
                      </div>
                      <div className={`text-xs ${
                        txn.status === 'paid' ? 'text-green-400' : 
                        txn.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {txn.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="col-span-6 bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Pending Approvals</h3>
              <div className="space-y-2">
                {pendingApprovals.length > 0 ? (
                  pendingApprovals.map((approval, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-[#0f1419] rounded-lg border border-gray-800">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-yellow-500" />
                        <div>
                          <div className="text-sm font-medium text-white">
                            {approval.request_type || 'Approval Request'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(approval.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-cyan-500 text-white text-xs rounded hover:bg-cyan-600">
                        Review
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No pending approvals
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboardModern;
