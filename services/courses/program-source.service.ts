import type { PaginatedListResponse } from '@/models/base';
import lmsAPI from '../config/axios';
import {
  type CreateProgramSourceRequest,
  type ProgramSource,
  type UpdateProgramSourceRequest,
} from '@/models/program-source';

/**
 * Program Source Services
 */
export const ProgramSourceService = {
  /**
   * Create a new program source
   * @param data Program source data to create
   */
  create: async (data: CreateProgramSourceRequest) => {
    const response = await lmsAPI.post<ProgramSource>('/program-sources', data);
    return response.data;
  },

  /**
   * Get program sources with pagination
   * @param params Query parameters for filtering and pagination
   */
  find: async (params?: {
    page?: number;
    limit?: number;
    sort?: string[];
    name?: string;
    is_all?: boolean;
  }) => {
    const response = await lmsAPI.get<PaginatedListResponse<ProgramSource>>('/program-sources', {
      params,
    });
    return response.data.items;
  },

  /**
   * Update a program source
   * @param data Program source data to update
   */
  update: async (data: UpdateProgramSourceRequest) => {
    const response = await lmsAPI.put<ProgramSource>('/program-sources', data);
    return response.data;
  },

  /**
   * Delete a program source
   * @param id Program source ID to delete
   */
  remove: async (id: string) => {
    await lmsAPI.delete('/program-sources', { data: { id } });
  },

  /**
   * Get a program source by ID
   * @param id Program source ID
   */
  get: async (id: string) => {
    const response = await lmsAPI.get<ProgramSource>(`/program-sources/${id}`);
    return response.data;
  },
};
