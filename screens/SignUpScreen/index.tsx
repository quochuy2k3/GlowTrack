import { useRef, useEffect, useMemo, useState } from 'react';
import { Button, Input, Text, View, XStack, YStack, Image } from 'tamagui'; // Import Radio from Tamagui
import { RadioGroup } from '@tamagui/radio-group';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, User, Eye, EyeOff, Camera, LucideArrowLeft } from 'lucide-react-native';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import * as ImagePicker from 'expo-image-picker';
import commonColor from '@/theme/commonColor';
import { useSendOTPMutation } from '../SignUpVerificationScreen/hooks';
import { useServices } from '@/services';
import { uploadImage } from '@/utils/uploadImg';
import variables from '@/theme/commonColor';
const emailSchema = z.string().email();
const passwordSchema = z
  .string()
  .min(8, 'Mật khẩu phải có ít nhất 8 ký tự.')
  .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất một chữ cái in hoa.');

export default function SignUpScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { sendOTP, isSendingOTP } = useSendOTPMutation();
  const services = useServices();
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [secureText, setSecureText] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [gender, setGender] = useState('');
  // Track when user has interacted with the field
  const [touchedFields, setTouchedFields] = useState({
    fullname: false,
    email: false,
    phoneNumber: false,
    password: false,
  });

  const isEmailValid = useMemo(() => emailSchema.safeParse(email).success, [email]);
  const isPasswordValid = useMemo(() => passwordSchema.safeParse(password).success, [password]);
  const [dataImg, setDataImg] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const phoneInputRef = useRef<PhoneInput>(null);
  const fullnameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
      setDataImg(result.assets[0]);
    }
  };

  const _handleSignUp = async () => {
    setTouchedFields({
      fullname: true,
      email: true,
      phoneNumber: true,
      password: true,
    });

    // Check if all fields are valid
    if (!isEmailValid || !isPasswordValid || !fullname || !phoneNumber) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin và đảm bảo mật khẩu hợp lệ.');
      return;
    }

    const formattedPhone =
      phoneInputRef.current?.getNumberAfterPossiblyEliminatingZero()?.formattedNumber || '';
    // Đăng ký API với formattedPhone ở đây

    const response = await services.AuthService.sendOTP({ email: email });
    if (response.status !== 200) {
      setErrorMessage('Email đã được tạo tài khoản');
      return;
    }
    const data = {
      fullname: fullname,
      gender: gender,
      email: email,
      phone: formattedPhone,
      password: password,
      avatar: dataImg,
    };
    router.push({
      pathname: '/(signin)/sign-up/verify',
      params: {
        data: JSON.stringify(data),
      },
    });
  };

  useEffect(() => {
    setErrorMessage('');
  }, [email, password, fullname]);

  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case 'fullname':
        setFullname(value);
        setTouchedFields(prev => ({ ...prev, fullname: true }));
        break;
      case 'email':
        setEmail(value);
        setTouchedFields(prev => ({ ...prev, email: true }));
        break;
      case 'phoneNumber':
        setPhoneNumber(value);
        setTouchedFields(prev => ({ ...prev, phoneNumber: true }));
        break;
      case 'password':
        setPassword(value);
        setTouchedFields(prev => ({ ...prev, password: true }));
        break;
      default:
        break;
    }
  };

  const isPhoneNumberValid = phoneInputRef.current?.isValidNumber(phoneNumber);

  return (
    <LinearGradient colors={['#FFFFFF', '#FFF5F0']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View
          style={{
            marginTop: variables.scale(100),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            position="absolute"
            left={0}
            backgroundColor="transparent"
            width={50}
            rounded={30}
            height={50}
            onPress={() => router.back()}
          >
            <LucideArrowLeft color="black" />
          </Button>
          <Text
            fontSize={32}
            fontWeight="800"
            color="#C96F5E"
            style={{ fontFamily: commonColor.fontFamilyWinkySans || undefined }}
          >
            Đăng ký tài khoản
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingBottom: 60,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={pickAvatar} style={{ marginTop: 8, marginBottom: 24 }}>
            <View
              width={120}
              height={120}
              borderRadius={60}
              borderColor="#FFB7A1"
              borderWidth={2}
              justifyContent="center"
              alignItems="center"
              overflow="hidden"
              backgroundColor="#FFF3EE"
              shadowColor="#FFC1B0"
              shadowOpacity={0.15}
              shadowRadius={8}
            >
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} width={120} height={120} resizeMode="cover" />
              ) : (
                <Camera size={24} color="#D2826D" />
              )}
            </View>
          </TouchableOpacity>

          <YStack width="100%" gap="$3" mb="$10">
            <XStack justifyContent="center" alignItems="center" gap="$3">
              <RadioGroup
                value={gender}
                onValueChange={setGender}
                style={{
                  flexDirection: 'row',
                  borderRadius: 20,
                  padding: 10,
                  backgroundColor: '#FAFAFA',
                  borderWidth: 1.5,
                  borderColor: '#F4CFC1',
                }}
              >
                <RadioGroup.Item
                  value="male"
                  style={{
                    padding: 5,
                    marginRight: 10,
                    backgroundColor: gender === 'male' ? '#D2826D' : '#FFF3EE',
                    borderRadius: 20,
                    width: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Text style={{ color: '#4B3F3F' }}>Nam</Text>
                </RadioGroup.Item>
                <RadioGroup.Item
                  value="female"
                  style={{
                    padding: 5,
                    marginRight: 10,
                    backgroundColor: gender === 'female' ? '#D2826D' : '#FFF3EE',
                    borderRadius: 20,
                    width: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Text style={{ color: '#4B3F3F' }}>Nữ</Text>
                </RadioGroup.Item>
                <RadioGroup.Item
                  value="other"
                  style={{
                    padding: 5,
                    backgroundColor: gender === 'other' ? '#D2826D' : '#FFF3EE',
                    borderRadius: 20,
                    width: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Text style={{ color: '#4B3F3F' }}>Khác</Text>
                </RadioGroup.Item>
              </RadioGroup>
            </XStack>
            {!gender && (
              <Text color="#E57373" fontSize={12}>
                *Vui lòng chọn giới tính.
              </Text>
            )}
            <XStack
              alignItems="center"
              backgroundColor="#FAFAFA"
              borderRadius={20}
              borderWidth={1.5}
              borderColor={touchedFields.fullname && !fullname ? '#E57373' : '#F4CFC1'} // Error if field is touched and empty
              paddingHorizontal="$3"
              height={50}
              space="$2"
            >
              <User size={20} color="#D2826D" />
              <Input
                ref={fullnameRef}
                flex={1}
                borderWidth={0}
                placeholder="Họ và tên"
                placeholderTextColor="#B8B2AE"
                backgroundColor="transparent"
                color="#4B3F3F"
                value={fullname}
                onChangeText={value => handleFieldChange('fullname', value)}
                onSubmitEditing={() => emailRef.current?.focus()}
              />
            </XStack>
            {touchedFields.fullname && !fullname && (
              <Text color="#E57373" fontSize={12}>
                *Họ và tên không được để trống.
              </Text>
            )}

            <XStack
              alignItems="center"
              backgroundColor="#FAFAFA"
              borderRadius={20}
              borderWidth={1.5}
              borderColor={touchedFields.email && !isEmailValid ? '#E57373' : '#F4CFC1'}
              paddingHorizontal="$3"
              height={50}
              space="$2"
            >
              <Mail size={20} color="#D2826D" />
              <Input
                ref={emailRef}
                flex={1}
                borderWidth={0}
                placeholder="example@email.com"
                placeholderTextColor="#B8B2AE"
                backgroundColor="transparent"
                color="#4B3F3F"
                value={email}
                onChangeText={value => handleFieldChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                onSubmitEditing={() => phoneInputRef.current?.focus()}
              />
            </XStack>
            {touchedFields.email && !isEmailValid && (
              <Text color="#E57373" fontSize={12}>
                *Email không hợp lệ.
              </Text>
            )}

            <View
              style={{
                backgroundColor: '#FAFAFA',
                borderRadius: 20,
                borderWidth: 1.5,
                borderColor: touchedFields.phoneNumber && !phoneNumber ? '#E57373' : '#F4CFC1', // Error if field is touched and phone number is empty
                paddingHorizontal: 12,
                height: 60,
                justifyContent: 'center',
              }}
            >
              <PhoneInput
                ref={phoneInputRef}
                value={phoneNumber}
                defaultCode="VN"
                layout="first"
                onChangeFormattedText={value => handleFieldChange('phoneNumber', value)}
                containerStyle={{ backgroundColor: 'transparent', height: 50, width: '100%' }}
                textContainerStyle={{ backgroundColor: 'transparent', paddingLeft: 0 }}
                countryPickerButtonStyle={{ marginRight: 8, width: 46, justifyContent: 'center' }}
                codeTextStyle={{ fontSize: 13, color: '#4B3F3F' }}
                textInputStyle={{ fontSize: 15 }}
                textInputProps={{
                  placeholder: 'Số điện thoại',
                  placeholderTextColor: '#B8B2AE',
                  style: { color: '#4B3F3F' },
                  onSubmitEditing: () => passwordRef.current?.focus(),
                }}
              />
            </View>
            {touchedFields.phoneNumber && !phoneNumber && (
              <Text color="#E57373" fontSize={12}>
                *Số điện thoại không được để trống.
              </Text>
            )}
            {!isPhoneNumberValid && touchedFields.phoneNumber && (
              <Text color="#E57373" fontSize={12}>
                *Số điện thoại không hợp lệ.
              </Text>
            )}

            <XStack
              alignItems="center"
              backgroundColor="#FAFAFA"
              borderRadius={20}
              borderWidth={1.5}
              borderColor={touchedFields.password && !isPasswordValid ? '#E57373' : '#F4CFC1'} // Error if field is touched and password is invalid
              paddingHorizontal="$3"
              height={50}
              space="$2"
              shadowColor="#E7CBC1"
              shadowOpacity={0.08}
              shadowRadius={6}
            >
              <Lock size={20} color="#D2826D" />
              <Input
                ref={passwordRef}
                flex={1}
                borderWidth={0}
                secureTextEntry={secureText}
                placeholder="Mật khẩu"
                placeholderTextColor="#B8B2AE"
                backgroundColor="transparent"
                color="#4B3F3F"
                value={password}
                onChangeText={value => handleFieldChange('password', value)}
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
            {touchedFields.password && !isPasswordValid && (
              <Text color="#E57373" fontSize={12}>
                *Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất một chữ cái in hoa.
              </Text>
            )}

            {!!errorMessage && (
              <Text mt="$2" color="#E57373" fontSize={14} fontWeight="500">
                {errorMessage}
              </Text>
            )}

            <Button
              mt="$4"
              width="100%"
              borderRadius={20}
              backgroundColor="#FFAFA0"
              pressStyle={{ backgroundColor: '#FF998F' }}
              disabledStyle={{ opacity: 0.4 }}
              onPress={_handleSignUp}
              disabled={!isEmailValid || !isPasswordValid || !fullname || !phoneNumber}
              shadowColor="#F8C4B8"
              shadowOpacity={0.15}
              shadowRadius={6}
            >
              <Text color="white" fontWeight="600" fontSize={16}>
                Đăng ký
              </Text>
            </Button>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
