import { PaginatedListResponse } from '@/models';
import { routineAPI, talentManagementAPI } from '../config/axios';
import type { Skill } from '@/models/talent-skills';
import { transformPaginatedList } from '@/utils/pagination';
import { DaySchema, RoutineTodayResponse, UserRoutineResponse } from '@/models/routine';

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
  getUserRoutine: async () => {
    const response = await routineAPI.get<UserRoutineResponse>('/');
    return response;
  },

  updateDayofRoutine: async (dayofRoutine: DaySchema) => {
    console.log('testdayofRoutine', dayofRoutine);
    const response = await routineAPI.put(`/update-day`, {
      day_of_week: dayofRoutine.day_of_week,
      sessions: dayofRoutine.sessions,
    });
    console.log('testdayofRoutineresponse', response);
    return response;
  },

  updateRoutineName: async (routineName: string) => {
    const response = await routineAPI.patch('/update-routine-name', {
      routine_name: routineName,
    });
    return response;
  },
};
