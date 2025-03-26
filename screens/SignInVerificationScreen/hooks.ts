import { useAppState } from '@/contexts/app-state';
import { services } from '@/services';
import { useMutation } from 'react-query';

export const useVerifyOTPMutation = (shopId: string, userId: string) => {
  const { state: appState } = useAppState();

  const { mutateAsync: verifyOTP, isLoading: isVerifying } = useMutation({
    mutationKey: ['verifyOTP', shopId, userId, appState.deviceId, appState.uuid],
    mutationFn: async (code: string) => {
      await services.AuthService.verifyOTP({
        type: 'login',
        shopId,
        userId,
        deviceId: appState.deviceId,
        uuid: appState.uuid,
        otp: code,
      });
    },
  });

  return { verifyOTP, isVerifying };
};

export const useStartVerificationMutation = (shopId: string, userId: string) => {
  const { state: appState } = useAppState();

  const { mutateAsync: startVerification, isLoading: isStartingVerification } = useMutation({
    mutationKey: ['startVerification', shopId, userId, appState.deviceId, appState.uuid],
    mutationFn: async () => {
      await services.AuthService.startVerification({
        type: 'login',
        shopId,
        userId,
        deviceId: appState.deviceId,
        uuid: appState.uuid,
      });
    },
  });

  return { startVerification, isStartingVerification };
};

export const useResendCodeMutation = (shopId: string, userId: string) => {
  const { state: appState } = useAppState();

  const { mutateAsync: resendCode, isLoading: isResendingCode } = useMutation({
    mutationKey: ['resendCode', shopId, userId, appState.deviceId, appState.uuid],
    mutationFn: async () => {
      await services.AuthService.resendOTP({
        type: 'login',
        shopId,
        userId,
        deviceId: appState.deviceId,
        uuid: appState.uuid,
      });
    },
  });

  return { resendCode, isResendingCode };
};

export const useSigninMutation = () => {
  const { state: appState } = useAppState();

  const { mutateAsync: signin, isLoading: isSigningIn } = useMutation({
    mutationKey: ['signin', appState.deviceId, appState.uuid],
    mutationFn: async (input: {
      email: string;
      otp: string;
      shop_username: string;
      shop_id: string;
      user_id: string;
    }) => {
      return await services.AuthService.signIn({
        email: input.email,
        deviceId: appState.deviceId,
        uuid: appState.uuid,
        otp: input.otp,
        shop_username: input.shop_username,
        shop_id: input.shop_id,
        user_id: input.user_id,
      });
    },
  });

  return { signin, isSigningIn };
};
