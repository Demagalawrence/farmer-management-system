import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MonitoringVisit {
  _id: string;
  crop_cycle_id: string;
  visit_date: string;
  health_score: number;
  plant_height_cm?: number;
  soil_moisture?: string;
  pest_present: boolean;
  disease_present: boolean;
  notes?: string;
}

interface CropCycle {
  _id: string;
  farmer_id: string;
  crop_type: string;
  planting_date: string;
  total_area: number;
  status: string;
  monitoring_visits?: MonitoringVisit[];
}

const CropGrowthMonitoring: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedMetric, setSelectedMetric] = useState<'health' | 'height' | 'moisture'>('health');
  const [cropCycles, setCropCycles] = useState<CropCycle[]>([]);
  const [graphData, setGraphData] = useState<any[]>([]);
  const [areaStats, setAreaStats] = useState({
    excellent: 0,
    good: 0,
    fair: 0,
    poor: 0,
    critical: 0
  });

  // Load crop cycles and monitoring data
  useEffect(() => {
    loadCropData();
  }, []);

  // Update graph when selection changes
  useEffect(() => {
    if (cropCycles.length > 0) {
      updateGraphData();
      updateAreaStats();
    }
  }, [selectedCrop, selectedMetric, cropCycles]);

  const loadCropData = async () => {
    try {
      // TODO: Replace with real API call
      // const response = await cropCycleService.getAllActiveCycles();
      
      // MOCK DATA for now (will be replaced with real data)
      const mockCycles: CropCycle[] = [
        {
          _id: 'cycle_001',
          farmer_id: 'john',
          crop_type: 'maize',
          planting_date: '2025-06-01',
          total_area: 5.5,
          status: 'growing',
          monitoring_visits: [
            {
              _id: 'v1',
              crop_cycle_id: 'cycle_001',
              visit_date: '2025-06-15',
              health_score: 75,
              plant_height_cm: 45,
              soil_moisture: 'adequate',
              pest_present: false,
              disease_present: false,
            },
            {
              _id: 'v2',
              crop_cycle_id: 'cycle_001',
              visit_date: '2025-06-29',
              health_score: 85,
              plant_height_cm: 62,
              soil_moisture: 'good',
              pest_present: false,
              disease_present: false,
            },
            {
              _id: 'v3',
              crop_cycle_id: 'cycle_001',
              visit_date: '2025-07-13',
              health_score: 65,
              plant_height_cm: 78,
              soil_moisture: 'adequate',
              pest_present: true,
              disease_present: false,
            },
            {
              _id: 'v4',
              crop_cycle_id: 'cycle_001',
              visit_date: '2025-07-27',
              health_score: 80,
              plant_height_cm: 95,
              soil_moisture: 'good',
              pest_present: false,
              disease_present: false,
            },
          ]
        },
        {
          _id: 'cycle_002',
          farmer_id: 'mary',
          crop_type: 'rice',
          planting_date: '2025-06-10',
          total_area: 3.2,
          status: 'growing',
          monitoring_visits: [
            {
              _id: 'v5',
              crop_cycle_id: 'cycle_002',
              visit_date: '2025-06-24',
              health_score: 70,
              plant_height_cm: 30,
              soil_moisture: 'high',
              pest_present: false,
              disease_present: false,
            },
            {
              _id: 'v6',
              crop_cycle_id: 'cycle_002',
              visit_date: '2025-07-08',
              health_score: 90,
              plant_height_cm: 55,
              soil_moisture: 'high',
              pest_present: false,
              disease_present: false,
            },
          ]
        }
      ];
      
      setCropCycles(mockCycles);
    } catch (error) {
      console.error('Failed to load crop data:', error);
    }
  };

  const updateGraphData = () => {
    let allVisits: any[] = [];
    
    // Collect all monitoring visits
    cropCycles.forEach(cycle => {
      if (selectedCrop === 'all' || cycle.crop_type === selectedCrop) {
        const visits = (cycle.monitoring_visits || []).map(visit => ({
          date: formatDate(visit.visit_date),
          fullDate: visit.visit_date,
          crop: cycle.crop_type,
          health_score: visit.health_score,
          height: visit.plant_height_cm || 0,
          moisture: getMoistureScore(visit.soil_moisture || 'adequate'),
          pest_present: visit.pest_present,
          disease_present: visit.disease_present,
        }));
        allVisits = [...allVisits, ...visits];
      }
    });
    
    // Sort by date
    allVisits.sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
    
    // Group by date and aggregate if multiple crops on same date
    const groupedData = allVisits.reduce((acc: any[], visit) => {
      const existingDate = acc.find(d => d.date === visit.date);
      if (existingDate) {
        existingDate[visit.crop] = getMetricValue(visit);
      } else {
        acc.push({
          date: visit.date,
          [visit.crop]: getMetricValue(visit),
        });
      }
      return acc;
    }, []);
    
    setGraphData(groupedData);
  };

  const getMetricValue = (visit: any) => {
    switch (selectedMetric) {
      case 'health':
        return visit.health_score;
      case 'height':
        return visit.height;
      case 'moisture':
        return visit.moisture;
      default:
        return visit.health_score;
    }
  };

  const getMoistureScore = (moisture: string): number => {
    const scores: { [key: string]: number } = {
      'dry': 20,
      'low': 40,
      'adequate': 60,
      'good': 75,
      'high': 85,
      'waterlogged': 95
    };
    return scores[moisture] || 60;
  };

  const updateAreaStats = () => {
    const stats = {
      excellent: 0,
      good: 0,
      fair: 0,
      poor: 0,
      critical: 0
    };
    
    cropCycles.forEach(cycle => {
      if (selectedCrop === 'all' || cycle.crop_type === selectedCrop) {
        const latestVisit = cycle.monitoring_visits?.[cycle.monitoring_visits.length - 1];
        if (latestVisit) {
          const score = latestVisit.health_score;
          const area = cycle.total_area;
          
          if (score >= 90) stats.excellent += area;
          else if (score >= 75) stats.good += area;
          else if (score >= 60) stats.fair += area;
          else if (score >= 40) stats.poor += area;
          else stats.critical += area;
        }
      }
    });
    
    setAreaStats(stats);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const getUniqueCrops = (): string[] => {
    const crops = cropCycles.map(c => c.crop_type);
    return Array.from(new Set(crops));
  };

  const getCropColor = (crop: string): string => {
    const colors: { [key: string]: string } = {
      maize: '#22c55e',
      rice: '#3b82f6',
      coffee: '#f59e0b',
      beans: '#ef4444',
      cassava: '#8b5cf6',
    };
    return colors[crop] || '#6b7280';
  };

  const getMetricLabel = (): string => {
    switch (selectedMetric) {
      case 'health': return 'Health Score (0-100)';
      case 'height': return 'Plant Height (cm)';
      case 'moisture': return 'Soil Moisture Score';
      default: return 'Value';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Crop Growth Monitoring</h2>
        
        <div className="flex space-x-3">
          {/* Metric Selector */}
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="health">Health Score</option>
            <option value="height">Plant Height</option>
            <option value="moisture">Soil Moisture</option>
          </select>
          
          {/* Crop Selector */}
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Crops</option>
            {getUniqueCrops().map(crop => (
              <option key={crop} value={crop}>
                {crop.charAt(0).toUpperCase() + crop.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Area Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{areaStats.excellent.toFixed(1)} Acres</div>
          <div className="text-sm text-gray-600">Excellent</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{areaStats.good.toFixed(1)} Acres</div>
          <div className="text-sm text-gray-600">Good</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{areaStats.fair.toFixed(1)} Acres</div>
          <div className="text-sm text-gray-600">Fair</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{areaStats.poor.toFixed(1)} Acres</div>
          <div className="text-sm text-gray-600">Poor</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{areaStats.critical.toFixed(1)} Acres</div>
          <div className="text-sm text-gray-600">Critical</div>
        </div>
      </div>
      
      {/* Graph */}
      {graphData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              label={{ value: getMetricLabel(), angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            
            {/* Dynamic lines based on crops */}
            {getUniqueCrops().map(crop => (
              <Line
                key={crop}
                type="monotone"
                dataKey={crop}
                stroke={getCropColor(crop)}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name={crop.charAt(0).toUpperCase() + crop.slice(1)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <p className="text-gray-600 text-lg mb-2">No monitoring data available</p>
            <p className="text-gray-500 text-sm">Start recording crop visits to see growth trends</p>
          </div>
        </div>
      )}
      
      {/* Data Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-gray-600 mb-1">Total Active Crops</div>
          <div className="text-2xl font-bold text-gray-800">{cropCycles.length}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-gray-600 mb-1">Total Area Monitored</div>
          <div className="text-2xl font-bold text-gray-800">
            {cropCycles.reduce((sum, c) => sum + c.total_area, 0).toFixed(1)} Acres
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-gray-600 mb-1">Total Monitoring Visits</div>
          <div className="text-2xl font-bold text-gray-800">
            {cropCycles.reduce((sum, c) => sum + (c.monitoring_visits?.length || 0), 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropGrowthMonitoring;
