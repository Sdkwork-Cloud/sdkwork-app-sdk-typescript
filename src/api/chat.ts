import type { HttpClient } from '../http/client';
import type {
  ChatSession,
  ChatSessionDetail,
  ChatSessionCreateRequest,
  ChatSessionUpdateRequest,
  ChatSessionQuery,
  ChatMessage,
  ChatMessageSendRequest,
  ChatMessageQuery,
  ChatExportRequest,
  ChatExportVO,
  ChatModule,
} from '../types/chat';
import type { PageResult } from '../types/common';
import { appApiPath } from './paths';

const CHAT_BASE = appApiPath('/chat');

export class ChatApi implements ChatModule {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  async createSession(request: ChatSessionCreateRequest): Promise<ChatSession> {
    return this.client.post<ChatSession>(`${CHAT_BASE}/sessions`, request);
  }

  async listSessions(query: ChatSessionQuery): Promise<ChatSession[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      page: query.page,
      size: query.size,
      sort: query.sort,
    };
    const result = await this.client.get<PageResult<ChatSession>>(`${CHAT_BASE}/sessions`, params);
    return result.content;
  }

  async getSession(sessionId: string): Promise<ChatSessionDetail> {
    return this.client.get<ChatSessionDetail>(`${CHAT_BASE}/sessions/${sessionId}`);
  }

  async updateSession(sessionId: string, request: ChatSessionUpdateRequest): Promise<void> {
    await this.client.put(`${CHAT_BASE}/sessions/${sessionId}`, request);
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.client.delete(`${CHAT_BASE}/sessions/${sessionId}`);
  }

  async sendMessage(sessionId: string, request: ChatMessageSendRequest): Promise<ChatMessage> {
    return this.client.post<ChatMessage>(`${CHAT_BASE}/sessions/${sessionId}/messages`, request);
  }

  async getMessageHistory(sessionId: string, query: ChatMessageQuery): Promise<ChatMessage[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      page: query.page,
      size: query.size,
      sort: query.sort,
    };
    const result = await this.client.get<PageResult<ChatMessage>>(`${CHAT_BASE}/sessions/${sessionId}/messages`, params);
    return result.content;
  }

  async sendMessageStream(
    sessionId: string,
    request: ChatMessageSendRequest,
    onMessage: (chunk: string) => void
  ): Promise<void> {
    const response = await this.client.requestRaw(`${CHAT_BASE}/sessions/${sessionId}/messages/stream`, {
      method: 'POST',
      body: request,
      headers: {
        'Accept': 'text/event-stream',
      },
    });

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const rawLine of lines) {
        const line = rawLine.replace(/\r$/, '');
        if (!line.startsWith('data:')) {
          continue;
        }

        const data = line.slice(5).trimStart();
        if (data === '[DONE]') {
          return;
        }
        onMessage(data);
      }
    }

    const finalLine = buffer.replace(/\r$/, '');
    if (finalLine.startsWith('data:')) {
      const data = finalLine.slice(5).trimStart();
      if (data !== '[DONE]') {
        onMessage(data);
      }
    }
  }

  async regenerateMessage(sessionId: string, messageId: string): Promise<ChatMessage> {
    return this.client.post<ChatMessage>(`${CHAT_BASE}/sessions/${sessionId}/messages/${messageId}/regenerate`);
  }

  async stopGeneration(sessionId: string): Promise<void> {
    await this.client.post(`${CHAT_BASE}/sessions/${sessionId}/stop`);
  }

  async favoriteMessage(sessionId: string, messageId: string): Promise<void> {
    await this.client.post(`${CHAT_BASE}/sessions/${sessionId}/messages/${messageId}/favorite`);
  }

  async unfavoriteMessage(sessionId: string, messageId: string): Promise<void> {
    await this.client.delete(`${CHAT_BASE}/sessions/${sessionId}/messages/${messageId}/favorite`);
  }

  async exportConversation(sessionId: string, request: ChatExportRequest): Promise<ChatExportVO> {
    return this.client.post<ChatExportVO>(`${CHAT_BASE}/sessions/${sessionId}/export`, request);
  }

  async copySession(sessionId: string): Promise<ChatSession> {
    return this.client.post<ChatSession>(`${CHAT_BASE}/sessions/${sessionId}/copy`);
  }
}

export function createChatApi(client: HttpClient): ChatModule {
  return new ChatApi(client);
}
