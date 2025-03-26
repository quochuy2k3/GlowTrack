import type { PaginatedListResponse } from '@/models/base';
import lmsAPI from '../config/axios';
import {
  type CreateCourseRequest,
  type UpdateCourseRequest,
  type UpdateMultipleCourseRequest,
  type CourseShare,
  type ShareCourseRequest,
  type CourseTemplate,
  type CourseNode,
  type Course,
  type CourseTemplateNode,
} from '@/models/course';

/**
 * Course Services
 */
export const CourseService = {
  /**
   * Create a new course
   * @param data Course data to create
   */
  create: async (data: CreateCourseRequest) => {
    const response = await lmsAPI.post<Course>('/courses', data);
    return response.data;
  },

  /**
   * Get courses with pagination
   * @param params Query parameters for filtering and pagination
   */
  find: async (params?: {
    page?: number;
    limit?: number;
    sort?: string[];
    title?: string;
    isActive?: boolean;
    is_all?: boolean;
  }) => {
    const response = await lmsAPI.get<PaginatedListResponse<CourseNode>>('/courses', { params });
    return response.data.items;
  },

  /**
   * Update a course
   * @param data Course data to update
   */
  update: async (data: UpdateCourseRequest) => {
    const response = await lmsAPI.put<Course>('/courses', data);
    return response.data;
  },

  /**
   * Delete a course
   * @param id Course ID to delete
   */
  remove: async (id: string) => {
    await lmsAPI.delete('/courses', { data: { id } });
  },

  /**
   * Get a course by ID
   * @param id Course ID
   */
  get: async (id: string) => {
    const response = await lmsAPI.get<Course>(`/courses/${id}`);
    return response.data;
  },

  /**
   * Update multiple courses (e.g., activate/deactivate)
   * @param data Courses data to update
   */
  updateMultiple: async (data: UpdateMultipleCourseRequest) => {
    await lmsAPI.put('/courses/multiple', data);
  },

  /**
   * Get course share information
   * @param id Course ID
   */
  getShare: async (id: string) => {
    const response = await lmsAPI.get<CourseShare>(`/courses/${id}/share`);
    return response.data;
  },

  /**
   * Share a course with users or departments
   * @param data Share course data
   */
  shareCourse: async (data: ShareCourseRequest) => {
    await lmsAPI.put('/courses/share', data);
  },

  /**
   * Get course templates with pagination
   * @param params Query parameters for filtering and pagination
   */
  findTemplates: async (params?: {
    page?: number;
    limit?: number;
    sort?: string[];
    title?: string;
    isActive?: boolean;
    is_all?: boolean;
  }) => {
    const response = await lmsAPI.get<PaginatedListResponse<CourseTemplateNode>>(
      '/course-templates',
      { params }
    );
    return response.data.items;
  },

  /**
   * Get a course template by ID
   * @param id Course template ID
   */
  getTemplate: async (id: string) => {
    const response = await lmsAPI.get<CourseTemplate>(`/course-templates/${id}`);
    return response.data;
  },
};
