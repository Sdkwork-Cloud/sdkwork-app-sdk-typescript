import type { BasePlusVO, PageResult } from './common';

export interface WorkspaceVO extends BasePlusVO {
  workspaceId: string;
  workspaceName: string;
  workspaceDescription?: string;
  workspaceIcon?: string;
  workspaceColor?: string;
  workspaceType?: string;
  creatorId?: string;
  creatorName?: string;
  createTime: string;
  updateTime?: string;
  memberCount?: number;
  projectCount?: number;
  status?: string;
  isPublic?: boolean;
  userRole?: string;
  userPermissions?: string[];
  settings?: WorkspaceSettings;
}

export interface WorkspaceSettings {
  allowInvite?: boolean;
  allowCreateProject?: boolean;
  allowFileUpload?: boolean;
}

export interface WorkspaceCreateForm {
  workspaceName: string;
  workspaceDescription?: string;
  workspaceIcon?: string;
  workspaceColor?: string;
  workspaceType?: string;
  isPublic?: boolean;
  settings?: WorkspaceSettings;
}

export interface WorkspaceUpdateForm {
  workspaceName?: string;
  workspaceDescription?: string;
  workspaceIcon?: string;
  workspaceColor?: string;
  workspaceType?: string;
  isPublic?: boolean;
  settings?: WorkspaceSettings;
}

export interface ProjectVO extends BasePlusVO {
  projectId: string;
  projectName: string;
  projectTitle?: string;
  projectDescription?: string;
  projectType?: string;
  projectCode?: string;
  workspaceId?: string;
  workspaceName?: string;
  tags?: string[];
  status?: string;
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

export interface ProjectQueryForm {
  keyword?: string;
  status?: string;
  type?: string;
  page?: number;
  size?: number;
}

export interface ProjectCreateForm {
  projectName: string;
  projectTitle?: string;
  projectDescription?: string;
  projectType?: string;
  workspaceId?: string;
  isPublic?: boolean;
}

export interface ProjectUpdateForm {
  projectName?: string;
  projectTitle?: string;
  projectDescription?: string;
  projectType?: string;
}

export interface ProjectMoveForm {
  targetWorkspaceId: string;
}

export interface ProjectCopyForm {
  targetWorkspaceId?: string;
  newName?: string;
}

export interface MemberVO extends BasePlusVO {
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  role: string;
  roleName?: string;
  joinedAt: string;
  lastActiveAt?: string;
  permissions?: string[];
}

export interface MemberInviteForm {
  emails: string[];
  role?: string;
  message?: string;
}

export interface MemberRoleUpdateForm {
  newRoleName: string;
}

export interface WorkspaceModule {
  listWorkspaces(): Promise<WorkspaceVO[]>;
  getCurrentWorkspace(): Promise<WorkspaceVO>;
  getWorkspaceDetail(workspaceId: string): Promise<WorkspaceVO>;
  createWorkspace(data: WorkspaceCreateForm): Promise<WorkspaceVO>;
  updateWorkspace(workspaceId: string, data: WorkspaceUpdateForm): Promise<WorkspaceVO>;
  deleteWorkspace(workspaceId: string): Promise<void>;

  listProjects(workspaceId: string, query: ProjectQueryForm): Promise<PageResult<ProjectVO>>;
  getProjectDetail(workspaceId: string, projectId: string): Promise<ProjectDetailVO>;
  createProject(workspaceId: string, data: ProjectCreateForm): Promise<ProjectVO>;
  updateProject(workspaceId: string, projectId: string, data: ProjectUpdateForm): Promise<ProjectVO>;
  deleteProject(workspaceId: string, projectId: string): Promise<void>;
  archiveProject(workspaceId: string, projectId: string): Promise<void>;
  unarchiveProject(workspaceId: string, projectId: string): Promise<void>;
  moveProject(workspaceId: string, projectId: string, data: ProjectMoveForm): Promise<void>;
  copyProject(workspaceId: string, projectId: string, data: ProjectCopyForm): Promise<ProjectVO>;

  listWorkspaceMembers(workspaceId: string): Promise<MemberVO[]>;
  inviteMember(workspaceId: string, data: MemberInviteForm): Promise<void>;
  removeMember(workspaceId: string, userId: string): Promise<void>;
  updateMemberRole(workspaceId: string, userId: string, data: MemberRoleUpdateForm): Promise<void>;
}
