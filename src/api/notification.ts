import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';
import type {
  NotificationVO,
  NotificationDetailVO,
  NotificationTypeVO,
  NotificationSettingsVO,
  DeviceVO,
  NotificationQuery,
  NotificationBatchReadRequest,
  NotificationBatchDeleteRequest,
  NotificationSettingsUpdateRequest,
  NotificationTypeSettingsRequest,
  DeviceRegisterRequest,
  TopicSubscribeRequest,
  TestNotificationRequest,
  NotificationModule,
} from '../types/notification';
import type { PageResult } from '../types/common';

export class NotificationApi implements NotificationModule {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  async list(query: NotificationQuery): Promise<NotificationVO[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      type: query.type,
      read: query.read,
      page: query.page,
      size: query.size,
    };
    const result = await this.client.get<PageResult<NotificationVO>>(appApiPath('/notification'), params);
    return result.content;
  }

  async getById(notificationId: string): Promise<NotificationDetailVO> {
    return this.client.get<NotificationDetailVO>(appApiPath(`/notification/${notificationId}`));
  }

  async getUnreadCount(): Promise<Record<string, number>> {
    return this.client.get<Record<string, number>>(appApiPath('/notification/unread/count'));
  }

  async getTypes(): Promise<NotificationTypeVO[]> {
    return this.client.get<NotificationTypeVO[]>(appApiPath('/notification/types'));
  }

  async markAsRead(notificationId: string): Promise<NotificationVO> {
    return this.client.put<NotificationVO>(appApiPath(`/notification/${notificationId}/read`));
  }

  async batchMarkAsRead(request: NotificationBatchReadRequest): Promise<void> {
    await this.client.put(appApiPath('/notification/batch/read'), request);
  }

  async markAllAsRead(type?: string): Promise<void> {
    await this.client.put(appApiPath('/notification/read/all'), undefined, { type });
  }

  async delete(notificationId: string): Promise<void> {
    await this.client.delete(appApiPath(`/notification/${notificationId}`));
  }

  async batchDelete(request: NotificationBatchDeleteRequest): Promise<void> {
    await this.client.delete(appApiPath('/notification/batch'), request);
  }

  async clear(type?: string, readOnly: boolean = false): Promise<void> {
    await this.client.delete(appApiPath('/notification/clear'), undefined, { type, readOnly });
  }

  async getSettings(): Promise<NotificationSettingsVO> {
    return this.client.get<NotificationSettingsVO>(appApiPath('/notification/settings'));
  }

  async updateSettings(request: NotificationSettingsUpdateRequest): Promise<NotificationSettingsVO> {
    return this.client.put<NotificationSettingsVO>(appApiPath('/notification/settings'), request);
  }

  async updateTypeSettings(type: string, request: NotificationTypeSettingsRequest): Promise<void> {
    await this.client.put(appApiPath(`/notification/settings/${type}`), request);
  }

  async registerDevice(request: DeviceRegisterRequest): Promise<void> {
    await this.client.post(appApiPath('/notification/devices'), request);
  }

  async unregisterDevice(deviceToken: string): Promise<void> {
    await this.client.delete(appApiPath(`/notification/devices/${deviceToken}`));
  }

  async listDevices(): Promise<DeviceVO[]> {
    return this.client.get<DeviceVO[]>(appApiPath('/notification/devices'));
  }

  async subscribeTopic(request: TopicSubscribeRequest): Promise<void> {
    await this.client.post(appApiPath('/notification/subscriptions'), request);
  }

  async unsubscribeTopic(topic: string): Promise<void> {
    await this.client.delete(appApiPath(`/notification/subscriptions/${topic}`));
  }

  async listSubscriptions(): Promise<string[]> {
    return this.client.get<string[]>(appApiPath('/notification/subscriptions'));
  }

  async sendTest(request: TestNotificationRequest): Promise<void> {
    await this.client.post(appApiPath('/notification/test'), request);
  }
}

export function createNotificationApi(client: HttpClient): NotificationModule {
  return new NotificationApi(client);
}
