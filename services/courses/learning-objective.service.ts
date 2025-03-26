import type { PaginatedListResponse } from '@/models/base';
import lmsAPI from '../config/axios';
import {
  type CreateLearningObjectiveRequest,
  type LearningObjective,
  type LearningObjectiveNode,
  type UpdateLearningObjectiveRequest,
} from '@/models/learning-objective';

/**
 * Learning Objective Services
 */
export const LearningObjectiveService = {
  /**
   * Create a new learning objective
   * @param data Learning objective data to create
   */
  create: async (data: CreateLearningObjectiveRequest): Promise<LearningObjective> => {
    const response = await lmsAPI.post<LearningObjective>('/learning-objectives', data);
    return response.data;
  },

  /**
   * Get learning objectives with pagination
   * @param params Query parameters for filtering and pagination
   */
  find: async (params?: { page?: number; limit?: number; sort?: string[]; name?: string }) => {
    const response = await lmsAPI.get<PaginatedListResponse<LearningObjectiveNode>>(
      '/learning-objectives',
      { params }
    );
    return response.data.items;
  },

  /**
   * Update a learning objective
   * @param data Learning objective data to update
   */
  update: async (data: UpdateLearningObjectiveRequest): Promise<LearningObjective> => {
    const response = await lmsAPI.put<LearningObjective>('/learning-objectives', data);
    return response.data;
  },

  /**
   * Delete a learning objective
   * @param id Learning objective ID to delete
   */
  remove: async (id: string): Promise<void> => {
    await lmsAPI.delete('/learning-objectives', { data: { id } });
  },

  /**
   * Get a learning objective by ID
   * @param id Learning objective ID
   */
  get: async (id: string): Promise<LearningObjective> => {
    const response = await lmsAPI.get<LearningObjective>(`/learning-objectives/${id}`);
    return response.data;
  },
};
