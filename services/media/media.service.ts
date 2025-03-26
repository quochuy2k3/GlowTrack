import type { PaginatedListResponse } from '@/models/base';
import lmsAPI from '../config/axios';
import {
  type Media,
  type UploadVideoRequest,
  type UploadVideo,
  type MediaNode,
} from '@/models/media';

/**
 * Media Services
 */
export const MediaService = {
  /**
   * Find media with filters
   * @param params Query parameters for filtering and pagination
   */
  find: async (params?: {
    page?: number;
    limit?: number;
    sort?: string[];
    type?: 'pdf' | 'doc' | 'sheet' | 'slide' | 'image' | 'video' | 'unknown';
    name?: string;
    usageCount?: number;
  }) => {
    const response = await lmsAPI.get<PaginatedListResponse<MediaNode>>('/media', {
      params,
    });
    return response.data.items;
  },

  /**
   * Get media by ID
   * @param id Media ID
   */
  get: async (id: string) => {
    const response = await lmsAPI.get<Media>(`/media/${id}`);
    return response.data;
  },

  /**
   * Get video details
   * @param id Media ID
   * @param videoId Video ID
   */
  getVideo: async (id: string, videoId: string) => {
    await lmsAPI.get(`/media/video`, { params: { id, videoId } });
  },

  /**
   * Upload video
   * @param data Upload video request data
   */
  uploadVideo: async (data: UploadVideoRequest) => {
    const response = await lmsAPI.post<UploadVideo>('/media/upload/video', data);
    return response.data;
  },
};
