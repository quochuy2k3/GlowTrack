import { Button, Input, Label, Spinner, Text, View, XStack } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { useRouter } from 'expo-router';
import { useLoginMutation } from './hooks';
import { useAuth } from '@/contexts/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { KeyboardAvoidingView, ScrollView, Platform, Pressable } from 'react-native';
import commonColor from '@/theme/commonColor'; // dùng nếu bạn có font custom như WinkySans

const emailSchema = z.string().email();
const passwordSchema = z.string().min(2);

export default function SignInScreen() {
  const auth = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const isEmailValid = useMemo(() => emailSchema.safeParse(email).success, [email]);
  const isPasswordValid = useMemo(() => passwordSchema.safeParse(password).success, [password]);

  const { login, isLoggingIn } = useLoginMutation();

  const _handleSignIn = async () => {
    if (!isEmailValid) {
      setErrorMessage(t('InvalidEmail'));
      return;
    }
    if (!isPasswordValid) {
      setErrorMessage(t('InvalidPassword'));
      return;
    }

    try {
      const response = await login({ email, password });
      auth.signIn(response);
      router.back();
    } catch (_e) {
      setErrorMessage(t('WrongAccount'));
    }
  };

  useEffect(() => {
    setErrorMessage('');
  }, [email, password]);

  return (
    <LinearGradient colors={['#FFFFFF', '#FFF5F0']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingBottom: 60,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <View style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text
              fontSize={28}
              fontWeight="700"
              color="#D2826D"
              mt="$4"
              style={{
                fontFamily: commonColor.fontFamilyWinkySans || undefined,
              }}
            >
              {t('SignIn') || 'Đăng nhập'}
            </Text>
          </View>

          <View flex={1} justifyContent="center" width="100%" mb="$10" gap="$4">
            <View>
              <Label mb="$2" color="#4B3F3F" fontWeight="600">
                Email
              </Label>
              <XStack
                alignItems="center"
                backgroundColor="#FAFAFA"
                borderRadius={16}
                borderWidth={1.5}
                borderColor={errorMessage ? '#E57373' : '#F4CFC1'}
                paddingHorizontal="$3"
                height={50}
                space="$2"
                shadowColor="#E7CBC1"
                shadowOpacity={0.08}
                shadowRadius={6}
              >
                <Mail size={20} color="#D2826D" />
                <Input
                  flex={1}
                  borderWidth={0}
                  placeholder="example@email.com"
                  placeholderTextColor="#B8B2AE"
                  backgroundColor="transparent"
                  color="#4B3F3F"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </XStack>
            </View>

            <View>
              <Label mb="$2" color="#4B3F3F" fontWeight="600">
                {t('Password')}
              </Label>
              <XStack
                alignItems="center"
                backgroundColor="#FAFAFA"
                borderRadius={16}
                borderWidth={1.5}
                borderColor={errorMessage ? '#E57373' : '#F4CFC1'}
                paddingHorizontal="$3"
                height={50}
                space="$2"
                shadowColor="#E7CBC1"
                shadowOpacity={0.08}
                shadowRadius={6}
              >
                <Lock size={20} color="#D2826D" />
                <Input
                  flex={1}
                  borderWidth={0}
                  secureTextEntry={secureText}
                  placeholder={t('Password')}
                  placeholderTextColor="#B8B2AE"
                  backgroundColor="transparent"
                  color="#4B3F3F"
                  value={password}
                  onChangeText={setPassword}
                />
                <Button
                  onPress={() => setSecureText(!secureText)}
                  backgroundColor="transparent"
                  padding={0}
                  width={30}
                  height={30}
                >
                  {secureText ? (
                    <EyeOff size={20} color="#B8B2AE" />
                  ) : (
                    <Eye size={20} color="#B8B2AE" />
                  )}
                </Button>
              </XStack>
            </View>

            <Pressable
              onPress={() => router.push('/forgot-password')}
              style={{ alignSelf: 'flex-end', marginTop: 8, marginRight: 4 }}
            >
              <Text fontSize={14} color="#D2826D" fontWeight="600">
                {t('ForgotPassword') || 'Forgot Password?'}
              </Text>
            </Pressable>

            {!!errorMessage && (
              <Text mt="$2" color="#E57373" fontSize={14} fontWeight="500">
                {errorMessage}
              </Text>
            )}

            {/* Submit Button */}
            <Button
              mt="$6"
              width="100%"
              borderRadius="$10"
              backgroundColor="#FFB3AA"
              pressStyle={{ backgroundColor: '#FFA69E' }}
              disabledStyle={{ opacity: 0.4 }}
              onPress={_handleSignIn}
              disabled={isLoggingIn || !isEmailValid || !isPasswordValid}
            >
              {isLoggingIn ? <Spinner color="white" /> : <Text color="white">{t('SignIn')}</Text>}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
