import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';
import type {
  GlobalSearchVO,
  SearchResult,
  SearchSuggestionVO,
  HotSearchVO,
  SearchHistoryVO,
  ProjectSearchResult,
  AssetSearchResult,
  NoteSearchResult,
  UserSearchResult,
  GlobalSearchRequest,
  ProjectSearchRequest,
  AssetSearchRequest,
  NoteSearchRequest,
  UserSearchRequest,
  AdvancedSearchRequest,
  SearchFiltersVO,
  SearchStatisticsVO,
  SearchHistoryAddRequest,
  SearchModule,
} from '../types/search';
import type { PageResult } from '../types/common';

export class SearchApi implements SearchModule {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  async globalSearch(request: GlobalSearchRequest): Promise<GlobalSearchVO> {
    const params: Record<string, string | number | boolean | undefined> = {
      keyword: request.keyword,
      page: request.page,
      size: request.size,
      sort: request.sort,
    };
    return this.client.get<GlobalSearchVO>(appApiPath('/search'), params);
  }

  async getSuggestions(keyword: string, limit: number = 10): Promise<SearchSuggestionVO[]> {
    return this.client.get<SearchSuggestionVO[]>(appApiPath('/search/suggestions'), { keyword, limit });
  }

  async getHotSearches(limit: number = 10): Promise<HotSearchVO[]> {
    return this.client.get<HotSearchVO[]>(appApiPath('/search/hot'), { limit });
  }

  async getSearchHistory(limit: number = 20): Promise<SearchHistoryVO[]> {
    return this.client.get<SearchHistoryVO[]>(appApiPath('/search/history'), { limit });
  }

  async addSearchHistory(request: SearchHistoryAddRequest): Promise<void> {
    await this.client.post(appApiPath('/search/history'), request);
  }

  async deleteSearchHistory(keyword: string): Promise<void> {
    await this.client.delete(appApiPath(`/search/history/${encodeURIComponent(keyword)}`));
  }

  async clearSearchHistory(): Promise<void> {
    await this.client.delete(appApiPath('/search/history'));
  }

  async searchProjects(request: ProjectSearchRequest): Promise<ProjectSearchResult[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      keyword: request.keyword,
      status: request.status,
      category: request.category,
      page: request.page,
      size: request.size,
      sort: request.sort,
    };
    const result = await this.client.get<PageResult<ProjectSearchResult>>(appApiPath('/search/projects'), params);
    return result.content;
  }

  async searchAssets(request: AssetSearchRequest): Promise<AssetSearchResult[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      keyword: request.keyword,
      assetType: request.assetType,
      format: request.format,
      page: request.page,
      size: request.size,
      sort: request.sort,
    };
    const result = await this.client.get<PageResult<AssetSearchResult>>(appApiPath('/search/assets'), params);
    return result.content;
  }

  async searchNotes(request: NoteSearchRequest): Promise<NoteSearchResult[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      keyword: request.keyword,
      category: request.category,
      page: request.page,
      size: request.size,
      sort: request.sort,
    };
    const result = await this.client.get<PageResult<NoteSearchResult>>(appApiPath('/search/notes'), params);
    return result.content;
  }

  async searchUsers(request: UserSearchRequest): Promise<UserSearchResult[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      keyword: request.keyword,
      page: request.page,
      size: request.size,
    };
    const result = await this.client.get<PageResult<UserSearchResult>>(appApiPath('/search/users'), params);
    return result.content;
  }

  async advancedSearch(request: AdvancedSearchRequest): Promise<SearchResult[]> {
    const result = await this.client.post<PageResult<SearchResult>>(appApiPath('/search/advanced'), request);
    return result.content;
  }

  async getFilters(type: string = 'all'): Promise<SearchFiltersVO> {
    return this.client.get<SearchFiltersVO>(appApiPath('/search/filters'), { type });
  }

  async getStatistics(): Promise<SearchStatisticsVO> {
    return this.client.get<SearchStatisticsVO>(appApiPath('/search/statistics'));
  }
}

export function createSearchApi(client: HttpClient): SearchModule {
  return new SearchApi(client);
}
