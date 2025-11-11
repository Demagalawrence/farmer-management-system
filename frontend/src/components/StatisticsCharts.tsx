import React from 'react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StatisticsChartsProps {
  payments: any[];
  harvests: any[];
  farmers: any[];
  fields: any[];
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const StatisticsCharts: React.FC<StatisticsChartsProps> = ({ payments, harvests, farmers, fields }) => {
  
  // Payment Status Distribution (Pie Chart)
  const paymentStatusData = [
    { name: 'Paid', value: payments.filter(p => p.status === 'paid').length },
    { name: 'Pending', value: payments.filter(p => p.status === 'pending').length },
    { name: 'Approved', value: payments.filter(p => p.status === 'approved').length },
    { name: 'Rejected', value: payments.filter(p => p.status === 'rejected').length },
  ].filter(item => item.value > 0);

  // Revenue by Payment Status (Bar Chart)
  const revenueByStatus = [
    { 
      status: 'Paid', 
      amount: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (Number(p.amount) || 0), 0) / 1000000,
      count: payments.filter(p => p.status === 'paid').length
    },
    { 
      status: 'Pending', 
      amount: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (Number(p.amount) || 0), 0) / 1000000,
      count: payments.filter(p => p.status === 'pending').length
    },
    { 
      status: 'Approved', 
      amount: payments.filter(p => p.status === 'approved').reduce((sum, p) => sum + (Number(p.amount) || 0), 0) / 1000000,
      count: payments.filter(p => p.status === 'approved').length
    },
  ].filter(item => item.count > 0);

  // Harvest by Crop Type (Pie Chart)
  const harvestByCrop: { [key: string]: number } = {};
  harvests.forEach(h => {
    const crop = h.crop_type || 'Other';
    harvestByCrop[crop] = (harvestByCrop[crop] || 0) + (Number(h.quantity_tons) || 0);
  });
  const harvestCropData = Object.keys(harvestByCrop).map(crop => ({
    name: crop,
    value: Number(harvestByCrop[crop].toFixed(2))
  }));

  // Monthly Harvest Trends (Line Chart)
  const monthlyHarvests: { [key: string]: number } = {};
  harvests.forEach(h => {
    const date = new Date(h.harvest_date || h.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyHarvests[monthKey] = (monthlyHarvests[monthKey] || 0) + (Number(h.quantity_tons) || 0);
  });
  const monthlyHarvestData = Object.keys(monthlyHarvests)
    .sort()
    .slice(-6)
    .map(month => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      quantity: Number(monthlyHarvests[month].toFixed(2))
    }));

  // Quality Grade Distribution (Bar Chart)
  const qualityGrades = ['A', 'B', 'C'];
  const qualityData = qualityGrades.map(grade => ({
    grade: `Grade ${grade}`,
    quantity: harvests.filter(h => h.quality_grade === grade).reduce((sum, h) => sum + (Number(h.quantity_tons) || 0), 0),
    count: harvests.filter(h => h.quality_grade === grade).length
  })).filter(item => item.count > 0);

  // Farmer Activity (Top 5 by Harvest)
  const farmerHarvests: { [key: string]: { total: number; name: string } } = {};
  harvests.forEach(h => {
    const farmerId = String(h.farmer_id || 'unknown');
    if (!farmerHarvests[farmerId]) {
      const farmer = farmers.find(f => String(f._id) === farmerId);
      farmerHarvests[farmerId] = { total: 0, name: farmer?.name || `Farmer ${farmerId.substring(0, 6)}` };
    }
    farmerHarvests[farmerId].total += Number(h.quantity_tons) || 0;
  });
  const topFarmers = Object.values(farmerHarvests)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map(f => ({ name: f.name, harvest: Number(f.total.toFixed(2)) }));

  // Payment Timeline (Last 6 months)
  const monthlyPayments: { [key: string]: number } = {};
  payments.forEach(p => {
    const date = new Date(p.payment_date || p.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (p.status === 'paid') {
      monthlyPayments[monthKey] = (monthlyPayments[monthKey] || 0) + (Number(p.amount) || 0);
    }
  });
  const paymentTimelineData = Object.keys(monthlyPayments)
    .sort()
    .slice(-6)
    .map(month => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      amount: Number((monthlyPayments[month] / 1000000).toFixed(2))
    }));

  // Field Status Distribution
  const fieldsByStatus = [
    { name: 'Active Fields', value: fields.filter(f => f.status === 'active').length },
    { name: 'Inactive Fields', value: fields.filter(f => f.status !== 'active').length },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Row 1: Payment Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">💰 Payment Status Distribution</h3>
          {paymentStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-20">No payment data available</p>
          )}
        </div>

        {/* Revenue by Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">💵 Revenue by Payment Status (M UGX)</h3>
          {revenueByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip formatter={(value: any) => `${value.toFixed(2)}M UGX`} />
                <Legend />
                <Bar dataKey="amount" fill="#10B981" name="Amount (Millions)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-20">No revenue data available</p>
          )}
        </div>
      </div>

      {/* Row 2: Harvest Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Harvest by Crop Type */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🌾 Harvest Distribution by Crop Type (Tons)</h3>
          {harvestCropData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={harvestCropData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value }) => `${name}: ${value}T`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {harvestCropData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `${value} Tons`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-20">No harvest data available</p>
          )}
        </div>

        {/* Quality Grade Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">⭐ Harvest Quality Distribution (Tons)</h3>
          {qualityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={qualityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip formatter={(value: any) => `${value.toFixed(2)} Tons`} />
                <Legend />
                <Bar dataKey="quantity" fill="#F59E0B" name="Quantity (Tons)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-20">No quality data available</p>
          )}
        </div>
      </div>

      {/* Row 3: Trends Over Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Harvest Trends */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Monthly Harvest Trends (Tons)</h3>
          {monthlyHarvestData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyHarvestData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => `${value} Tons`} />
                <Legend />
                <Line type="monotone" dataKey="quantity" stroke="#10B981" strokeWidth={3} name="Harvest (Tons)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-20">No trend data available</p>
          )}
        </div>

        {/* Payment Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">💳 Payment Timeline (M UGX)</h3>
          {paymentTimelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={paymentTimelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => `${value}M UGX`} />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={3} name="Amount (Millions)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-20">No payment timeline data available</p>
          )}
        </div>
      </div>

      {/* Row 4: Farmer Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Farmers by Harvest */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🏆 Top 5 Farmers by Harvest (Tons)</h3>
          {topFarmers.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topFarmers} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip formatter={(value: any) => `${value} Tons`} />
                <Legend />
                <Bar dataKey="harvest" fill="#8B5CF6" name="Total Harvest (Tons)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-20">No farmer data available</p>
          )}
        </div>

        {/* Field Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🗺️ Field Status Distribution</h3>
          {fieldsByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fieldsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {fieldsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-20">No field data available</p>
          )}
        </div>
      </div>
    </div>
  );
};
