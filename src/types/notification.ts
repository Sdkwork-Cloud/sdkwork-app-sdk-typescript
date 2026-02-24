export interface NotificationVO {
  notificationId: string;
  type: string;
  title: string;
  content?: string;
  status: string;
  isRead: boolean;
  createdAt?: string;
  readAt?: string;
}

export interface NotificationDetailVO extends NotificationVO {
  redirectUrl?: string;
  extraData?: Record<string, unknown>;
}

export interface NotificationTypeVO {
  type: string;
  name: string;
  description?: string;
}

export interface NotificationSettingsVO {
  enablePush?: boolean;
  enableEmail?: boolean;
  enableSms?: boolean;
  enableInApp?: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  typeSettings?: Record<string, NotificationTypeSettingsVO>;
}

export interface NotificationTypeSettingsVO {
  type: string;
  enablePush?: boolean;
  enableInApp?: boolean;
  enableEmail?: boolean;
  enableSms?: boolean;
}

export interface DeviceVO {
  deviceId: string;
  deviceType: string;
  deviceName?: string;
  lastActiveAt?: string;
  isActive?: boolean;
}

export interface NotificationQuery {
  type?: string;
  read?: boolean;
  page?: number;
  size?: number;
}

export interface NotificationBatchReadRequest {
  notificationIds: string[];
}

export interface NotificationBatchDeleteRequest {
  notificationIds: string[];
}

export interface NotificationSettingsUpdateRequest {
  enablePush?: boolean;
  enableEmail?: boolean;
  enableSms?: boolean;
  enableInApp?: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

export interface NotificationTypeSettingsRequest {
  enablePush?: boolean;
  enableInApp?: boolean;
  enableEmail?: boolean;
  enableSms?: boolean;
}

export interface DeviceRegisterRequest {
  deviceToken: string;
  deviceType: string;
  deviceName?: string;
}

export interface TopicSubscribeRequest {
  topic: string;
}

export interface TestNotificationRequest {
  type?: string;
  content?: string;
}

export interface NotificationModule {
  list(query: NotificationQuery): Promise<NotificationVO[]>;
  getById(notificationId: string): Promise<NotificationDetailVO>;
  getUnreadCount(): Promise<Record<string, number>>;
  getTypes(): Promise<NotificationTypeVO[]>;
  markAsRead(notificationId: string): Promise<NotificationVO>;
  batchMarkAsRead(request: NotificationBatchReadRequest): Promise<void>;
  markAllAsRead(type?: string): Promise<void>;
  delete(notificationId: string): Promise<void>;
  batchDelete(request: NotificationBatchDeleteRequest): Promise<void>;
  clear(type?: string, readOnly?: boolean): Promise<void>;
  getSettings(): Promise<NotificationSettingsVO>;
  updateSettings(request: NotificationSettingsUpdateRequest): Promise<NotificationSettingsVO>;
  updateTypeSettings(type: string, request: NotificationTypeSettingsRequest): Promise<void>;
  registerDevice(request: DeviceRegisterRequest): Promise<void>;
  unregisterDevice(deviceToken: string): Promise<void>;
  listDevices(): Promise<DeviceVO[]>;
  subscribeTopic(request: TopicSubscribeRequest): Promise<void>;
  unsubscribeTopic(topic: string): Promise<void>;
  listSubscriptions(): Promise<string[]>;
  sendTest(request: TestNotificationRequest): Promise<void>;
}
