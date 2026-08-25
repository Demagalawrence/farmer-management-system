import { ObjectId } from 'mongodb';

export type CropType = 'maize' | 'beans' | 'cassava' | 'coffee' | 'tea' | 'banana' | 'rice' | 'other';
export type GrowthStage = 'planted' | 'germinating' | 'growing' | 'flowering' | 'fruiting' | 'harvest_ready' | 'harvested';
export type Season = 'first' | 'second' | 'long';

export interface CropCycle {
  _id?: ObjectId;
  farmer_id: ObjectId;
  field_id: ObjectId;
  crop_type: CropType;
  crop_variety?: string;
  season: Season;
  year: number;
  growth_stage: GrowthStage;
  planting_date: Date;
  expected_harvest_date: Date;
  actual_harvest_date?: Date;
  expected_yield_kg?: number;
  actual_yield_kg?: number;
  fertilizer_used?: string;
  pesticide_used?: string;
  irrigation_method?: 'rainfed' | 'drip' | 'sprinkler' | 'flood';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CropCycleInput {
  farmer_id: string;
  field_id: string;
  crop_type: CropType;
  crop_variety?: string;
  season: Season;
  year: number;
  growth_stage?: GrowthStage;
  planting_date: Date;
  expected_harvest_date: Date;
  expected_yield_kg?: number;
  fertilizer_used?: string;
  pesticide_used?: string;
  irrigation_method?: 'rainfed' | 'drip' | 'sprinkler' | 'flood';
  notes?: string;
}

export interface CropCycleUpdate {
  growth_stage?: GrowthStage;
  actual_harvest_date?: Date;
  actual_yield_kg?: number;
  notes?: string;
}
