import type { HttpClient } from '../http/client';
import type {
  ProjectModule,
  ProjectVO,
  ProjectDetailVO,
  ProjectStatisticsVO,
  ProjectListQueryRequest,
  ProjectSearchRequest,
  ProjectCreateRequest,
  ProjectUpdateRequest,
  ProjectMoveRequest,
  ProjectCopyRequest,
} from '../types/project';
import type { PageResult } from '../types/common';
import { appApiPath } from './paths';

const PROJECTS_BASE = appApiPath('/projects');

export class ProjectApi implements ProjectModule {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async listProjects(query: ProjectListQueryRequest): Promise<PageResult<ProjectVO>> {
    return this.http.get(PROJECTS_BASE, query);
  }

  async getProjectDetail(projectId: string): Promise<ProjectDetailVO> {
    return this.http.get(`${PROJECTS_BASE}/${projectId}`);
  }

  async createProject(data: ProjectCreateRequest): Promise<ProjectVO> {
    return this.http.post(PROJECTS_BASE, data);
  }

  async updateProject(projectId: string, data: ProjectUpdateRequest): Promise<ProjectVO> {
    return this.http.put(`${PROJECTS_BASE}/${projectId}`, data);
  }

  async deleteProject(projectId: string): Promise<void> {
    await this.http.delete(`${PROJECTS_BASE}/${projectId}`);
  }

  async archiveProject(projectId: string): Promise<void> {
    await this.http.put(`${PROJECTS_BASE}/${projectId}/archive`);
  }

  async unarchiveProject(projectId: string): Promise<void> {
    await this.http.put(`${PROJECTS_BASE}/${projectId}/unarchive`);
  }

  async moveProject(projectId: string, data: ProjectMoveRequest): Promise<void> {
    await this.http.put(`${PROJECTS_BASE}/${projectId}/move`, data);
  }

  async copyProject(projectId: string, data: ProjectCopyRequest): Promise<ProjectVO> {
    return this.http.post(`${PROJECTS_BASE}/${projectId}/copy`, data);
  }

  async listRecentProjects(limit: number = 10): Promise<ProjectVO[]> {
    return this.http.get(`${PROJECTS_BASE}/recent`, { limit });
  }

  async searchProjects(query: ProjectSearchRequest): Promise<PageResult<ProjectVO>> {
    return this.http.get(`${PROJECTS_BASE}/search`, query);
  }

  async getProjectStatistics(projectId: string): Promise<ProjectStatisticsVO> {
    return this.http.get(`${PROJECTS_BASE}/${projectId}/statistics`);
  }
}

export function createProjectApi(http: HttpClient): ProjectModule {
  return new ProjectApi(http);
}
