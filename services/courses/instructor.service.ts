import type { PaginatedListResponse } from '@/models/base';
import lmsAPI from '../config/axios';
import {
  type CreateInstructorRequest,
  type Instructor,
  type InstructorNode,
  type UpdateInstructorRequest,
} from '@/models/instructor';

/**
 * Instructor Services
 */
export const InstructorService = {
  /**
   * Create a new instructor
   * @param data Instructor data to create
   */
  create: async (data: CreateInstructorRequest) => {
    const response = await lmsAPI.post<Instructor>('/instructors', data);
    return response.data;
  },

  /**
   * Get instructors with pagination
   * @param params Query parameters for filtering and pagination
   */
  find: async (params?: {
    page?: number;
    limit?: number;
    sort?: string[];
    name?: string;
    is_all?: boolean;
  }) => {
    const response = await lmsAPI.get<PaginatedListResponse<InstructorNode>>('/instructors', {
      params,
    });
    return response.data.items;
  },

  /**
   * Update an instructor
   * @param data Instructor data to update
   */
  update: async (data: UpdateInstructorRequest) => {
    const response = await lmsAPI.put<Instructor>('/instructors', data);
    return response.data;
  },

  /**
   * Delete an instructor
   * @param id Instructor ID to delete
   */
  remove: async (id: string) => {
    await lmsAPI.delete('/instructors', { data: { id } });
  },

  /**
   * Get an instructor by ID
   * @param id Instructor ID
   */
  get: async (id: string) => {
    const response = await lmsAPI.get<Instructor>(`/instructors/${id}`);
    return response.data;
  },
};
