export interface ChatSession {
  id: string;
  name?: string;
  modelId?: string;
  systemPrompt?: string;
  createdAt?: string;
  updatedAt?: string;
  messageCount?: number;
}

export interface ChatSessionDetail extends ChatSession {
  messages?: ChatMessage[];
  settings?: ChatSessionSettings;
}

export interface ChatSessionSettings {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface ChatSessionCreateRequest {
  modelId?: string;
  systemPrompt?: string;
  name?: string;
}

export interface ChatSessionUpdateRequest {
  name?: string;
  systemPrompt?: string;
}

export interface ChatSessionQuery {
  page?: number;
  size?: number;
  sort?: string;
  status?: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: string;
  tokenCount?: number;
  favorite?: boolean;
}

export interface ChatMessageSendRequest {
  content: string;
  stream?: boolean;
}

export interface ChatMessageQuery {
  page?: number;
  size?: number;
  sort?: string;
  before?: string;
  after?: string;
}

export interface ChatExportRequest {
  format: 'markdown' | 'pdf' | 'word' | 'json';
  includeSystemPrompt?: boolean;
  includeTimestamps?: boolean;
}

export interface ChatExportVO {
  url: string;
  filename: string;
  expiresAt?: string;
}

export interface ChatModule {
  createSession(request: ChatSessionCreateRequest): Promise<ChatSession>;
  listSessions(query: ChatSessionQuery): Promise<ChatSession[]>;
  getSession(sessionId: string): Promise<ChatSessionDetail>;
  updateSession(sessionId: string, request: ChatSessionUpdateRequest): Promise<void>;
  deleteSession(sessionId: string): Promise<void>;
  sendMessage(sessionId: string, request: ChatMessageSendRequest): Promise<ChatMessage>;
  getMessageHistory(sessionId: string, query: ChatMessageQuery): Promise<ChatMessage[]>;
  sendMessageStream(sessionId: string, request: ChatMessageSendRequest, onMessage: (chunk: string) => void): Promise<void>;
  regenerateMessage(sessionId: string, messageId: string): Promise<ChatMessage>;
  stopGeneration(sessionId: string): Promise<void>;
  favoriteMessage(sessionId: string, messageId: string): Promise<void>;
  unfavoriteMessage(sessionId: string, messageId: string): Promise<void>;
  exportConversation(sessionId: string, request: ChatExportRequest): Promise<ChatExportVO>;
  copySession(sessionId: string): Promise<ChatSession>;
}
