import { useAppState } from '@/contexts/app-state';
import { services } from '@/services';
import { useMutation } from 'react-query';

export const useValidateEmailMutation = () => {
  const { state: appState } = useAppState();

  const { mutateAsync: validateEmail, isLoading: isValidatingEmail } = useMutation({
    mutationFn: async (email: string) => {
      return await services.AuthService.validateEmail({
        email,
        deviceId: appState.deviceId,
        uuid: appState.uuid,
      });
    },
  });

  return { validateEmail, isValidatingEmail };
};
