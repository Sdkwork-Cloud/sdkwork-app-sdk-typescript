import type { BasePlusVO, PageResult } from './common';

export type PromptType = 'SYSTEM' | 'USER' | 'ASSISTANT' | 'FUNCTION' | 'CHAT' | 'COMPLETION';
export type PromptBizType = 'CHAT' | 'IMAGE' | 'AUDIO' | 'VIDEO' | 'CODE' | 'TRANSLATION' | 'SUMMARY' | 'OTHER';

export interface PromptVO extends BasePlusVO {
  id: number;
  title: string;
  content: string;
  type?: PromptType;
  bizType?: PromptBizType;
  description?: string;
  cateId?: number;
  enabled?: boolean;
  sort?: number;
  parameters?: Record<string, unknown>;
  creator?: string;
  model?: string;
  tags?: TagsContent;
  usageCount?: number;
  avgResponseTime?: number;
  version?: string;
  isPublic?: boolean;
  isFavorite?: boolean;
  favoriteCount?: number;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TagsContent {
  tags?: string[];
  category?: string;
}

export interface PromptHistoryVO extends BasePlusVO {
  id: number;
  promptId: number;
  promptTitle?: string;
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  responseTime?: number;
  success?: boolean;
  errorMessage?: string;
  createdAt: string;
}

export interface PromptQueryForm {
  keyword?: string;
  type?: PromptType;
  bizType?: PromptBizType;
  enabled?: boolean;
  model?: string;
  page?: number;
  size?: number;
}

export interface PromptCreateForm {
  title: string;
  content: string;
  type?: PromptType;
  bizType?: PromptBizType;
  description?: string;
  cateId?: number;
  model?: string;
  parameters?: Record<string, unknown>;
  tags?: TagsContent;
  isPublic?: boolean;
  enabled?: boolean;
}

export interface PromptUpdateForm {
  title?: string;
  content?: string;
  description?: string;
  model?: string;
  parameters?: Record<string, unknown>;
  tags?: TagsContent;
  isPublic?: boolean;
  enabled?: boolean;
}

export interface PromptHistoryQueryForm {
  promptId?: number;
  model?: string;
  success?: boolean;
  keyword?: string;
  page?: number;
  size?: number;
}

export interface PromptModule {
  listPrompts(query: PromptQueryForm): Promise<PageResult<PromptVO>>;
  getPromptDetail(id: number): Promise<PromptVO>;
  createPrompt(data: PromptCreateForm): Promise<PromptVO>;
  updatePrompt(id: number, data: PromptUpdateForm): Promise<PromptVO>;
  deletePrompt(id: number): Promise<void>;
  usePrompt(id: number): Promise<void>;
  favoritePrompt(id: number): Promise<void>;
  unfavoritePrompt(id: number): Promise<void>;
  getPopularPrompts(page?: number, size?: number): Promise<PageResult<PromptVO>>;
  getMostFavoritedPrompts(page?: number, size?: number): Promise<PageResult<PromptVO>>;

  listPromptHistory(query: PromptHistoryQueryForm): Promise<PageResult<PromptHistoryVO>>;
  getPromptHistoryDetail(id: number): Promise<PromptHistoryVO>;
  deletePromptHistory(id: number): Promise<void>;
}
