import { chatAPI } from '../config/axios';

export interface ChatRequest {
  chatInput: string;
  sessionId: string;
}

export interface ChatResponse {
  output?: string;
  message?: string;
  data?: {
    output?: string;
  };
  [key: string]: any;
}

export const ChatService = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    console.log('Sending request:', request);
    const response = await chatAPI.post('/webhook/api/chat', request, {
      timeout: 60000,
    });
    console.log('Raw response:', response);
    console.log('Response data:', response.data);

    let responseData = response.data;

    if (!responseData && Array.isArray(response)) {
      responseData = response[0];
    }

    if (Array.isArray(responseData) && responseData.length > 0) {
      responseData = responseData[0];
    }

    console.log('Processed response data:', responseData);
    return responseData || {};
  },
};
