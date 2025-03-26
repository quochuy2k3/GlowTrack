import { type CourseStatus, type CourseType, type Skill } from './base';

export interface UserPlanModuleData {
  id: string;
  title: string;
  coverImage: string;
  coverImageUrl: string;
  type: CourseType;
  status: CourseStatus;
}

export interface UserPlanModule {
  id: string;
  name: string;
  description: string;
  skill: string;
  skillObj: Skill;
  dataObj: UserPlanModuleData[];
}

export interface UserPlan {
  modules: UserPlanModule[];
  createdAt: string;
}

export interface CreateUserPlanModuleRequest {
  name: string;
  skill?: string;
}

export interface CreateUserPlanModuleCoursesRequest {
  module: string;
  courses: string;
}

export interface DeleteUserPlanModuleRequest {
  module: string;
}

export interface DeleteUserPlanModuleCoursesRequest {
  module: string;
  courses: string;
}
