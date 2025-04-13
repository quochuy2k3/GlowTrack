export interface Shop {
  client_role: string;
  employee_name: string;
  user_id: string;
  need_set_password: number;
  id: string;
  name: string;
  shop_username: string;
  is_new_user: number;
}

export interface DeviceInfo {
  uuid: string;
  userAgent: string;
  package_name: string;
}

export interface SigninRequest {
  email: string;
  provider: string;
  device_id: string;
  appInfo: {
    package_name: string;
  };
  stage: string;
  is_special_login: number;
  is_special_verification: number;
  for_test_brute_force: boolean;
}

export type VerificationStage = 'validate' | 'resend-otp';
export type VerificationType = 'login';

export interface VerificationRequest {
  otp?: string;
}

export interface VerificationResponse {
  otp_type?: string;
}

export interface VerificationInput {
  type: VerificationType;
  shopId: string;
  userId: string;
  deviceId: string;
  uuid: string;
}

export type StartVerificationInput = VerificationInput;

export interface VerifyOTPInput {
  email: string;
  otp: string;
}

export type ResendOTPInput = VerificationInput;

export interface ValidateEmailInput {
  email: string;
  deviceId: string;
  uuid: string;
}

export interface SigninInput {
  email: string;
  password: string;
}

export interface SendOTPInput {
  email: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  fullname: string;
  phone: string;
  avatar: string;
  gender: string;
}
