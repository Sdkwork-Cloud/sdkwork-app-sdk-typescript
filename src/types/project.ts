import type { BasePlusVO, PageResult } from './common';

export type ProjectType = 'CHAT' | 'IMAGE' | 'AUDIO' | 'VIDEO' | 'CODE' | 'DOCUMENT' | 'OTHER';
export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';

export interface ProjectVO extends BasePlusVO {
  projectId: string;
  projectName: string;
  projectTitle?: string;
  projectDescription?: string;
  projectType?: ProjectType;
  projectCode?: string;
  workspaceId?: string;
  workspaceName?: string;
  tags?: string[];
  status?: ProjectStatus;
  favorited?: boolean;
  isPublic?: boolean;
  createdAt: string;
  updatedAt?: string;
  creatorId?: string;
  creatorName?: string;
}

export interface ProjectDetailVO extends ProjectVO {
  projectTypeName?: string;
  author?: string;
  sitePath?: string;
  domainPrefix?: string;
  statusName?: string;
  isTemplate?: boolean;
  startTime?: string;
  endTime?: string;
}

export interface ProjectStatisticsVO {
  projectId: string;
  totalFiles: number;
  totalMembers: number;
  totalConversations: number;
  totalAssets?: number;
  totalDuration?: number;
}

export interface ProjectListQueryRequest {
  keyword?: string;
  status?: ProjectStatus;
  type?: ProjectType;
  page?: number;
  size?: number;
}

export interface ProjectSearchRequest {
  keyword: string;
  status?: ProjectStatus;
  type?: ProjectType;
  page?: number;
  size?: number;
}

export interface ProjectCreateRequest {
  name: string;
  description?: string;
  type?: ProjectType;
  workspaceId?: string;
}

export interface ProjectUpdateRequest {
  name?: string;
  description?: string;
}

export interface ProjectMoveRequest {
  targetWorkspaceId: string;
}

export interface ProjectCopyRequest {
  targetWorkspaceId?: string;
  newName?: string;
}

export interface ProjectModule {
  listProjects(query: ProjectListQueryRequest): Promise<PageResult<ProjectVO>>;
  getProjectDetail(projectId: string): Promise<ProjectDetailVO>;
  createProject(data: ProjectCreateRequest): Promise<ProjectVO>;
  updateProject(projectId: string, data: ProjectUpdateRequest): Promise<ProjectVO>;
  deleteProject(projectId: string): Promise<void>;
  archiveProject(projectId: string): Promise<void>;
  unarchiveProject(projectId: string): Promise<void>;
  moveProject(projectId: string, data: ProjectMoveRequest): Promise<void>;
  copyProject(projectId: string, data: ProjectCopyRequest): Promise<ProjectVO>;
  listRecentProjects(limit?: number): Promise<ProjectVO[]>;
  searchProjects(query: ProjectSearchRequest): Promise<PageResult<ProjectVO>>;
  getProjectStatistics(projectId: string): Promise<ProjectStatisticsVO>;
}
