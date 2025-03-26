import { Button, Input, Label, Spinner, Text, View } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { z } from 'zod';
import { useRouter } from 'expo-router';
import { useValidateEmailMutation } from './hooks';

const emailSchema = z.string().email();

export default function SignInScreen() {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const isEmailValid = useMemo(() => emailSchema.safeParse(email).success, [email]);

  const { validateEmail, isValidatingEmail } = useValidateEmailMutation();

  const _handleSignIn = async () => {
    if (!isEmailValid) {
      setErrorMessage(t('InvalidEmail'));
      return;
    }

    try {
      const shop = await validateEmail(email);

      router.replace({
        pathname: '/(root)/(modals)/sign-in/verify',
        params: {
          shopId: shop.id,
          userId: shop.user_id,
          email,
          shopUsername: shop.shop_username,
        },
      });
    } catch (_e) {
      setErrorMessage(t('WrongAccount'));
    }
  };

  return (
    <View flex={1} justify="center" items="center">
      <View width="80%" gap="$3">
        <View>
          <Label>{t('Email')}</Label>
          <Input
            placeholder={t('Email')}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          {!!errorMessage && (
            <Text mt="$1" color="$red10">
              {errorMessage}
            </Text>
          )}
        </View>

        <Button
          theme={isValidatingEmail || !isEmailValid ? undefined : 'accent'}
          disabled={isValidatingEmail || !isEmailValid}
          disabledStyle={{ opacity: 0.5 }}
          onPress={_handleSignIn}
        >
          {isValidatingEmail && <Spinner />}
          {t('SignIn')}
        </Button>
      </View>
    </View>
  );
}
