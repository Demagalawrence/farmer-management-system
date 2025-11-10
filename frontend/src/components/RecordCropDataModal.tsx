import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { farmerService } from '../services/farmerService';
import { paymentService } from '../services/paymentService';

interface RecordCropDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

// Crop pricing rates (will move to database later)
const CROP_RATES: { [key: string]: { [grade: string]: number } } = {
  maize: { "Grade A": 1200, "Grade B": 1000, "Grade C": 800 },
  rice: { "Grade A": 2500, "Grade B": 2000, "Grade C": 1500 },
  coffee: { "Grade A": 5000, "Grade B": 4000, "Grade C": 3000 },
  beans: { "Grade A": 1800, "Grade B": 1500, "Grade C": 1200 },
  cassava: { "Grade A": 600, "Grade B": 500, "Grade C": 400 },
};

const RecordCropDataModal: React.FC<RecordCropDataModalProps> = ({ isOpen, onClose, onSuccess }) => {
  // Visit Type
  const [visitType, setVisitType] = useState<'planting' | 'monitoring' | 'harvest'>('planting');
  
  // Common fields
  const [farmers, setFarmers] = useState<any[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState('');
  const [cropType, setCropType] = useState('maize');
  const [variety, setVariety] = useState('');
  const [notes, setNotes] = useState('');
  
  // Planting specific
  const [plantingDate, setPlantingDate] = useState('');
  const [areaPlanted, setAreaPlanted] = useState('');
  const [expectedYield, setExpectedYield] = useState('');
  const [advancePercentage] = useState(30); // Fixed at 30%
  
  // Harvest specific
  const [harvestDate, setHarvestDate] = useState('');
  const [actualQuantity, setActualQuantity] = useState('');
  const [qualityGrade, setQualityGrade] = useState('Grade A');
  const [moistureContent, setMoistureContent] = useState('');
  
  // Monitoring specific
  const [healthStatus, setHealthStatus] = useState('good');
  const [pestPresent, setPestPresent] = useState(false);
  const [pestDetails, setPestDetails] = useState('');
  
  // Calculated values
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [harvestValue, setHarvestValue] = useState(0);
  const [previousAdvance, setPreviousAdvance] = useState(0);
  const [finalPayment, setFinalPayment] = useState(0);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingFarmers, setLoadingFarmers] = useState(false);
  
  // Load farmers on mount
  useEffect(() => {
    if (isOpen) {
      loadFarmers();
    }
  }, [isOpen]);
  
  const loadFarmers = async () => {
    try {
      setLoadingFarmers(true);
      const response = await farmerService.getAllFarmers();
      const farmersList = Array.isArray(response) ? response : (response?.data || response?.items || []);
      setFarmers(farmersList);
    } catch (err) {
      console.error('Failed to load farmers:', err);
    } finally {
      setLoadingFarmers(false);
    }
  };
  
  // Calculate advance payment for planting
  useEffect(() => {
    if (visitType === 'planting' && expectedYield && cropType) {
      const rate = CROP_RATES[cropType]?.["Grade A"] || 0;
      const expectedValue = parseFloat(expectedYield) * rate;
      const advance = expectedValue * (advancePercentage / 100);
      setAdvanceAmount(Math.round(advance));
    }
  }, [expectedYield, cropType, advancePercentage, visitType]);
  
  // Calculate final payment for harvest
  useEffect(() => {
    if (visitType === 'harvest' && actualQuantity && cropType && qualityGrade) {
      const rate = CROP_RATES[cropType]?.[qualityGrade] || 0;
      const totalValue = parseFloat(actualQuantity) * rate;
      setHarvestValue(Math.round(totalValue));
      
      // TODO: Fetch actual previous advance from database
      // For now using mock data
      const mockAdvance = 0; // Will be fetched based on farmer & crop cycle
      setPreviousAdvance(mockAdvance);
      setFinalPayment(Math.round(totalValue - mockAdvance));
    }
  }, [actualQuantity, cropType, qualityGrade, visitType]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Validate
      if (!selectedFarmer) {
        throw new Error('Please select a farmer');
      }
      
      if (visitType === 'planting') {
        await handlePlantingSubmit();
      } else if (visitType === 'harvest') {
        await handleHarvestSubmit();
      } else {
        await handleMonitoringSubmit();
      }
      
      onSuccess(`${visitType.charAt(0).toUpperCase() + visitType.slice(1)} data recorded successfully!`);
      resetForm();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record crop data');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePlantingSubmit = async () => {
    // Create crop cycle record
    const cropCycleData = {
      farmer_id: selectedFarmer,
      crop_type: cropType,
      variety,
      planting_date: plantingDate,
      area_planted: parseFloat(areaPlanted),
      expected_yield_kg: parseFloat(expectedYield),
      rate_per_kg: CROP_RATES[cropType]["Grade A"],
      expected_value: parseFloat(expectedYield) * CROP_RATES[cropType]["Grade A"],
      advance_percentage: advancePercentage,
      advance_amount: advanceAmount,
      status: 'planting',
      notes,
    };
    
    // TODO: Save crop cycle to database
    console.log('Crop Cycle Data:', cropCycleData);
    
    // Create advance payment request
    const paymentData = {
      farmer_id: selectedFarmer,
      amount: advanceAmount,
      payment_type: 'advance',
      description: `Advance payment for ${cropType} planting (${advancePercentage}%)`,
      status: 'pending',
      calculation: {
        expected_yield: parseFloat(expectedYield),
        rate: CROP_RATES[cropType]["Grade A"],
        expected_value: parseFloat(expectedYield) * CROP_RATES[cropType]["Grade A"],
        percentage: advancePercentage,
        advance: advanceAmount,
      },
    };
    
    // Create payment request
    await paymentService.createPayment(paymentData as any);
  };
  
  const handleHarvestSubmit = async () => {
    // Create harvest record
    const harvestData = {
      farmer_id: selectedFarmer,
      crop_type: cropType,
      harvest_date: harvestDate,
      quantity_kg: parseFloat(actualQuantity),
      quality_grade: qualityGrade,
      moisture_content: moistureContent ? parseFloat(moistureContent) : null,
      harvest_value: harvestValue,
      notes,
    };
    
    // TODO: Save harvest to database
    console.log('Harvest Data:', harvestData);
    
    // Create final payment request
    const paymentData = {
      farmer_id: selectedFarmer,
      amount: finalPayment,
      payment_type: 'final',
      description: `Final payment for ${cropType} harvest`,
      status: 'pending',
      calculation: {
        actual_yield: parseFloat(actualQuantity),
        quality_grade: qualityGrade,
        rate: CROP_RATES[cropType][qualityGrade],
        harvest_value: harvestValue,
        advance_paid: previousAdvance,
        balance_due: finalPayment,
      },
    };
    
    // Create payment request
    await paymentService.createPayment(paymentData as any);
  };
  
  const handleMonitoringSubmit = async () => {
    // Create monitoring visit record
    const monitoringData = {
      farmer_id: selectedFarmer,
      crop_type: cropType,
      visit_date: new Date().toISOString(),
      health_status: healthStatus,
      pest_present: pestPresent,
      pest_details: pestDetails,
      notes,
    };
    
    // TODO: Save monitoring record to database
    console.log('Monitoring Data:', monitoringData);
  };
  
  const resetForm = () => {
    setVisitType('planting');
    setSelectedFarmer('');
    setCropType('maize');
    setVariety('');
    setNotes('');
    setPlantingDate('');
    setAreaPlanted('');
    setExpectedYield('');
    setHarvestDate('');
    setActualQuantity('');
    setQualityGrade('Grade A');
    setMoistureContent('');
    setHealthStatus('good');
    setPestPresent(false);
    setPestDetails('');
    setError('');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">🌾 Record Crop Data</h2>
            <p className="text-sm text-gray-500 mt-1">Track planting, monitoring, and harvest activities</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6"/>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Visit Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Visit Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setVisitType('planting')}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  visitType === 'planting'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🌱 Planting
              </button>
              <button
                type="button"
                onClick={() => setVisitType('monitoring')}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  visitType === 'monitoring'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👁️ Monitoring
              </button>
              <button
                type="button"
                onClick={() => setVisitType('harvest')}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  visitType === 'harvest'
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📦 Harvest
              </button>
            </div>
          </div>
          
          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Farmer Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Farmer <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedFarmer}
                onChange={(e) => setSelectedFarmer(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
                disabled={loadingFarmers}
              >
                <option value="">
                  {loadingFarmers ? 'Loading farmers...' : 'Select a farmer'}
                </option>
                {farmers.map((farmer) => (
                  <option key={farmer._id} value={farmer._id}>
                    {farmer.name || farmer.full_name || `Farmer ${farmer._id}`}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Crop Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crop Type <span className="text-red-500">*</span>
              </label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="maize">Maize</option>
                <option value="rice">Rice</option>
                <option value="coffee">Coffee</option>
                <option value="beans">Beans</option>
                <option value="cassava">Cassava</option>
              </select>
            </div>
            
            {/* Variety */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variety/Cultivar
              </label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Hybrid DK-777"
              />
            </div>
          </div>
          
          {/* Conditional Fields Based on Visit Type */}
          {visitType === 'planting' && (
            <div className="space-y-4 border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-800">🌱 Planting Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Planting Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={plantingDate}
                    onChange={(e) => setPlantingDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area Planted (hectares) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={areaPlanted}
                    onChange={(e) => setAreaPlanted(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 5.5"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Yield (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={expectedYield}
                    onChange={(e) => setExpectedYield(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 1000"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Based on field size and crop type
                  </p>
                </div>
              </div>
              
              {/* Advance Payment Calculation */}
              {expectedYield && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-green-900 mb-3">💰 Advance Payment Calculation</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Rate per kg (Grade A):</span>
                      <span className="font-semibold">UGX {CROP_RATES[cropType]["Grade A"].toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Expected yield:</span>
                      <span className="font-semibold">{expectedYield} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Expected value:</span>
                      <span className="font-semibold">
                        UGX {(parseFloat(expectedYield) * CROP_RATES[cropType]["Grade A"]).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Advance percentage:</span>
                      <span>{advancePercentage}%</span>
                    </div>
                    <div className="border-t border-green-300 pt-2 flex justify-between">
                      <span className="font-bold text-green-900">ADVANCE AMOUNT:</span>
                      <span className="font-bold text-green-900 text-lg">
                        UGX {advanceAmount.toLocaleString()} ✅
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    This will create an advance payment request for the Financial Manager to approve.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {visitType === 'monitoring' && (
            <div className="space-y-4 border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-800">👁️ Field Monitoring</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health Status
                </label>
                <select
                  value={healthStatus}
                  onChange={(e) => setHealthStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pestPresent}
                    onChange={(e) => setPestPresent(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Pests Detected</span>
                </label>
              </div>
              
              {pestPresent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pest Details
                  </label>
                  <textarea
                    value={pestDetails}
                    onChange={(e) => setPestDetails(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe the pest issue and action taken..."
                  />
                </div>
              )}
            </div>
          )}
          
          {visitType === 'harvest' && (
            <div className="space-y-4 border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-800">📦 Harvest Recording</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harvest Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actual Quantity (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={actualQuantity}
                    onChange={(e) => setActualQuantity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., 950"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quality Grade <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Grade A">Grade A</option>
                    <option value="Grade B">Grade B</option>
                    <option value="Grade C">Grade C</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moisture Content (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={moistureContent}
                    onChange={(e) => setMoistureContent(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., 13.5"
                  />
                </div>
              </div>
              
              {/* Final Payment Calculation */}
              {actualQuantity && qualityGrade && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-orange-900 mb-3">💰 Final Payment Calculation</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Actual yield:</span>
                      <span className="font-semibold">{actualQuantity} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Quality grade:</span>
                      <span className="font-semibold">{qualityGrade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Rate per kg:</span>
                      <span className="font-semibold">
                        UGX {CROP_RATES[cropType][qualityGrade].toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Harvest value:</span>
                      <span className="font-semibold">UGX {harvestValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Advance already paid:</span>
                      <span>-UGX {previousAdvance.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-orange-300 pt-2 flex justify-between">
                      <span className="font-bold text-orange-900">BALANCE DUE:</span>
                      <span className="font-bold text-orange-900 text-lg">
                        UGX {finalPayment.toLocaleString()} ✅
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    This will create a final payment request for the remaining balance.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes & Observations
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              rows={3}
              placeholder="Any additional information..."
            />
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition-all flex items-center justify-center ${
                visitType === 'planting' ? 'bg-green-600 hover:bg-green-700' :
                visitType === 'monitoring' ? 'bg-blue-600 hover:bg-blue-700' :
                'bg-orange-600 hover:bg-orange-700'
              } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {visitType === 'planting' && '💰 Create Advance Payment'}
                  {visitType === 'monitoring' && '✅ Save Monitoring Data'}
                  {visitType === 'harvest' && '💰 Create Final Payment'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordCropDataModal;
