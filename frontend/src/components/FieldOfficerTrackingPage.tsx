import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, MapPin, Package, TrendingUp, Calendar, BarChart3, Activity } from 'lucide-react';
import { farmerService } from '../services/farmerService';
import { harvestService } from '../services/harvestService';
import { fieldService } from '../services/fieldService';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FieldOfficerTrackingPageProps {
  onBack: () => void;
}

const FieldOfficerTrackingPage: React.FC<FieldOfficerTrackingPageProps> = ({ onBack }) => {
  const [farmers, setFarmers] = useState<any[]>([]);
  const [harvests, setHarvests] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [farmersRes, harvestsRes, fieldsRes] = await Promise.all([
          farmerService.getAllFarmers(),
          harvestService.getAllHarvests(),
          fieldService.getAllFields(),
        ]);
        
        setFarmers(farmersRes?.data || farmersRes || []);
        setHarvests(Array.isArray(harvestsRes) ? harvestsRes : (harvestsRes?.data || []));
        setFields(fieldsRes?.data || fieldsRes || []);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate metrics
  const totalFarmers = farmers.length;
  const activeFarmers = farmers.filter(f => f.status === 'active').length;
  const totalFields = fields.length;
  const activeFields = fields.filter(f => f.status === 'active').length;
  const totalHarvests = harvests.length;
  const totalHarvestVolume = harvests.reduce((sum, h) => sum + (Number(h.quantity_tons) || 0), 0);

  // Monthly farmer registrations (last 6 months)
  const monthlyFarmers = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toLocaleString('default', { month: 'short' });
    const count = farmers.filter(f => {
      const fDate = new Date(f.created_at || f.registration_date);
      return fDate.getMonth() === date.getMonth() && fDate.getFullYear() === date.getFullYear();
    }).length;
    monthlyFarmers.push({ month, count });
  }

  // Weekly harvest data
  const weeklyHarvests = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - (i * 7));
    const week = `Week ${7 - i}`;
    const volume = harvests.filter(h => {
      const hDate = new Date(h.harvest_date || h.created_at);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - 7);
      return hDate >= weekStart && hDate < date;
    }).reduce((sum, h) => sum + (Number(h.quantity_tons) || 0), 0);
    weeklyHarvests.push({ week, volume: volume.toFixed(1) });
  }

  // Crop distribution
  const cropCounts: { [key: string]: number } = {};
  harvests.forEach(h => {
    const crop = h.crop_type || 'Other';
    cropCounts[crop] = (cropCounts[crop] || 0) + 1;
  });
  const topCrops = Object.entries(cropCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

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
        <h1 className="text-3xl font-bold text-white mb-2">Field Officer Performance Tracking</h1>
        <p className="text-gray-400">Monitor and analyze field officer activities and performance metrics</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        </div>
      ) : (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Farmers Card */}
            <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800 hover:border-cyan-500 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400 uppercase font-semibold">Farmers</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{totalFarmers}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Active</span>
                <span className="text-green-400 font-semibold">{activeFarmers}</span>
              </div>
              <div className="mt-3 text-xs text-green-400">
                +{farmers.filter(f => {
                  const date = new Date(f.created_at || f.registration_date);
                  const now = new Date();
                  return date.getMonth() === now.getMonth();
                }).length} this month
              </div>
            </div>

            {/* Total Fields Card */}
            <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800 hover:border-blue-500 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400 uppercase font-semibold">Fields</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{totalFields}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Active</span>
                <span className="text-blue-400 font-semibold">{activeFields}</span>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                {((activeFields / totalFields) * 100).toFixed(0)}% utilization
              </div>
            </div>

            {/* Total Harvests Card */}
            <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800 hover:border-green-500 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400 uppercase font-semibold">Harvests</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{totalHarvests}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Records</span>
                <span className="text-green-400 font-semibold">{totalHarvestVolume.toFixed(1)}T</span>
              </div>
              <div className="mt-3 text-xs text-green-400">
                Avg: {(totalHarvestVolume / totalHarvests).toFixed(2)}T per harvest
              </div>
            </div>

            {/* Performance Score Card */}
            <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800 hover:border-purple-500 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400 uppercase font-semibold">Performance</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {Math.min(95, 70 + (totalFarmers / 10))}%
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Rating</span>
                <span className="text-purple-400 font-semibold">Excellent</span>
              </div>
              <div className="mt-3 text-xs text-green-400">
                +5% from last month
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Farmer Registration Trend */}
            <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-cyan-400" />
                  Farmer Registration Trend
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyFarmers}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                  <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1d2e', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#06B6D4" 
                    strokeWidth={3}
                    dot={{ fill: '#06B6D4', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly Harvest Volume */}
            <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
                  Weekly Harvest Volume
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyHarvests}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                  <XAxis dataKey="week" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1d2e', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="volume" fill="#10B981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Crops */}
            <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-6">Top Crops by Harvest Count</h3>
              <div className="space-y-4">
                {topCrops.map((crop, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="text-gray-400 font-mono text-sm w-6">{idx + 1}.</span>
                      <span className="text-white font-medium">{crop.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-800 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
                          style={{ width: `${(crop.value / topCrops[0].value) * 100}%` }}
                        />
                      </div>
                      <span className="text-cyan-400 font-semibold w-12 text-right">{crop.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-6">Recent Field Activities</h3>
              <div className="space-y-4">
                {harvests.slice(0, 5).map((harvest, idx) => (
                  <div key={idx} className="flex items-start space-x-3 pb-3 border-b border-gray-800 last:border-0">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">
                        {harvest.crop_type} - {harvest.variety}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {harvest.quantity_tons}T • {new Date(harvest.harvest_date || harvest.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-green-400 font-semibold text-sm whitespace-nowrap">
                      ✓
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

export default FieldOfficerTrackingPage;
