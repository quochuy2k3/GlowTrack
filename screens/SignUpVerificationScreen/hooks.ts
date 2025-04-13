import { SendOTPInput, SignUpInput, VerifyOTPInput } from '@/models/auth';
import { services } from '@/services';
import { useMutation } from 'react-query';

export const useSendOTPMutation = () => {
  const { mutateAsync: sendOTP, isLoading: isSendingOTP } = useMutation({
    mutationFn: async (input: SendOTPInput) => {
      const response = await services.AuthService.sendOTP(input);
      console.log('123123response', response);
      return response;
    },
  });

  return { sendOTP, isSendingOTP };
};

export const useVerifyOTPMutation = () => {
  const { mutateAsync: verifyOTP, isLoading: isVerifyingOTP } = useMutation({
    mutationFn: async (input: VerifyOTPInput) => {
      const response = await services.AuthService.verifyOTP(input);
      return response;
    },
  });

  return { verifyOTP, isVerifyingOTP };
};

export const useSignUpMutation = () => {
  const { mutateAsync: signUp, isLoading: isSigningUp } = useMutation({
    mutationFn: async (input: SignUpInput) => {
      const response = await services.AuthService.signUp(input);
      return response;
    },
  });

  return { signUp, isSigningUp };
};
