import type { HttpClient } from '../http/client';
import type {
  PromptModule,
  PromptVO,
  PromptHistoryVO,
  PromptQueryForm,
  PromptCreateForm,
  PromptUpdateForm,
  PromptHistoryQueryForm,
} from '../types/prompt';
import type { PageResult } from '../types/common';
import { appApiPath } from './paths';

const PROMPT_BASE = appApiPath('/prompt');

export class PromptApi implements PromptModule {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async listPrompts(query: PromptQueryForm): Promise<PageResult<PromptVO>> {
    return this.http.get(`${PROMPT_BASE}/list`, query);
  }

  async getPromptDetail(id: number): Promise<PromptVO> {
    return this.http.get(`${PROMPT_BASE}/${id}`);
  }

  async createPrompt(data: PromptCreateForm): Promise<PromptVO> {
    return this.http.post(PROMPT_BASE, data);
  }

  async updatePrompt(id: number, data: PromptUpdateForm): Promise<PromptVO> {
    return this.http.put(`${PROMPT_BASE}/${id}`, data);
  }

  async deletePrompt(id: number): Promise<void> {
    await this.http.delete(`${PROMPT_BASE}/${id}`);
  }

  async usePrompt(id: number): Promise<void> {
    await this.http.post(`${PROMPT_BASE}/${id}/use`);
  }

  async favoritePrompt(id: number): Promise<void> {
    await this.http.post(`${PROMPT_BASE}/${id}/favorite`);
  }

  async unfavoritePrompt(id: number): Promise<void> {
    await this.http.delete(`${PROMPT_BASE}/${id}/favorite`);
  }

  async getPopularPrompts(page: number = 0, size: number = 20): Promise<PageResult<PromptVO>> {
    return this.http.get(`${PROMPT_BASE}/popular`, { page, size });
  }

  async getMostFavoritedPrompts(page: number = 0, size: number = 20): Promise<PageResult<PromptVO>> {
    return this.http.get(`${PROMPT_BASE}/most-favorited`, { page, size });
  }

  async listPromptHistory(query: PromptHistoryQueryForm): Promise<PageResult<PromptHistoryVO>> {
    return this.http.get(`${PROMPT_BASE}/history/list`, query);
  }

  async getPromptHistoryDetail(id: number): Promise<PromptHistoryVO> {
    return this.http.get(`${PROMPT_BASE}/history/${id}`);
  }

  async deletePromptHistory(id: number): Promise<void> {
    await this.http.delete(`${PROMPT_BASE}/history/${id}`);
  }
}

export function createPromptApi(http: HttpClient): PromptModule {
  return new PromptApi(http);
}
