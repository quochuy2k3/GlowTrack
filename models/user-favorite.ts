import { type PaginatedListResponse, type User as User } from './base';
import { type CourseNode as CourseNode } from './course';

export interface CreateUserFavoriteRequest {
  course: string;
}

export interface DeleteUserFavoriteRequest {
  course: string;
}

export interface UserFavorite {
  id: string;
  user: string;
  course: string;
}

export interface UserFavorite {
  id: string;
  user: string;
  userObj: User;
  course: string;
  courseObj: CourseNode;
}
