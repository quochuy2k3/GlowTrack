import { coupleAPI } from '../config/axios';

export interface PartnerRoutineSession {
  time: string;
  status: 'pending' | 'done' | 'not_done';
  steps: {
    step_order: number;
    step_name: string;
  }[];
}

export interface PartnerRoutineToday {
  day_of_week: string;
  sessions: PartnerRoutineSession[];
}

export interface PartnerRoutine {
  routine_name: string;
  push_token: string;
  today: PartnerRoutineToday;
}

export interface Partner {
  id: string;
  fullname: string;
  email: string;
  avatar: string | null;
  streak: number;
  today_tracker: any | null;
  today_routine: PartnerRoutine | null;
}

export interface CoupleResponse {
  id: string;
  created_at: string;
  partner: Partner;
}

export class Couple {
  // Get couple information
  getCouple = async (): Promise<CoupleResponse> => {
    const response = await coupleAPI.get('/');
    return response;
  };

  // Remove couple/partner
  removePartner = async (coupleId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await coupleAPI.delete(`/${coupleId}`);

      return {
        success: true,
        message: response.data?.message || 'Partner successfully removed',
      };
    } catch (error) {
      console.error('Error removing partner:', error);
      throw error;
    }
  };

  // Send routine reminder to partner
  sendRoutineReminder = async (
    partnerId: string,
    pushToken: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      // Construct the request body exactly as shown in the curl example
      const requestBody = {
        partner_id: partnerId,
        push_token: pushToken,
      };

      console.log('Sending reminder with:', JSON.stringify(requestBody));

      const response = await coupleAPI.post('/reminder', requestBody);

      return {
        success: true,
        message: response.data?.message || 'Reminder sent successfully',
      };
    } catch (error: any) {
      console.error('Error sending reminder:', error);

      // Log error details
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }

      throw error;
    }
  };
}
