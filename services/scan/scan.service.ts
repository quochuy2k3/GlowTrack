import { scanAPI } from '../config/axios';

export const ScanService = {
  /**
   * Get skills with pagination
   * @param params Query parameters for pagination
   */
  predict: async (formData: FormData) => {
    const response = await scanAPI.post('', formData);
    return response;
  },
};
