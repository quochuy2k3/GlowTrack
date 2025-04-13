import { PaginatedListResponse } from '@/models';
import { talentManagementAPI } from '../config/axios';
import type { Skill } from '@/models/talent-skills';
import { transformPaginatedList } from '@/utils/pagination';

/**
 * Talent Skills Service
 */
export const TalentSkillsService = {
  /**
   * Get skills with pagination
   * @param params Query parameters for pagination
   */
  getSkills: async (
    params: {
      page?: number;
      per_page?: number;
    } = {
      page: 1,
    }
  ) => {
    const response = await talentManagementAPI.get<PaginatedListResponse<Skill>>(`/api/v1/skills`, {
      params,
    });

    return transformPaginatedList(response.data);
  },

  /**
   * Get a specific skill by ID
   * @param id Skill ID
   */
  getSkillById: async (id: string) => {
    const response = await talentManagementAPI.get<Skill>(`/api/v1/skills/${id}`);
    return response.data;
  },
};
