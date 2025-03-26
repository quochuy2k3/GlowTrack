import type { PaginatedListResponse } from '@/models/base';
import lmsAPI from '../config/axios';
import {
  type CourseRating,
  type CreateCourseRatingRequest,
  type UpdateCourseRatingRequest,
} from '@/models/course-rating';

/**
 * Course Rating Services
 */
export const CourseRatingService = {
  /**
   * Create a new course rating
   * @param data Rating data to create
   */
  create: async (data: CreateCourseRatingRequest): Promise<CourseRating> => {
    const response = await lmsAPI.post<CourseRating>('/course-ratings', data);
    return response.data;
  },

  /**
   * Get course ratings with pagination
   * @param params Query parameters for filtering and pagination
   */
  find: async (params?: {
    page?: number;
    limit?: number;
    sort?: string[];
    course?: string;
    user?: string;
  }) => {
    const response = await lmsAPI.get<PaginatedListResponse<CourseRating>>('/course-ratings', {
      params,
    });
    return response.data.items;
  },

  /**
   * Update a course rating
   * @param data Rating data to update
   */
  update: async (data: UpdateCourseRatingRequest): Promise<CourseRating> => {
    const response = await lmsAPI.put<CourseRating>('/course-ratings', data);
    return response.data;
  },

  /**
   * Delete a course rating
   * @param id Rating ID to delete
   */
  remove: async (id: string): Promise<void> => {
    await lmsAPI.delete('/course-ratings', { data: { id } });
  },

  /**
   * Get a course rating by ID
   * @param id Rating ID
   */
  get: async (id: string): Promise<CourseRating> => {
    const response = await lmsAPI.get<CourseRating>(`/course-ratings/${id}`);
    return response.data;
  },
};
