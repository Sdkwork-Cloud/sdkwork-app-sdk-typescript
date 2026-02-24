import type { HttpClient } from '../http/client';
import type {
  SocialModule,
  FollowVO,
  FollowUserVO,
  FollowStatsVO,
  FollowCheckVO,
  BatchFollowCheckForm,
  PrivateMessageVO,
  ConversationVO,
  MessageUnreadCountVO,
  BlockedUserVO,
  BlockCheckVO,
  FollowQueryForm,
  SendMessageForm,
  ConversationQueryForm,
  MessageQueryForm,
  BlockedUserQueryForm,
} from '../types/social';
import type { PageResult } from '../types/common';
import { appApiPath } from './paths';

const SOCIAL_BASE = appApiPath('/social');

export class SocialApi implements SocialModule {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async followUser(userId: string): Promise<FollowVO> {
    return this.http.post(`${SOCIAL_BASE}/follow/${userId}`);
  }

  async unfollowUser(userId: string): Promise<void> {
    await this.http.delete(`${SOCIAL_BASE}/follow/${userId}`);
  }

  async getFollowingList(query: FollowQueryForm): Promise<PageResult<FollowUserVO>> {
    return this.http.get(`${SOCIAL_BASE}/following`, query);
  }

  async getFollowerList(query: FollowQueryForm): Promise<PageResult<FollowUserVO>> {
    return this.http.get(`${SOCIAL_BASE}/followers`, query);
  }

  async getFollowStats(): Promise<FollowStatsVO> {
    return this.http.get(`${SOCIAL_BASE}/stats`);
  }

  async checkFollowStatus(userId: string): Promise<FollowCheckVO> {
    return this.http.get(`${SOCIAL_BASE}/follow/check`, { userId });
  }

  async batchCheckFollowStatus(data: BatchFollowCheckForm): Promise<FollowCheckVO[]> {
    return this.http.post(`${SOCIAL_BASE}/follow/check/batch`, data);
  }

  async sendMessage(data: SendMessageForm): Promise<PrivateMessageVO> {
    return this.http.post(`${SOCIAL_BASE}/messages`, data);
  }

  async getConversations(query: ConversationQueryForm): Promise<PageResult<ConversationVO>> {
    return this.http.get(`${SOCIAL_BASE}/conversations`, query);
  }

  async getConversationMessages(userId: string, query: MessageQueryForm): Promise<PageResult<PrivateMessageVO>> {
    return this.http.get(`${SOCIAL_BASE}/conversations/${userId}/messages`, query);
  }

  async markMessagesAsRead(userId: string): Promise<void> {
    await this.http.put(`${SOCIAL_BASE}/messages/read`, undefined, { userId });
  }

  async deleteConversation(userId: string): Promise<void> {
    await this.http.delete(`${SOCIAL_BASE}/conversations/${userId}`);
  }

  async getUnreadMessageCount(): Promise<MessageUnreadCountVO> {
    return this.http.get(`${SOCIAL_BASE}/messages/unread/count`);
  }

  async blockUser(userId: string): Promise<void> {
    await this.http.post(`${SOCIAL_BASE}/block/${userId}`);
  }

  async unblockUser(userId: string): Promise<void> {
    await this.http.delete(`${SOCIAL_BASE}/block/${userId}`);
  }

  async getBlockedUsers(query: BlockedUserQueryForm): Promise<PageResult<BlockedUserVO>> {
    return this.http.get(`${SOCIAL_BASE}/blocks`, query);
  }

  async checkBlockStatus(userId: string): Promise<BlockCheckVO> {
    return this.http.get(`${SOCIAL_BASE}/block/check`, { userId });
  }
}

export function createSocialApi(http: HttpClient): SocialModule {
  return new SocialApi(http);
}
