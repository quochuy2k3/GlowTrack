import lmsAPI from '../config/axios';
import {
  type CourseContent,
  type CreateCourseContentLectureRequest,
  type CreateCourseContentQuestionRequest,
  type UpdateCourseContentLectureRequest,
  type UpdateCourseContentQuestionRequest,
  type UpdateCourseContentRequest,
} from '@/models/course-content';
import { type CourseContentNode } from '@/models/course';
import type { FinishUserCourseContentRequest, FinishUserCourseContent } from '@/models/user-course';
import type { PaginatedListResponse } from '@/models/base';

/**
 * Course Content Services
 */
export const CourseContentService = {
  /**
   * Find course contents by course ID
   * @param params Query parameters including course ID
   */
  find: async (params: { course: string; page?: number; limit?: number; sort?: string[] }) => {
    const response = await lmsAPI.get<PaginatedListResponse<CourseContentNode>>(
      '/course-contents',
      { params }
    );
    return response.data.items;
  },

  /**
   * Delete a course content
   * @param id Course content ID to delete
   */
  remove: async (id: string) => {
    await lmsAPI.delete('/course-contents', { data: { id } });
  },

  /**
   * Get a course content by ID
   * @param id Course content ID
   */
  get: async (id: string) => {
    const response = await lmsAPI.get<CourseContent>(`/course-contents/${id}`);
    return response.data;
  },

  /**
   * Preview/finish a course content
   * @param id Course content ID
   * @param data Finish data (for questions)
   */
  preview: async (id: string, data: FinishUserCourseContentRequest) => {
    const response = await lmsAPI.post<FinishUserCourseContent>(
      `/course-contents/${id}/preview`,
      data
    );
    return response.data;
  },

  /**
   * Create a lecture content
   * @param data Lecture data to create
   */
  createLecture: async (data: CreateCourseContentLectureRequest): Promise<CourseContent> => {
    const response = await lmsAPI.post('/course-sections/lecture', data);
    return response.data;
  },

  /**
   * Update a lecture content
   * @param data Lecture data to update
   */
  updateLecture: async (data: UpdateCourseContentLectureRequest): Promise<CourseContent> => {
    const response = await lmsAPI.put('/course-sections/lecture', data);
    return response.data;
  },

  /**
   * Create a question content
   * @param data Question data to create
   */
  createQuestion: async (data: CreateCourseContentQuestionRequest): Promise<CourseContent> => {
    const response = await lmsAPI.post('/course-sections/question', data);
    return response.data;
  },

  /**
   * Update a question content
   * @param data Question data to update
   */
  updateQuestion: async (data: UpdateCourseContentQuestionRequest): Promise<CourseContent> => {
    const response = await lmsAPI.put('/course-sections/question', data);
    return response.data;
  },

  /**
   * Update a content's section or position
   * @param data Content data to update
   */
  updateContent: async (data: UpdateCourseContentRequest): Promise<CourseContent> => {
    const response = await lmsAPI.put('/course-sections/content', data);
    return response.data;
  },
};
