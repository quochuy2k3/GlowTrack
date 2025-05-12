import { PaginatedListResponse } from '@/models';

import { requestAPI, routineAPI, talentManagementAPI } from '../config/axios';

import type { Skill } from '@/models/talent-skills';
import { transformPaginatedList } from '@/utils/pagination';
import { DaySchema, RoutineTodayResponse, UserRoutineResponse } from '@/models/routine';

interface UserInfo {
  fullname: string;
  email: string;
  avatar: string;
}

export interface FriendRequest {
  id: string;
  user_id: string;
  partner_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  sender_info?: UserInfo;
  receiver_info?: UserInfo;
}

export interface CreateRequestResponse {
  id: string;
  user_id: string;
  partner_id: string;
  status: string;
  created_at: string;
  message: string;
  receiver_info?: UserInfo;
}

export interface ActionRequestResponse {
  id: string;
  user_id: string;
  partner_id: string;
  status: string;
  created_at: string;
  message: string;
  note?: string;
  sender_info?: UserInfo;
}

export interface DeleteRequestResponse {
  status: number;
  message: string;
}

export class RequestService {
  // Get received friend requests
  getReceivedRequests = async (): Promise<FriendRequest[]> => {
    const response = await requestAPI.get('/received');
    return response;
  };

  // Get sent friend requests
  getSentRequests = async (): Promise<FriendRequest[]> => {
    const response = await requestAPI.get('/sent');
    return response;
  };

  // Create a friend request
  createRequest = async (email: string): Promise<CreateRequestResponse> => {
    const response = await requestAPI.post('/create-request', { email });
    return response;
  };

  // Accept a friend request
  acceptRequest = async (requestId: string): Promise<ActionRequestResponse> => {
    const response = await requestAPI.post(`/${requestId}/accept`);
    return response;
  };

  // Reject a friend request
  rejectRequest = async (requestId: string): Promise<DeleteRequestResponse> => {
    const response = await requestAPI.delete(`/${requestId}/received`);
    return response;
  };

  // Delete a sent friend request
  deleteSentRequest = async (requestId: string): Promise<DeleteRequestResponse> => {
    const response = await requestAPI.delete(`/${requestId}/sent`);
    return response;
  };
}
