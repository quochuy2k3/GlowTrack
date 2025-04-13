import lmsAPI from '../config/axios';
import {
  type CreateExaminationSectionRequest,
  type ExaminationSection,
  type UpdateExaminationSectionRequest,
} from '@/models/examination-section';
import type { PaginatedListResponse } from '@/models/base';

/**
 * Examination Section Services
 */
export const ExaminationSectionService = {
  /**
   * Create a new examination section
   * @param data Section data to create
   */
  create: async (data: CreateExaminationSectionRequest) => {
    const response = await lmsAPI.post<ExaminationSection>('/examination-sections', data);
    return response.data;
  },

  /**
   * Find examination sections by examination ID
   * @param params Query parameters including examination ID
   */
  find: async (params: { examination: string }) => {
    const response = await lmsAPI.get<PaginatedListResponse<ExaminationSection>>(
      '/examination-sections',
      { params }
    );
    return response.data.items;
  },

  /**
   * Update an examination section
   * @param data Section data to update
   */
  update: async (data: UpdateExaminationSectionRequest) => {
    await lmsAPI.put<ExaminationSection>('/examination-sections', data);
  },

  /**
   * Delete an examination section
   * @param id Section ID to delete
   */
  remove: async (id: string) => {
    await lmsAPI.delete('/examination-sections', { data: { id } });
  },

  /**
   * Get an examination section by ID
   * @param id Section ID
   */
  get: async (id: string) => {
    const response = await lmsAPI.get<ExaminationSection>(`/examination-sections/${id}`);
    return response.data;
  },
};
