import OTPInput from '@/components/OTPInput';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Spinner, Text, View } from 'tamagui';

import { ServiceError } from '@/services/error';
import { TouchableOpacity } from 'react-native';
import { RESEND_CODE_COUNT_DOWN, OTP_LENGTH } from '@/constants';
import { useAuth } from '@/contexts/auth';
import { useVerifyOTPMutation, useSendOTPMutation } from './hooks';
import { useServices } from '@/services';
import { uploadImage } from '@/utils/uploadImg';
export default function SignInVerificationScreen() {
  const services = useServices();
  const { t } = useTranslation();
  const auth = useAuth();
  type UserData = {
    fullname: string;
    email: string;
    phone: string;
    password: string;
    avatar: string | null;
    gender: string;
  };

  const { data } = useLocalSearchParams<{
    data: string;
  }>();
  console.log('data', data);
  const parsedData: UserData = JSON.parse(data);
  const [errorMessage, setErrorMessage] = useState('');
  const [code, setCode] = useState('');
  const [resendCodeCountDown, setResendCodeCountDown] = useState(0);
  const countDownInterval = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const { verifyOTP, isVerifyingOTP } = useVerifyOTPMutation();
  // const { signin, isSigningIn } = useSigninMutation();

  const isInvalidCode = code.length !== OTP_LENGTH;
  const isDisabledResendCode = resendCodeCountDown > 0;

  useEffect(() => {}, []);

  const isCountingDown = resendCodeCountDown > 0;
  useEffect(() => {
    if (isCountingDown) {
      countDownInterval.current = setInterval(() => {
        setResendCodeCountDown(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (countDownInterval.current) {
        clearInterval(countDownInterval.current);
      }
    };
  }, [isCountingDown]);

  const _handleVerificationSubmit = async () => {
    if (code.length !== OTP_LENGTH) {
      return;
    }

    try {
      await verifyOTP({ email: parsedData.email, otp: code });
      let response = '';
      if (parsedData.avatar) {
        response = await uploadImage(parsedData.avatar);
      }
      const data = {
        fullname: parsedData.fullname,
        email: parsedData.email,
        phone: parsedData.phone,
        password: parsedData.password,
        gender: parsedData.gender,
        avatar: response,
      };
      const responseSignUp = await services.AuthService.signUp(data);
      if (responseSignUp) {
        auth.signIn(responseSignUp);
        router.back();
      }
    } catch (error) {
      if (error instanceof ServiceError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(t('verify_otp_error_message'));
      }
    }
  };

  const _handleResendCode = async () => {
    try {
      setResendCodeCountDown(RESEND_CODE_COUNT_DOWN);
      const response = await services.AuthService.resendOTP({ email: parsedData.email });
      if (response.status !== 200) {
        setErrorMessage('Lỗi server');
        return;
      }
    } catch (_) {}
  };

  return (
    <View flex={1} p="$3" justify="center" items="center">
      <View gap="$3">
        <OTPInput onChange={setCode} length={OTP_LENGTH} error={errorMessage} value={code} />

        <View gap="$4">
          <Button
            theme={isInvalidCode ? undefined : 'accent'}
            disabled={isInvalidCode}
            disabledStyle={{ opacity: 0.5 }}
            onPress={_handleVerificationSubmit}
          >
            {isVerifyingOTP && <Spinner />}
            {t('Verify')}
          </Button>

          <TouchableOpacity onPress={_handleResendCode} disabled={isDisabledResendCode}>
            <Text text="center" my="$3" opacity={isDisabledResendCode ? 0.5 : 1}>
              {t('ResendCode')} {isCountingDown && `(${resendCodeCountDown}s)`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
