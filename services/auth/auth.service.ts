import {
  DeviceInfo,
  Shop,
  SigninRequest,
  StartVerificationInput,
  VerifyOTPInput,
  VerificationRequest,
  VerificationResponse,
  ResendOTPInput,
  ValidateEmailInput,
  SigninInput,
  SendOTPInput,
  SignUpInput,
} from '@/models/auth';
import { authAPI } from '../config/axios';
import { ServiceError } from '../error';

const TANCA_SHOP_USERNAME = 'app1';

/**
 * Auth Service for authentication
 */
export const AuthService = {
  signIn: async (input: SigninInput) => {
    const response = await authAPI.post<{ access_token: string; token_type: string }>('/sign-in', {
      email: input.email,
      password: input.password,
    });
    return response.access_token;
  },
  sendOTP: async (input: SendOTPInput) => {
    const response = await authAPI.post<{ message: string; statuse: number }>('/send-otp', {
      email: input.email,
    });
    return response;
  },

  resendOTP: async (input: SendOTPInput) => {
    const response = await authAPI.post<{ message: string; status: number }>('/resend-otp', {
      email: input.email,
    });
    return response;
  },
  verifyOTP: async (input: VerifyOTPInput) => {
    const response = await authAPI.post<{ access_token: string; token_type: string }>(
      '/verify-otp',
      {
        email: input.email,
        otp: input.otp,
      }
    );
    return response.data;
  },
  signUp: async (input: SignUpInput) => {
    const response = await authAPI.post<{ access_token: string; token_type: string }>('/sign-up', {
      email: input.email,
      password: input.password,
      fullname: input.fullname,
      phone: input.phone,
      avatar: input.avatar,
      gender: input.gender,
    });
    return response.access_token;
  },
};
