import type { PaginatedListResponse } from '@/models/base';
import lmsAPI from '../config/axios';
import {
  type CreateTrainingProgramRequest,
  type TrainingProgram,
  type TrainingProgramNode,
  type UpdateTrainingProgramRequest,
} from '@/models/training-program';

/**
 * Training Program Services
 */
export const TrainingProgramService = {
  /**
   * Create a new training program
   * @param data Training program data to create
   */
  create: async (data: CreateTrainingProgramRequest) => {
    const response = await lmsAPI.post<TrainingProgram>('/training-programs', data);
    return response.data;
  },

  /**
   * Get training programs with pagination
   * @param params Query parameters for filtering and pagination
   */
  find: async (params?: { page?: number; limit?: number; sort?: string[]; name?: string }) => {
    const response = await lmsAPI.get<PaginatedListResponse<TrainingProgramNode>>(
      '/training-programs',
      { params }
    );
    return response.data.items;
  },

  /**
   * Update a training program
   * @param data Training program data to update
   */
  update: async (data: UpdateTrainingProgramRequest) => {
    const response = await lmsAPI.put<TrainingProgram>('/training-programs', data);
    return response.data;
  },

  /**
   * Delete a training program
   * @param id Training program ID to delete
   */
  remove: async (id: string) => {
    await lmsAPI.delete('/training-programs', { data: { id } });
  },

  /**
   * Get a training program by ID
   * @param id Training program ID
   */
  get: async (id: string) => {
    const response = await lmsAPI.get<TrainingProgram>(`/training-programs/${id}`);
    return response.data;
  },
};
