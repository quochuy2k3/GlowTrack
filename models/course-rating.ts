import { type User } from './base';

export interface CreateCourseRatingRequest {
  star: number;
  content: string;
  course: string;
}

export interface UpdateCourseRatingRequest {
  id: string;
  star?: number;
  content?: string;
}

export interface DeleteCourseRatingRequest {
  id: string;
}

export interface CourseRating {
  id: string;
  star: number;
  content: string;
  user: string;
  userObj: User;
  course: string;
  createdAt: string;
}
