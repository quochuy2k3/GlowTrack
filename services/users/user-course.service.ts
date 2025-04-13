import lmsAPI from '../config/axios';
import {
  type CreateUserCourseRequest,
  type FinishUserCourseContentRequest,
  type FinishUserCourseContent,
  type ReactionUserCourseContentRequest,
  type UserCourseContent,
  type UserCourseCurrent,
  type UserCourse,
  type UserCourseContentNode,
  UserCourseCurrentDTO,
} from '@/models/user-course';
import { type PaginationParams } from '@/models/pagination';
import type { ListResponse } from '@/models/base';

/**
 * User Course Services
 */
export const UserCourseService = {
  /**
   * Enroll in a course
   * @param data Course enrollment data
   */
  enroll: async (data: CreateUserCourseRequest) => {
    const response = await lmsAPI.post<UserCourse>('/user-courses/enroll', data);
    return response.data;
  },

  /**
   * Get current learning course
   */
  getCurrentLearnCourse: async () => {
    const response = await lmsAPI.get<UserCourseCurrent>('/user-courses/current');

    return {
      ...response.data,
      progress: Math.round((response.data.amountLearnedContent / response.data.totalContent) * 100),
    } as UserCourseCurrentDTO;
  },

  /**
   * Find user course contents by course ID
   * @param courseId Course ID
   * @param params Query parameters for pagination
   */
  findContents: async (courseId: string, params?: PaginationParams) => {
    let allItems: UserCourseContentNode[] = [];
    let currentPage = params?.page || 1;
    let totalPages = 1;

    do {
      const response = await lmsAPI.get<any>(`/user-courses/${courseId}/contents`, {
        params: { ...params, page: currentPage },
      });
      allItems = [...allItems, ...response.data.items];
      totalPages = response.data.meta.total_pages;
      currentPage++;
    } while (currentPage <= totalPages);

    return allItems;
  },

  /**
   * Get user course by ID
   * @param courseId Course ID
   */
  getCourse: async (courseId: string) => {
    const response = await lmsAPI.get<UserCourse>(`/user-courses/${courseId}`);

    return response.data;
  },

  /**
   * Get user course content
   * @param courseId Course ID
   * @param contentId Content ID
   */
  getCourseContent: async (courseId: string, contentId: string) => {
    const response = await lmsAPI.get<UserCourseContent>(`/user-courses/${courseId}/${contentId}`);

    return response.data;
  },

  /**
   * Finish a course content
   * @param courseId Course ID
   * @param contentId Content ID
   * @param data Finish data (for questions)
   */
  finishContent: async (
    courseId: string,
    contentId: string,
    data: FinishUserCourseContentRequest
  ) => {
    const response = await lmsAPI.post<FinishUserCourseContent>(
      `/user-courses/${courseId}/${contentId}/finish`,
      data
    );
    return response.data;
  },

  /**
   * React to a course content
   * @param courseId Course ID
   * @param contentId Content ID
   * @param data Reaction data
   */
  reactionContent: async (
    courseId: string,
    contentId: string,
    data: ReactionUserCourseContentRequest
  ) => {
    const response = await lmsAPI.post<FinishUserCourseContent>(
      `/user-courses/${courseId}/${contentId}/reaction`,
      data
    );
    return response.data;
  },
};
