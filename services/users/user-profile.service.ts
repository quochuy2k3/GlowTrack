import lmsAPI from '../config/axios';
import type { UpdateAvatarRequest, UpdateProfileRequest, UserProfile } from '@/models/user-profile';

/**
 * User Profile Service
 */
export const UserProfileService = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<UserProfile> => {
    const response = await lmsAPI.get('/users/profile');
    return response.data;
  },

  /**
   * Update user profile
   * @param data Profile data to update
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await lmsAPI.put('/users/profile', data);
    return response.data;
  },

  /**
   * Update user avatar
   * @param data Avatar file data
   */
  updateAvatar: async (data: UpdateAvatarRequest): Promise<UserProfile> => {
    // Create form data to upload file
    const formData = new FormData();
    formData.append('file', data.file);

    const response = await lmsAPI.put('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete user avatar
   */
  deleteAvatar: async (): Promise<UserProfile> => {
    const response = await lmsAPI.delete('/users/avatar');
    return response.data;
  },

  /**
   * Change user password
   * @param data Password change data
   */
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<{ message: string }> => {
    const response = await lmsAPI.post('/users/change-password', data);
    return response.data;
  },
};
