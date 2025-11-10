import { Collection, ObjectId } from 'mongodb';
import { Notification, NotificationInput } from '../models/Notification';
import { getDb } from '../config/db';

export class NotificationService {
  private collection: Collection<Notification>;

  constructor() {
    this.collection = getDb().collection<Notification>('notifications');
  }

  async create(notification: NotificationInput): Promise<Notification> {
    const normalizedNotification: any = {
      ...notification,
      report_id: typeof notification.report_id === 'string' ? new ObjectId(notification.report_id) : notification.report_id,
      recipient_id: typeof notification.recipient_id === 'string' ? new ObjectId(notification.recipient_id) : notification.recipient_id,
      read: notification.read ?? false,
      created_at: notification.created_at || new Date()
    };

    const result = await this.collection.insertOne(normalizedNotification);
    return { _id: result.insertedId, ...normalizedNotification };
  }

  async createBulk(notifications: NotificationInput[]): Promise<Notification[]> {
    if (notifications.length === 0) {
      console.log('[NotificationService] No notifications to create');
      return [];
    }

    console.log(`[NotificationService] Creating ${notifications.length} notifications`);
    console.log('[NotificationService] Input notifications:', JSON.stringify(notifications, null, 2));

    const normalizedNotifications = notifications.map(notification => ({
      ...notification,
      report_id: typeof notification.report_id === 'string' ? new ObjectId(notification.report_id) : notification.report_id,
      recipient_id: typeof notification.recipient_id === 'string' ? new ObjectId(notification.recipient_id) : notification.recipient_id,
      read: notification.read ?? false,
      created_at: notification.created_at || new Date()
    }));

    console.log('[NotificationService] Normalized notifications:', JSON.stringify(normalizedNotifications.map(n => ({
      ...n,
      report_id: n.report_id.toString(),
      recipient_id: n.recipient_id.toString()
    })), null, 2));

    const result = await this.collection.insertMany(normalizedNotifications);
    console.log(`[NotificationService] Successfully inserted ${result.insertedCount} notifications`);
    
    return normalizedNotifications.map((notif, index) => ({
      _id: result.insertedIds[index],
      ...notif
    }));
  }

  async findByRecipient(recipientId: string | ObjectId, limit: number = 50): Promise<Notification[]> {
    const objectId = typeof recipientId === 'string' ? new ObjectId(recipientId) : recipientId;
    console.log(`[NotificationService] Finding notifications for recipient: ${objectId.toString()}`);
    
    const notifications = await this.collection
      .find({ recipient_id: objectId })
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();
    
    console.log(`[NotificationService] Found ${notifications.length} notifications for recipient ${objectId.toString()}`);
    if (notifications.length > 0) {
      console.log('[NotificationService] Sample notification:', JSON.stringify(notifications[0], null, 2));
    }
    
    return notifications;
  }

  async findUnreadByRecipient(recipientId: string | ObjectId): Promise<Notification[]> {
    const objectId = typeof recipientId === 'string' ? new ObjectId(recipientId) : recipientId;
    return await this.collection
      .find({ recipient_id: objectId, read: false })
      .sort({ created_at: -1 })
      .toArray();
  }

  async getUnreadCount(recipientId: string | ObjectId): Promise<number> {
    const objectId = typeof recipientId === 'string' ? new ObjectId(recipientId) : recipientId;
    return await this.collection.countDocuments({ recipient_id: objectId, read: false });
  }

  async markAsRead(notificationId: string | ObjectId, recipientId: string | ObjectId): Promise<boolean> {
    const notifObjectId = typeof notificationId === 'string' ? new ObjectId(notificationId) : notificationId;
    const recipientObjectId = typeof recipientId === 'string' ? new ObjectId(recipientId) : recipientId;
    
    const result = await this.collection.updateOne(
      { _id: notifObjectId, recipient_id: recipientObjectId },
      { $set: { read: true, read_at: new Date() } }
    );
    return result.modifiedCount === 1;
  }

  async markAllAsRead(recipientId: string | ObjectId): Promise<number> {
    const objectId = typeof recipientId === 'string' ? new ObjectId(recipientId) : recipientId;
    const result = await this.collection.updateMany(
      { recipient_id: objectId, read: false },
      { $set: { read: true, read_at: new Date() } }
    );
    return result.modifiedCount;
  }

  async delete(notificationId: string | ObjectId, recipientId: string | ObjectId): Promise<boolean> {
    const notifObjectId = typeof notificationId === 'string' ? new ObjectId(notificationId) : notificationId;
    const recipientObjectId = typeof recipientId === 'string' ? new ObjectId(recipientId) : recipientId;
    
    const result = await this.collection.deleteOne({
      _id: notifObjectId,
      recipient_id: recipientObjectId
    });
    return result.deletedCount === 1;
  }

  async findById(notificationId: string | ObjectId): Promise<Notification | null> {
    const objectId = typeof notificationId === 'string' ? new ObjectId(notificationId) : notificationId;
    return await this.collection.findOne({ _id: objectId });
  }
}
