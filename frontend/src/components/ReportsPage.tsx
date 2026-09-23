import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Download, Calendar, TrendingUp, DollarSign, Users, Package } from 'lucide-react';
import { farmerService } from '../services/farmerService';
import { paymentService } from '../services/paymentService';
import { harvestService } from '../services/harvestService';

interface ReportsPageProps {
  onBack: () => void;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ onBack }) => {
  const [farmers, setFarmers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [harvests, setHarvests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [farmersRes, paymentsRes, harvestsRes] = await Promise.all([
          farmerService.getAllFarmers(),
          paymentService.getAllPayments(),
          harvestService.getAllHarvests(),
        ]);
        
        setFarmers(farmersRes?.data || farmersRes || []);
        setPayments(paymentsRes?.data || paymentsRes || []);
        setHarvests(Array.isArray(harvestsRes) ? harvestsRes : (harvestsRes?.data || []));
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalHarvests = harvests.reduce((sum, h) => sum + (Number(h.quantity_tons) || 0), 0);

  return (
    <div className="min-h-screen bg-[#0f1419] text-white p-8">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <button className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
          <Download className="w-5 h-5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Reports Content */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
          <p className="text-gray-400">Comprehensive system reports and insights</p>
        </div>

        {/* Period Selector */}
        <div className="mb-6 flex items-center space-x-4">
          <span className="text-gray-400">Period:</span>
          {['week', 'month', 'quarter', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                selectedPeriod === period
                  ? 'bg-cyan-500 text-white'
                  : 'bg-[#1a1d2e] text-gray-400 hover:bg-gray-700'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#1a1d2e] p-6 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-10 h-10 text-cyan-400" />
                  <span className="text-xs text-gray-400 uppercase">Total Farmers</span>
                </div>
                <p className="text-3xl font-bold text-white">{farmers.length}</p>
                <p className="text-sm text-green-400 mt-2">+12% from last period</p>
              </div>

              <div className="bg-[#1a1d2e] p-6 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-10 h-10 text-green-400" />
                  <span className="text-xs text-gray-400 uppercase">Revenue</span>
                </div>
                <p className="text-3xl font-bold text-white">UGX {(totalRevenue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-green-400 mt-2">+8% from last period</p>
              </div>

              <div className="bg-[#1a1d2e] p-6 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <Package className="w-10 h-10 text-blue-400" />
                  <span className="text-xs text-gray-400 uppercase">Harvests</span>
                </div>
                <p className="text-3xl font-bold text-white">{totalHarvests.toFixed(0)}T</p>
                <p className="text-sm text-green-400 mt-2">+15% from last period</p>
              </div>

              <div className="bg-[#1a1d2e] p-6 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-10 h-10 text-purple-400" />
                  <span className="text-xs text-gray-400 uppercase">Payments</span>
                </div>
                <p className="text-3xl font-bold text-white">{payments.length}</p>
                <p className="text-sm text-green-400 mt-2">+10% from last period</p>
              </div>
            </div>

            {/* Detailed Reports - Square Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Farmer Report Card */}
              <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-cyan-500 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
                <FileText className="w-16 h-16 text-cyan-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2 text-center">Farmer Report</h3>
                <div className="text-center space-y-1">
                  <div className="text-3xl font-bold text-cyan-400">{farmers.length}</div>
                  <div className="text-xs text-gray-400">Total Registered</div>
                  <div className="text-sm text-green-400 mt-2">
                    {farmers.filter(f => f.status === 'active').length} Active
                  </div>
                </div>
              </div>

              {/* Payment Report Card */}
              <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/20">
                <DollarSign className="w-16 h-16 text-green-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2 text-center">Payments</h3>
                <div className="text-center space-y-1">
                  <div className="text-3xl font-bold text-green-400">{payments.length}</div>
                  <div className="text-xs text-gray-400">Total Payments</div>
                  <div className="text-sm text-green-400 mt-2">
                    {payments.filter(p => p.status === 'paid').length} Paid
                  </div>
                </div>
              </div>

              {/* Harvest Report Card */}
              <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20">
                <Package className="w-16 h-16 text-blue-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2 text-center">Harvests</h3>
                <div className="text-center space-y-1">
                  <div className="text-3xl font-bold text-blue-400">{harvests.length}</div>
                  <div className="text-xs text-gray-400">Total Records</div>
                  <div className="text-sm text-green-400 mt-2">
                    {totalHarvests.toFixed(1)}T Volume
                  </div>
                </div>
              </div>

              {/* Revenue Card */}
              <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20">
                <TrendingUp className="w-16 h-16 text-purple-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2 text-center">Revenue</h3>
                <div className="text-center space-y-1">
                  <div className="text-2xl font-bold text-purple-400">UGX {(totalRevenue / 1000000).toFixed(1)}M</div>
                  <div className="text-xs text-gray-400">Total Revenue</div>
                  <div className="text-sm text-green-400 mt-2">
                    +8% Growth
                  </div>
                </div>
              </div>

              {/* Active Farmers Card */}
              <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-cyan-500 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
                <Users className="w-16 h-16 text-cyan-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2 text-center">Active</h3>
                <div className="text-center space-y-1">
                  <div className="text-3xl font-bold text-cyan-400">
                    {farmers.filter(f => f.status === 'active').length}
                  </div>
                  <div className="text-xs text-gray-400">Active Farmers</div>
                  <div className="text-sm text-green-400 mt-2">
                    {farmers.length > 0 ? ((farmers.filter(f => f.status === 'active').length / farmers.length) * 100).toFixed(0) : 0}% Active
                  </div>
                </div>
              </div>

              {/* This Month Card */}
              <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-yellow-500 transition-all hover:shadow-lg hover:shadow-yellow-500/20">
                <Calendar className="w-16 h-16 text-yellow-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2 text-center">This Month</h3>
                <div className="text-center space-y-1">
                  <div className="text-3xl font-bold text-yellow-400">
                    {farmers.filter(f => {
                      const date = new Date(f.created_at || f.registration_date);
                      const now = new Date();
                      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                    }).length}
                  </div>
                  <div className="text-xs text-gray-400">New Registrations</div>
                  <div className="text-sm text-green-400 mt-2">
                    +12% vs Last
                  </div>
                </div>
              </div>

              {/* Pending Payments Card */}
              <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20">
                <FileText className="w-16 h-16 text-orange-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2 text-center">Pending</h3>
                <div className="text-center space-y-1">
                  <div className="text-3xl font-bold text-orange-400">
                    {payments.filter(p => p.status === 'pending').length}
                  </div>
                  <div className="text-xs text-gray-400">Pending Payments</div>
                  <div className="text-sm text-yellow-400 mt-2">
                    Needs Review
                  </div>
                </div>
              </div>

              {/* System Status Card */}
              <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-emerald-500 transition-all hover:shadow-lg hover:shadow-emerald-500/20">
                <TrendingUp className="w-16 h-16 text-emerald-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2 text-center">System</h3>
                <div className="text-center space-y-1">
                  <div className="text-2xl font-bold text-emerald-400">Active</div>
                  <div className="text-xs text-gray-400 capitalize">{selectedPeriod} Period</div>
                  <div className="text-sm text-green-400 mt-2">
                    ✓ Up to Date
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
