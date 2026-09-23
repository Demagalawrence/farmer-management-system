import { ObjectId } from 'mongodb';

export type NotificationType = 'weather_alert' | 'harvest_reminder' | 'payment_due' | 'field_inspection' | 'system';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  _id?: ObjectId;
  farmer_id: ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  read: boolean;
  action_url?: string;
  metadata?: Record<string, unknown>;
  created_at: Date;
  read_at?: Date;
}

export interface NotificationInput {
  farmer_id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  action_url?: string;
  metadata?: Record<string, unknown>;
}
