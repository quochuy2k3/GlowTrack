import OTPInput from '@/components/OTPInput';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Spinner, Text, View } from 'tamagui';
import {
  useResendCodeMutation,
  useStartVerificationMutation,
  useVerifyOTPMutation,
  useSigninMutation,
} from './hooks';
import { ServiceError } from '@/services/error';
import { TouchableOpacity } from 'react-native';
import { RESEND_CODE_COUNT_DOWN, OTP_LENGTH } from '@/constants';
import { useAuth } from '@/contexts/auth';

export default function SignInVerificationScreen() {
  const { t } = useTranslation();
  const auth = useAuth();
  const { shopId, userId, email, shopUsername } = useLocalSearchParams<{
    shopId: string;
    userId: string;
    email: string;
    shopUsername: string;
  }>();
  const [errorMessage, setErrorMessage] = useState('');
  const [code, setCode] = useState('');
  const [resendCodeCountDown, setResendCodeCountDown] = useState(0);
  const countDownInterval = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const { verifyOTP, isVerifying } = useVerifyOTPMutation(shopId, userId);
  const { startVerification, isStartingVerification } = useStartVerificationMutation(
    shopId,
    userId
  );
  const { resendCode, isResendingCode } = useResendCodeMutation(shopId, userId);
  const { signin, isSigningIn } = useSigninMutation();

  const isInvalidCode = code.length !== OTP_LENGTH;
  const isLoading = isStartingVerification || isVerifying || isResendingCode || isSigningIn;
  const isDisabledResendCode = resendCodeCountDown > 0;

  useEffect(() => {
    startVerification()
      .then(() => {
        setResendCodeCountDown(RESEND_CODE_COUNT_DOWN);
      })
      .catch(() => {
        setErrorMessage(t('verify_otp_error_message'));
      });
  }, [startVerification, t]);

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
      await verifyOTP(code);

      const tokenData = await signin({
        email,
        otp: code,
        shop_username: shopUsername,
        shop_id: shopId,
        user_id: userId,
      });

      auth.signIn(tokenData.api_token, tokenData.refresh_token);

      router.back();
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
      await resendCode();
      setResendCodeCountDown(RESEND_CODE_COUNT_DOWN);
    } catch (_) {}
  };

  return (
    <View flex={1} p="$3" justify="center" items="center">
      <View gap="$3">
        <OTPInput onChange={setCode} length={OTP_LENGTH} error={errorMessage} value={code} />

        <View gap="$4">
          <Button
            theme={isLoading || isInvalidCode ? undefined : 'accent'}
            disabled={isLoading || isInvalidCode}
            disabledStyle={{ opacity: 0.5 }}
            onPress={_handleVerificationSubmit}
          >
            {isLoading && <Spinner />}
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
