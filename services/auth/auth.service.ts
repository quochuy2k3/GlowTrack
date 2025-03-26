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
} from '@/models/auth';
import { authAPI } from '../config/axios';
import { ServiceError } from '../error';

const TANCA_SHOP_USERNAME = 'app1';

/**
 * Auth Service for authentication
 */
export const AuthService = {
  validateEmail: async (input: ValidateEmailInput) => {
    const requestData: SigninRequest = {
      email: input.email,
      provider: 'email',
      device_id: input.deviceId,
      appInfo: {
        package_name: 'vn.greenapp.worktrack',
      },
      stage: 'validate',
      is_special_login: 0,
      is_special_verification: 0,
      for_test_brute_force: false,
    };

    const response = await authAPI.post<{ shops: Shop[] }>('/signin-v2', requestData, {
      headers: {
        device: buildDeviceHeader(input.deviceId, input.uuid),
      },
    });

    const shop = response.data.shops.find(shop => shop.shop_username === TANCA_SHOP_USERNAME);

    if (!shop) {
      throw new ServiceError('Shop not found');
    }

    return shop;
  },

  signIn: async (input: SigninInput) => {
    const response = await authAPI.post<{ api_token: string; refresh_token: string }>(
      '/signin-v2',
      {
        appInfo: {
          package_name: 'vn.greenapp.worktrack',
        },
        device_id: input.deviceId,
        login_type: 'tanca_otp',
        otp: input.otp,
        phone_code: 84,
        provider: 'phone',
        shop_id: input.shop_id,
        shop_username: input.shop_username,
        stage: 'signin',
        user_id: input.user_id,
      },
      {
        headers: {
          device: buildDeviceHeader(input.deviceId, input.uuid),
        },
      }
    );

    return response.data;
  },

  startVerification: async (input: StartVerificationInput) => {
    const requestData: VerificationRequest = {
      device_id: input.deviceId,
      shop_id: input.shopId,
      stage: 'validate',
      type: 'login',
      user_id: input.userId,
    };

    return callVerification(requestData, input.deviceId, input.uuid);
  },

  /**
   * Verify OTP code during authentication
   * @param shopId Shop ID
   * @param userId User ID
   * @param otp OTP code
   * @param deviceId Device ID (typically user agent)
   * @param uuid UUID
   * @returns Verification result
   */
  verifyOTP: async (input: VerifyOTPInput) => {
    const requestData: VerificationRequest = {
      type: 'login',
      stage: 'validate',
      shop_id: input.shopId,
      user_id: input.userId,
      device_id: input.deviceId,
      otp: input.otp,
    };

    return callVerification(requestData, input.deviceId, input.uuid);
  },

  /**
   * Resend OTP code during authentication
   * @param shopId Shop ID
   * @param userId User ID
   * @param deviceId Device ID (typically user agent)
   * @param uuid UUID
   * @returns Resend OTP result
   */
  resendOTP: async (input: ResendOTPInput) => {
    const requestData: VerificationRequest = {
      type: 'login',
      stage: 'resend-otp',
      shop_id: input.shopId,
      user_id: input.userId,
      device_id: input.deviceId,
    };

    return callVerification(requestData, input.deviceId, input.uuid);
  },
};

async function callVerification(requestData: VerificationRequest, deviceId: string, uuid: string) {
  const response = await authAPI.post<VerificationResponse>(
    '/verification',
    {
      ...requestData,
      provider: 'email',
      is_special_login: 0,
      is_special_verification: 0,
      appInfo: {
        package_name: 'vn.greenapp.worktrack',
      },
    },
    {
      headers: {
        device: buildDeviceHeader(deviceId, uuid),
      },
    }
  );

  return response.data;
}

/**
 * Build the device header based on device ID
 * @param deviceId The device ID (typically user agent)
 * @returns Encoded device header string
 */
function buildDeviceHeader(deviceId: string, uuid: string): string {
  const deviceInfo: DeviceInfo = {
    uuid,
    userAgent: deviceId,
    package_name: 'vn.greenapp.worktrack',
  };

  return btoa(JSON.stringify(deviceInfo));
}
