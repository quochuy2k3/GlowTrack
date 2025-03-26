import type { ListResponse } from '@/models/base';
import lmsAPI from '../config/axios';
import {
  type CourseSection,
  type CreateCourseSectionRequest,
  type UpdateCourseSectionRequest,
} from '@/models/course-section';
import { type CourseSectionNode } from '@/models/course';

/**
 * Course Section Services
 */
export const CourseSectionService = {
  /**
   * Create a new course section
   * @param data Section data to create
   */
  create: async (data: CreateCourseSectionRequest) => {
    const response = await lmsAPI.post<CourseSection>('/course-sections', data);
    return response.data;
  },

  /**
   * Find course sections by course ID
   * @param params Query parameters including course ID
   */
  find: async (params: { course: string }) => {
    const response = await lmsAPI.get<ListResponse<CourseSectionNode>>('/course-sections', {
      params,
    });
    return response.data.items;
  },

  /**
   * Update a course section
   * @param data Section data to update
   */
  update: async (data: UpdateCourseSectionRequest) => {
    const response = await lmsAPI.put<CourseSection>('/course-sections', data);
    return response.data;
  },

  /**
   * Delete a course section
   * @param id Section ID to delete
   */
  remove: async (id: string): Promise<void> => {
    await lmsAPI.delete('/course-sections', { data: { id } });
  },

  /**
   * Get a course section by ID
   * @param id Section ID
   */
  get: async (id: string) => {
    const response = await lmsAPI.get<CourseSection>(`/course-sections/${id}`);
    return response.data;
  },
};
