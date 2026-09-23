import React, { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, TrendingUp, CreditCard, CheckCircle, XCircle, Clock, BarChart3, PieChart } from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { financeService } from '../services/financeService';
import { BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface FinancialManagerTrackingPageProps {
  onBack: () => void;
}

const FinancialManagerTrackingPage: React.FC<FinancialManagerTrackingPageProps> = ({ onBack }) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [paymentsRes, approvalsRes] = await Promise.all([
          paymentService.getAllPayments(),
          financeService.getApprovalRequests('all'),
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
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const approvedPayments = payments.filter(p => p.status === 'paid').length;
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const rejectedPayments = payments.filter(p => p.status === 'rejected').length;
  const totalTransactions = payments.length;
  const averageTransaction = totalRevenue / (approvedPayments || 1);

  // Monthly revenue trend
  const monthlyRevenue = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toLocaleString('default', { month: 'short' });
    const revenue = payments.filter(p => {
      const pDate = new Date(p.payment_date || p.created_at);
      return pDate.getMonth() === date.getMonth() && 
             pDate.getFullYear() === date.getFullYear() &&
             p.status === 'paid';
    }).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    monthlyRevenue.push({ month, revenue: (revenue / 1000000).toFixed(2) });
  }

  // Payment status distribution
  const statusData = [
    { name: 'Paid', value: approvedPayments, color: '#10B981' },
    { name: 'Pending', value: pendingPayments, color: '#F59E0B' },
    { name: 'Rejected', value: rejectedPayments, color: '#EF4444' }
  ];

  // Payment methods distribution
  const methodCounts: { [key: string]: number } = {};
  payments.forEach(p => {
    const method = p.payment_method || 'Other';
    methodCounts[method] = (methodCounts[method] || 0) + 1;
  });
  const paymentMethods = Object.entries(methodCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Weekly transaction volume
  const weeklyTransactions = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - (i * 7));
    const week = `Week ${7 - i}`;
    const count = payments.filter(p => {
      const pDate = new Date(p.payment_date || p.created_at);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - 7);
      return pDate >= weekStart && pDate < date;
    }).length;
    weeklyTransactions.push({ week, count });
  }

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

  return (
    <div className="min-h-screen bg-[#0f1419] text-white p-8">
      {/* Header with Back Button */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </button>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Financial Manager Performance Tracking</h1>
        <p className="text-gray-400">Monitor and analyze financial operations and payment activities</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
        </div>
      ) : (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue Card */}
            <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800 hover:border-green-500 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400 uppercase font-semibold">Revenue</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {(totalRevenue / 1000000).toFixed(1)}M
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">UGX</span>
                <span className="text-green-400 font-semibold">Paid</span>
              </div>
              <div className="mt-3 text-xs text-green-400">
                +12% from last month
              </div>
            </div>

            {/* Total Transactions Card */}
            <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800 hover:border-blue-500 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400 uppercase font-semibold">Transactions</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{totalTransactions}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Total</span>
                <span className="text-blue-400 font-semibold">{approvedPayments} Paid</span>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                Avg: {(averageTransaction / 1000).toFixed(0)}K per transaction
              </div>
            </div>

            {/* Pending Payments Card */}
            <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800 hover:border-yellow-500 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400 uppercase font-semibold">Pending</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{pendingPayments}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Amount</span>
                <span className="text-yellow-400 font-semibold">
                  {(pendingAmount / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="mt-3 text-xs text-yellow-400">
                Requires attention
              </div>
            </div>

            {/* Success Rate Card */}
            <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800 hover:border-purple-500 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400 uppercase font-semibold">Success Rate</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {((approvedPayments / totalTransactions) * 100).toFixed(0)}%
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Approved</span>
                <span className="text-purple-400 font-semibold">Excellent</span>
              </div>
              <div className="mt-3 text-xs text-green-400">
                +3% improvement
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Revenue Trend */}
            <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  Monthly Revenue Trend
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                  <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1d2e', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Payment Status Distribution */}
            <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-blue-400" />
                  Payment Status Distribution
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <RePieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1d2e', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Methods */}
            <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-6">Payment Methods Usage</h3>
              <div className="space-y-4">
                {paymentMethods.map((method, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="text-gray-400 font-mono text-sm w-6">{idx + 1}.</span>
                      <span className="text-white font-medium capitalize">{method.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-800 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                          style={{ width: `${(method.value / paymentMethods[0].value) * 100}%` }}
                        />
                      </div>
                      <span className="text-green-400 font-semibold w-12 text-right">{method.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-6">Recent Transactions</h3>
              <div className="space-y-4">
                {payments.slice(0, 5).map((payment, idx) => (
                  <div key={idx} className="flex items-start space-x-3 pb-3 border-b border-gray-800 last:border-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      payment.status === 'paid' ? 'bg-green-500/20' :
                      payment.status === 'pending' ? 'bg-yellow-500/20' :
                      'bg-red-500/20'
                    }`}>
                      {payment.status === 'paid' ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                       payment.status === 'pending' ? <Clock className="w-4 h-4 text-yellow-400" /> :
                       <XCircle className="w-4 h-4 text-red-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm">
                        UGX {Number(payment.amount).toLocaleString()}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {payment.payment_method} • {new Date(payment.payment_date || payment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold whitespace-nowrap capitalize ${
                      payment.status === 'paid' ? 'text-green-400' :
                      payment.status === 'pending' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FinancialManagerTrackingPage;
