import { type PaginatedListResponse, type User, type UserRoleType } from './base';

export interface CreateUserRoleRequest {
  user: string[];
  role: UserRoleType;
}

export interface UpdateUserRoleRequest {
  id: string;
  user?: string;
  role?: UserRoleType;
}

export interface DeleteUserRoleRequest {
  id: string;
  user?: string;
}

export interface UserRole {
  id: string;
  user: string;
  userObj: User;
  role: UserRoleType;
}

export interface CreateUserAccessRequest {
  users: string[];
  type: 'course' | 'examination';
  accessObject: string;
}

export interface DeleteUserAccessRequest {
  user: string;
  type: 'course' | 'examination';
  accessObject: string;
}
