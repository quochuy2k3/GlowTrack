import { geminiAPI, scanAPI } from '../config/axios';

export const ScanService = {
  /**
   * Get skills with pagination
   * @param params Query parameters for pagination
   */
  predict: async (formData: FormData) => {
    const response = await scanAPI.post('', formData);
    return response;
  },
  analyze: async (result_image: string, result_class_summary: any) => {
    const response = await geminiAPI.post('/analyze', {
      image_base64: result_image,
      class_summary: result_class_summary,
    });
    return response;
  },
};
