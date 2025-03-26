import lmsAPI from '../config/axios';
import {
  type CreateUserExaminationRequest,
  type FinishUserExaminationContentRequest,
  type UserExaminationContent,
  type UserExamination,
  type UserExaminationResult,
  type UserExaminationContentNode,
} from '@/models/user-examination';
import { type PaginationParams, type PaginationResponse } from '@/models/pagination';
import type { ListResponse } from '@/models/base';

/**
 * User Examination Services
 */
export const UserExaminationService = {
  /**
   * Start taking an examination
   * @param data Examination enrollment data
   */
  enroll: async (data: CreateUserExaminationRequest): Promise<UserExamination> => {
    const response = await lmsAPI.post('/user-examinations/enroll', data);
    return response.data;
  },

  /**
   * Get all user examinations with pagination
   * @param params Query parameters
   */
  find: async (params?: {
    page?: number;
    limit?: number;
    sort?: string[];
    status?: string;
  }): Promise<PaginationResponse<UserExamination>> => {
    const response = await lmsAPI.get('/user-examinations', { params });
    return response.data;
  },

  /**
   * Get a user examination by ID
   * @param examinationId Examination ID
   */
  get: async (examinationId: string): Promise<UserExamination> => {
    const response = await lmsAPI.get(`/user-examinations/${examinationId}`);
    return response.data;
  },

  /**
   * Find contents of a user examination
   * @param examinationId Examination ID
   * @param params Query parameters
   */
  findContents: async (
    examinationId: string,
    params?: PaginationParams & {
      section?: string;
    }
  ) => {
    const response = await lmsAPI.get<ListResponse<UserExaminationContentNode>>(
      `/user-examinations/${examinationId}/contents`,
      { params }
    );
    return response.data.items;
  },

  /**
   * Get a specific content from a user examination
   * @param examinationId Examination ID
   * @param contentId Content ID
   */
  getContent: async (examinationId: string, contentId: string): Promise<UserExaminationContent> => {
    const response = await lmsAPI.get<UserExaminationContent>(
      `/user-examinations/${examinationId}/contents/${contentId}`
    );
    return response.data;
  },

  /**
   * Answer a question in the examination
   * @param examinationId Examination ID
   * @param contentId Content ID
   * @param data Answer data
   */
  answerQuestion: async (
    examinationId: string,
    contentId: string,
    data: FinishUserExaminationContentRequest
  ): Promise<UserExaminationContent> => {
    const response = await lmsAPI.post<UserExaminationContent>(
      `/user-examinations/${examinationId}/contents/${contentId}/answer`,
      data
    );
    return response.data;
  },

  /**
   * Finish an examination
   * @param examinationId Examination ID
   */
  finish: async (examinationId: string): Promise<UserExaminationResult> => {
    const response = await lmsAPI.post<UserExaminationResult>(
      `/user-examinations/${examinationId}/finish`
    );
    return response.data;
  },

  /**
   * Get examination result
   * @param examinationId Examination ID
   */
  getResult: async (examinationId: string): Promise<UserExaminationResult> => {
    const response = await lmsAPI.get<UserExaminationResult>(
      `/user-examinations/${examinationId}/result`
    );
    return response.data;
  },
};
