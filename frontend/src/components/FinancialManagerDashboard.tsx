import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, PiggyBank, Calculator } from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { farmerService } from '../services/farmerService';
import { formatUGX } from '../utils/currency';

const FinancialManagerDashboard: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [farmers, setFarmers] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [paymentsRes, farmersRes] = await Promise.all([
        paymentService.getAllPayments(),
        farmerService.getAllFarmers()
      ]);
      setPayments(paymentsRes.data || []);
      setFarmers(farmersRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const approvePayment = async (id: string) => {
    try {
      await paymentService.approvePayment(id);
      await loadData();
    } catch (e) {
      console.error('Approve failed', e);
    }
  };

  const rejectPayment = async (id: string) => {
    try {
      await paymentService.rejectPayment(id);
      await loadData();
    } catch (e) {
      console.error('Reject failed', e);
    }
  };

  // Financial metrics data
  const monthlyFinancials = [
    { month: 'Jan', revenue: 125000, expenses: 89000, profit: 36000, cashFlow: 42000 },
    { month: 'Feb', revenue: 142000, expenses: 95000, profit: 47000, cashFlow: 51000 },
    { month: 'Mar', revenue: 138000, expenses: 92000, profit: 46000, cashFlow: 48000 },
    { month: 'Apr', revenue: 156000, expenses: 108000, profit: 48000, cashFlow: 55000 },
    { month: 'May', revenue: 149000, expenses: 102000, profit: 47000, cashFlow: 52000 },
    { month: 'Jun', revenue: 167000, expenses: 115000, profit: 52000, cashFlow: 58000 }
  ];

  // Budget allocation
  const budgetAllocation = [
    { category: 'Seeds & Supplies', amount: 45000, percentage: 30, color: '#3B82F6' },
    { category: 'Labor Costs', amount: 37500, percentage: 25, color: '#10B981' },
    { category: 'Equipment', amount: 30000, percentage: 20, color: '#F59E0B' },
    { category: 'Maintenance', amount: 22500, percentage: 15, color: '#EF4444' },
    { category: 'Other', amount: 15000, percentage: 10, color: '#8B5CF6' }
  ];

  // Payment status distribution
  const paymentStatus = [
    { name: 'Completed', value: 68, color: '#10B981' },
    { name: 'Pending', value: 22, color: '#F59E0B' },
    { name: 'Overdue', value: 10, color: '#EF4444' }
  ];

  // ROI by crop type
  const cropROI = [
    { crop: 'Wheat', investment: 25000, revenue: 42000, roi: 68 },
    { crop: 'Corn', investment: 18000, revenue: 28000, roi: 56 },
    { crop: 'Rice', investment: 22000, revenue: 31000, roi: 41 },
    { crop: 'Barley', investment: 15000, revenue: 21000, roi: 40 },
    { crop: 'Soybeans', investment: 20000, revenue: 26000, roi: 30 }
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
                  <span className="text-white font-bold text-sm">💰</span>
                </div>
                <span className="text-xl font-bold text-gray-900">FINANCIAL</span>
                <span className="text-sm text-gray-500">MANAGEMENT</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <span className="text-sm font-medium">Finance Manager</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Financial KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">UGX 167K</p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12.5% vs last month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Net Profit */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Profit</p>
                <p className="text-3xl font-bold text-gray-900">UGX 52K</p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8.3% vs last month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-3xl font-bold text-gray-900">UGX 115K</p>
                <p className="text-sm text-red-600 mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +6.7% vs last month
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          {/* Cash Flow */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cash Flow</p>
                <p className="text-3xl font-bold text-gray-900">UGX 58K</p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +15.2% vs last month
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <PiggyBank className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Financial Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue & Profit Trends */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Revenue & Profit Trends</h2>
              <select className="text-sm border border-gray-300 rounded px-3 py-1">
                <option>Last 6 Months</option>
                <option>Last 12 Months</option>
                <option>This Year</option>
              </select>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyFinancials}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatUGX(Number(value)), '']} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    name="Revenue"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="Profit"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cashFlow" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    name="Cash Flow"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Budget Allocation */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Budget Allocation</h2>
            
            <div className="space-y-4">
              {budgetAllocation.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.category}</span>
                    <span className="text-sm text-gray-600">{formatUGX(item.amount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                  <div className="text-right text-xs text-gray-500">{item.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Pending Payment Requests</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 pr-4">Farmer</th>
                  <th className="py-2 pr-4">Purpose</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4">Requested At</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.filter(p => p.status === 'pending').map((p) => {
                  const farmer = farmers.find(f => String(f._id) === String(p.farmer_id));
                  return (
                    <tr key={String(p._id)} className="border-t">
                      <td className="py-2 pr-4">{farmer ? farmer.name || farmer.full_name || farmer.first_name : String(p.farmer_id)}</td>
                      <td className="py-2 pr-4">{p.purpose || '-'}</td>
                      <td className="py-2 pr-4">{formatUGX(p.amount || 0)}</td>
                      <td className="py-2 pr-4">{p.requested_at ? new Date(p.requested_at).toLocaleString() : '-'}</td>
                      <td className="py-2 pr-4 space-x-2">
                        <button onClick={() => approvePayment(String(p._id))} className="px-3 py-1 rounded bg-green-600 text-white">Approve</button>
                        <button onClick={() => rejectPayment(String(p._id))} className="px-3 py-1 rounded bg-red-600 text-white">Reject</button>
                      </td>
                    </tr>
                  );
                })}
                {payments.filter(p => p.status === 'pending').length === 0 && (
                  <tr>
                    <td className="py-4 text-gray-500" colSpan={5}>No pending payment requests</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Payment Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Status</h2>
            
            <div className="flex justify-center mb-4">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      dataKey="value"
                    >
                      {paymentStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="space-y-2">
              {paymentStatus.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: status.color }}
                    ></div>
                    <span className="text-sm">{status.name}</span>
                  </div>
                  <span className="text-sm font-medium">{status.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* ROI by Crop */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">ROI by Crop Type</h2>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cropROI}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="crop" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'ROI']} />
                  <Bar dataKey="roi" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Outstanding Payments */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Outstanding Payments</h3>
              <CreditCard className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Overdue Payments</p>
                  <p className="text-xs text-gray-600">15 farmers</p>
                </div>
                <p className="text-lg font-bold text-red-600">UGX 23,450</p>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Due This Week</p>
                  <p className="text-xs text-gray-600">28 farmers</p>
                </div>
                <p className="text-lg font-bold text-yellow-600">UGX 45,200</p>
              </div>
            </div>
          </div>

          {/* Cost Analysis */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Cost Analysis</h3>
              <Calculator className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Cost per Acre</span>
                <span className="font-medium">UGX 412</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Labor Cost Ratio</span>
                <span className="font-medium">25%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Equipment Efficiency</span>
                <span className="font-medium text-green-600">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Waste Reduction</span>
                <span className="font-medium text-green-600">-8%</span>
              </div>
            </div>
          </div>

          {/* Financial Alerts */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Financial Alerts</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Budget Exceeded</p>
                  <p className="text-xs text-gray-600">Equipment maintenance over budget by 15%</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Payment Reminder</p>
                  <p className="text-xs text-gray-600">45 payments due in next 7 days</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Revenue Target</p>
                  <p className="text-xs text-gray-600">Monthly target achieved 112%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialManagerDashboard;
