import { SigninInput } from '@/models/auth';
import { services } from '@/services';
import { useMutation } from 'react-query';

export const useLoginMutation = () => {
  const { mutateAsync: login, isLoading: isLoggingIn } = useMutation({
    mutationFn: async (input: SigninInput) => {
      const response = await services.AuthService.signIn(input);
      return response;
    },
  });

  return { login, isLoggingIn };
};
