import { trackerAPI } from '../config/axios';

export const TrackerService = {
  /**
   * Get skills with pagination
   * @param params Query parameters for pagination
   */
  getWeekTracker: async () => {
    const response = await trackerAPI.get('/week-status');
    return response;
  },
  getTrackerById: async (trackerId: string) => {
    const response = await trackerAPI.get(`/${trackerId}`);
    return response;
  },
  getTracklistByRange: async (params: { startDate: string; endDate: string }) => {
    const response = await trackerAPI.get('/trackers/by-date-range', {
      params: {
        start_date: params.startDate,
        end_date: params.endDate,
      },
    });
    return response;
  },
};
