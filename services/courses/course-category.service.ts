import type { ListResponse, PaginatedListResponse } from '@/models/base';
import lmsAPI from '../config/axios';
import {
  type CourseCategory,
  type CreateCourseCategoryRequest,
  type UpdateCourseCategoryRequest,
  type CourseCategoryTreeNode,
} from '@/models/course-category';

/**
 * Course Category Services
 */
export const CourseCategoryService = {
  /**
   * Create a new course category
   * @param data Category data to create
   */
  create: async (data: CreateCourseCategoryRequest): Promise<CourseCategory> => {
    const response = await lmsAPI.post<CourseCategory>('/course-categories', data);

    return response.data;
  },

  /**
   * Get course categories with pagination
   * @param params Query parameters for filtering and pagination
   */
  find: async (params?: {
    page?: number;
    limit?: number;
    sort?: string[];
    name?: string;
    is_all?: boolean;
  }) => {
    const response = await lmsAPI.get<PaginatedListResponse<CourseCategory>>('/course-categories', {
      params,
    });
    return response.data.items;
  },

  /**
   * Update a course category
   * @param data Category data to update
   */
  update: async (data: UpdateCourseCategoryRequest) => {
    const response = await lmsAPI.put<CourseCategory>('/course-categories', data);
    return response.data;
  },

  /**
   * Delete a course category
   * @param id Category ID to delete
   */
  remove: async (id: string) => {
    await lmsAPI.delete('/course-categories', {
      data: { id },
    });
  },

  /**
   * Get a course category by ID
   * @param id Category ID
   */
  get: async (id: string) => {
    const response = await lmsAPI.get<CourseCategory>(`/course-categories/${id}`);
    return response.data;
  },

  /**
   * Get course categories in tree format
   */
  getTree: async () => {
    const response =
      await lmsAPI.get<ListResponse<CourseCategoryTreeNode>>('/course-categories/tree');
    return response.data.items;
  },

  /**
   * Get user course categories in tree format
   */
  getUserTree: async () => {
    const response = await lmsAPI.get<ListResponse<CourseCategoryTreeNode>>(
      '/user-course-categories/tree'
    );
    return response.data.items;
  },

  /**
   * Get a user course category by ID
   * @param id User course category ID
   */
  getUserCategory: async (id: string) => {
    const response = await lmsAPI.get<CourseCategory>(`/user-course-categories/${id}`);
    return response.data;
  },
};
