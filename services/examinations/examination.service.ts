import type { PaginatedListResponse } from '@/models/base';
import lmsAPI from '../config/axios';
import {
  type CreateExaminationRequest,
  type Examination,
  type ExaminationNode,
  type UpdateExaminationRequest,
  type UpdateMultipleExaminationRequest,
} from '@/models/examination';

/**
 * Examination Services
 */
export const ExaminationService = {
  /**
   * Create a new examination
   * @param data Examination data to create
   */
  create: async (data: CreateExaminationRequest): Promise<Examination> => {
    const response = await lmsAPI.post('/examinations', data);
    return response.data;
  },

  /**
   * Get examinations with pagination
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
    const response = await lmsAPI.get<PaginatedListResponse<ExaminationNode>>('/examinations', {
      params,
    });
    return response.data.items;
  },

  /**
   * Update an examination
   * @param data Examination data to update
   */
  update: async (data: UpdateExaminationRequest) => {
    const response = await lmsAPI.put<Examination>('/examinations', data);
    return response.data;
  },

  /**
   * Delete an examination
   * @param id Examination ID to delete
   */
  remove: async (id: string) => {
    await lmsAPI.delete('/examinations', { data: { id } });
  },

  /**
   * Get an examination by ID
   * @param id Examination ID
   */
  get: async (id: string) => {
    const response = await lmsAPI.get<Examination>(`/examinations/${id}`);
    return response.data;
  },

  /**
   * Update multiple examinations (e.g., activate/deactivate)
   * @param data Examinations data to update
   */
  updateMultiple: async (data: UpdateMultipleExaminationRequest) => {
    await lmsAPI.put('/examinations/multiple', data);
  },
};
