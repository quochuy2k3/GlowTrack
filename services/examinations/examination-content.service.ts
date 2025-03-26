import type { PaginatedListResponse } from '@/models/base';
import lmsAPI from '../config/axios';
import {
  type CreateExaminationContentLectureRequest,
  type CreateExaminationContentQuestionRequest,
  type ExaminationContent,
  type ExaminationContentNode,
  type UpdateExaminationContentLectureRequest,
  type UpdateExaminationContentQuestionRequest,
  type UpdateExaminationContentRequest,
} from '@/models/examination-content';

/**
 * Examination Content Services
 */
export const ExaminationContentService = {
  /**
   * Find examination contents by examination ID
   * @param params Query parameters including examination ID
   */
  find: async (params: { examination: string; page?: number; limit?: number; sort?: string[] }) => {
    const response = await lmsAPI.get<PaginatedListResponse<ExaminationContentNode>>(
      '/examination-contents',
      { params }
    );
    return response.data.items;
  },

  /**
   * Delete an examination content
   * @param id Examination content ID to delete
   */
  remove: async (id: string) => {
    await lmsAPI.delete('/examination-contents', { data: { id } });
  },

  /**
   * Get an examination content by ID
   * @param id Examination content ID
   */
  get: async (id: string) => {
    const response = await lmsAPI.get<ExaminationContent>(`/examination-contents/${id}`);
    return response.data;
  },

  /**
   * Create a lecture content
   * @param data Lecture data to create
   */
  createLecture: async (data: CreateExaminationContentLectureRequest) => {
    const response = await lmsAPI.post<ExaminationContent>('/examination-sections/lecture', data);
    return response.data;
  },

  /**
   * Update a lecture content
   * @param data Lecture data to update
   */
  updateLecture: async (data: UpdateExaminationContentLectureRequest) => {
    const response = await lmsAPI.put<ExaminationContent>('/examination-sections/lecture', data);
    return response.data;
  },

  /**
   * Create a question content
   * @param data Question data to create
   */
  createQuestion: async (data: CreateExaminationContentQuestionRequest) => {
    const response = await lmsAPI.post<ExaminationContent>('/examination-sections/question', data);
    return response.data;
  },

  /**
   * Update a question content
   * @param data Question data to update
   */
  updateQuestion: async (data: UpdateExaminationContentQuestionRequest) => {
    const response = await lmsAPI.put<ExaminationContent>('/examination-sections/question', data);
    return response.data;
  },

  /**
   * Update a content's section, position or point
   * @param data Content data to update
   */
  updateContent: async (data: UpdateExaminationContentRequest) => {
    const response = await lmsAPI.put<ExaminationContent>('/examination-sections/content', data);
    return response.data;
  },
};
