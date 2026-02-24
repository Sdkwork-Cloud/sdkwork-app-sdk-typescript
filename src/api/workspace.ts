import type { HttpClient } from '../http/client';
import type {
  WorkspaceModule,
  WorkspaceVO,
  ProjectVO,
  ProjectDetailVO,
  MemberVO,
  WorkspaceCreateForm,
  WorkspaceUpdateForm,
  ProjectQueryForm,
  ProjectCreateForm,
  ProjectUpdateForm,
  ProjectMoveForm,
  ProjectCopyForm,
  MemberInviteForm,
  MemberRoleUpdateForm,
} from '../types/workspace';
import type { PageResult } from '../types/common';
import { appApiPath } from './paths';

const WORKSPACES_BASE = appApiPath('/workspaces');

export class WorkspaceApi implements WorkspaceModule {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async listWorkspaces(): Promise<WorkspaceVO[]> {
    return this.http.get(WORKSPACES_BASE);
  }

  async getCurrentWorkspace(): Promise<WorkspaceVO> {
    return this.http.get(`${WORKSPACES_BASE}/current`);
  }

  async getWorkspaceDetail(workspaceId: string): Promise<WorkspaceVO> {
    return this.http.get(`${WORKSPACES_BASE}/${workspaceId}`);
  }

  async createWorkspace(data: WorkspaceCreateForm): Promise<WorkspaceVO> {
    return this.http.post(WORKSPACES_BASE, data);
  }

  async updateWorkspace(workspaceId: string, data: WorkspaceUpdateForm): Promise<WorkspaceVO> {
    return this.http.put(`${WORKSPACES_BASE}/${workspaceId}`, data);
  }

  async deleteWorkspace(workspaceId: string): Promise<void> {
    await this.http.delete(`${WORKSPACES_BASE}/${workspaceId}`);
  }

  async listProjects(workspaceId: string, query: ProjectQueryForm): Promise<PageResult<ProjectVO>> {
    return this.http.get(`${WORKSPACES_BASE}/${workspaceId}/projects`, query);
  }

  async getProjectDetail(workspaceId: string, projectId: string): Promise<ProjectDetailVO> {
    return this.http.get(`${WORKSPACES_BASE}/${workspaceId}/projects/${projectId}`);
  }

  async createProject(workspaceId: string, data: ProjectCreateForm): Promise<ProjectVO> {
    return this.http.post(`${WORKSPACES_BASE}/${workspaceId}/projects`, data);
  }

  async updateProject(workspaceId: string, projectId: string, data: ProjectUpdateForm): Promise<ProjectVO> {
    return this.http.put(`${WORKSPACES_BASE}/${workspaceId}/projects/${projectId}`, data);
  }

  async deleteProject(workspaceId: string, projectId: string): Promise<void> {
    await this.http.delete(`${WORKSPACES_BASE}/${workspaceId}/projects/${projectId}`);
  }

  async archiveProject(workspaceId: string, projectId: string): Promise<void> {
    await this.http.put(`${WORKSPACES_BASE}/${workspaceId}/projects/${projectId}/archive`);
  }

  async unarchiveProject(workspaceId: string, projectId: string): Promise<void> {
    await this.http.put(`${WORKSPACES_BASE}/${workspaceId}/projects/${projectId}/unarchive`);
  }

  async moveProject(workspaceId: string, projectId: string, data: ProjectMoveForm): Promise<void> {
    await this.http.put(`${WORKSPACES_BASE}/${workspaceId}/projects/${projectId}/move`, data);
  }

  async copyProject(workspaceId: string, projectId: string, data: ProjectCopyForm): Promise<ProjectVO> {
    return this.http.post(`${WORKSPACES_BASE}/${workspaceId}/projects/${projectId}/copy`, data);
  }

  async listWorkspaceMembers(workspaceId: string): Promise<MemberVO[]> {
    return this.http.get(`${WORKSPACES_BASE}/${workspaceId}/members`);
  }

  async inviteMember(workspaceId: string, data: MemberInviteForm): Promise<void> {
    await this.http.post(`${WORKSPACES_BASE}/${workspaceId}/members`, data);
  }

  async removeMember(workspaceId: string, userId: string): Promise<void> {
    await this.http.delete(`${WORKSPACES_BASE}/${workspaceId}/members/${userId}`);
  }

  async updateMemberRole(workspaceId: string, userId: string, data: MemberRoleUpdateForm): Promise<void> {
    await this.http.put(`${WORKSPACES_BASE}/${workspaceId}/members/${userId}/role`, data);
  }
}

export function createWorkspaceApi(http: HttpClient): WorkspaceModule {
  return new WorkspaceApi(http);
}
