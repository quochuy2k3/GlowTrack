import { PaginatedListResponse } from '@/models';
import { routineAPI, talentManagementAPI } from '../config/axios';
import type { Skill } from '@/models/talent-skills';
import { transformPaginatedList } from '@/utils/pagination';
import { RoutineTodayResponse } from '@/models/routine';

export const UserRoutineService = {
  /**
   * Get skills with pagination
   * @param params Query parameters for pagination
   */
  getRoutineToday: async () => {
    const response = await routineAPI.get<RoutineTodayResponse>(`/today`);
    return response;
  },

  updatePushToken: async (pushToken: string) => {
    console.log('testpushToken', pushToken);
    const response = await routineAPI.patch('/update-push-token', {
      push_token: pushToken,
    });
    return response;
  },
};
