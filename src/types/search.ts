export interface GlobalSearchVO {
  keyword: string;
  total: number;
  results: SearchResult[];
  facets?: SearchFacet[];
}

export interface SearchResult {
  id: string;
  type: string;
  title: string;
  description?: string;
  image?: string;
  url?: string;
  score?: number;
  highlights?: string[];
  createdAt?: string;
}

export interface SearchFacet {
  name: string;
  values: SearchFacetValue[];
}

export interface SearchFacetValue {
  value: string;
  count: number;
  selected?: boolean;
}

export interface SearchSuggestionVO {
  keyword: string;
  type?: string;
  count?: number;
}

export interface HotSearchVO {
  keyword: string;
  score?: number;
  trend?: string;
}

export interface SearchHistoryVO {
  id: string;
  keyword: string;
  searchedAt: string;
}

export interface ProjectSearchResult extends SearchResult {
  projectName?: string;
  owner?: string;
  status?: string;
}

export interface AssetSearchResult extends SearchResult {
  assetType?: string;
  fileSize?: number;
  format?: string;
}

export interface NoteSearchResult extends SearchResult {
  author?: string;
  category?: string;
  tags?: string[];
}

export interface UserSearchResult extends SearchResult {
  username?: string;
  avatar?: string;
  bio?: string;
  followers?: number;
}

export interface GlobalSearchRequest {
  keyword: string;
  types?: string[];
  page?: number;
  size?: number;
  sort?: string;
  filters?: Record<string, string>;
}

export interface ProjectSearchRequest {
  keyword: string;
  status?: string;
  category?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface AssetSearchRequest {
  keyword: string;
  assetType?: string;
  format?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface NoteSearchRequest {
  keyword: string;
  category?: string;
  tags?: string[];
  page?: number;
  size?: number;
  sort?: string;
}

export interface UserSearchRequest {
  keyword: string;
  page?: number;
  size?: number;
}

export interface AdvancedSearchRequest {
  keyword?: string;
  types?: string[];
  filters?: Record<string, string[]>;
  dateRange?: {
    start?: string;
    end?: string;
  };
  page?: number;
  size?: number;
  sort?: string;
}

export interface SearchFiltersVO {
  types: SearchFilterOption[];
  categories: SearchFilterOption[];
  tags: SearchFilterOption[];
  dateRanges: SearchFilterOption[];
}

export interface SearchFilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface SearchStatisticsVO {
  totalSearches: number;
  todaySearches: number;
  popularKeywords: HotSearchVO[];
  recentSearches: SearchHistoryVO[];
}

export interface SearchHistoryAddRequest {
  keyword: string;
}

export interface SearchModule {
  globalSearch(request: GlobalSearchRequest): Promise<GlobalSearchVO>;
  getSuggestions(keyword: string, limit?: number): Promise<SearchSuggestionVO[]>;
  getHotSearches(limit?: number): Promise<HotSearchVO[]>;
  getSearchHistory(limit?: number): Promise<SearchHistoryVO[]>;
  addSearchHistory(request: SearchHistoryAddRequest): Promise<void>;
  deleteSearchHistory(keyword: string): Promise<void>;
  clearSearchHistory(): Promise<void>;
  searchProjects(request: ProjectSearchRequest): Promise<ProjectSearchResult[]>;
  searchAssets(request: AssetSearchRequest): Promise<AssetSearchResult[]>;
  searchNotes(request: NoteSearchRequest): Promise<NoteSearchResult[]>;
  searchUsers(request: UserSearchRequest): Promise<UserSearchResult[]>;
  advancedSearch(request: AdvancedSearchRequest): Promise<SearchResult[]>;
  getFilters(type?: string): Promise<SearchFiltersVO>;
  getStatistics(): Promise<SearchStatisticsVO>;
}
