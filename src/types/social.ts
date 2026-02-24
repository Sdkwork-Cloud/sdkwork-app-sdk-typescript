import type { BasePlusVO, PageResult } from './common';

export interface FollowVO extends BasePlusVO {
  followId: string;
  followerId: string;
  followingId: string;
  followedAt: string;
  isMutual: boolean;
}

export interface FollowUserVO extends BasePlusVO {
  userId: string;
  userName: string;
  userAvatar?: string;
  userBio?: string;
  followedAt: string;
  isFollowing: boolean;
  isFollower: boolean;
  isMutual: boolean;
}

export interface FollowStatsVO extends BasePlusVO {
  followingCount: number;
  followerCount: number;
  mutualCount: number;
}

export interface FollowCheckVO extends BasePlusVO {
  userId: string;
  isFollowing: boolean;
  isFollower: boolean;
  isMutual: boolean;
}

export interface BatchFollowCheckForm {
  userIds: string[];
}

export interface PrivateMessageVO extends BasePlusVO {
  messageId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId: string;
  content: string;
  messageType?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface ConversationVO extends BasePlusVO {
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isOnline?: boolean;
}

export interface MessageUnreadCountVO extends BasePlusVO {
  totalUnread: number;
  conversationUnread: number;
  notificationUnread: number;
}

export interface BlockedUserVO extends BasePlusVO {
  userId: string;
  userName: string;
  userAvatar?: string;
  blockedAt: string;
}

export interface BlockCheckVO extends BasePlusVO {
  userId: string;
  isBlocked: boolean;
  blockedAt?: string;
}

export interface FollowQueryForm {
  page?: number;
  size?: number;
}

export interface SendMessageForm {
  recipientId: string;
  content: string;
  messageType?: string;
  replyTo?: string;
}

export interface ConversationQueryForm {
  page?: number;
  size?: number;
}

export interface MessageQueryForm {
  before?: string;
  after?: string;
  page?: number;
  size?: number;
}

export interface BlockedUserQueryForm {
  page?: number;
  size?: number;
}

export interface SocialModule {
  followUser(userId: string): Promise<FollowVO>;
  unfollowUser(userId: string): Promise<void>;
  getFollowingList(query: FollowQueryForm): Promise<PageResult<FollowUserVO>>;
  getFollowerList(query: FollowQueryForm): Promise<PageResult<FollowUserVO>>;
  getFollowStats(): Promise<FollowStatsVO>;
  checkFollowStatus(userId: string): Promise<FollowCheckVO>;
  batchCheckFollowStatus(data: BatchFollowCheckForm): Promise<FollowCheckVO[]>;

  sendMessage(data: SendMessageForm): Promise<PrivateMessageVO>;
  getConversations(query: ConversationQueryForm): Promise<PageResult<ConversationVO>>;
  getConversationMessages(userId: string, query: MessageQueryForm): Promise<PageResult<PrivateMessageVO>>;
  markMessagesAsRead(userId: string): Promise<void>;
  deleteConversation(userId: string): Promise<void>;
  getUnreadMessageCount(): Promise<MessageUnreadCountVO>;

  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
  getBlockedUsers(query: BlockedUserQueryForm): Promise<PageResult<BlockedUserVO>>;
  checkBlockStatus(userId: string): Promise<BlockCheckVO>;
}
