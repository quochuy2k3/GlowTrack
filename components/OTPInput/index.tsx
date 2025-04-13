import { Input, Text, View, XStack } from 'tamagui';
import { useEffect, useRef, useState } from 'react';
import { NativeSyntheticEvent } from 'react-native';
import { TextInputKeyPressEventData } from 'react-native';

interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export default function OTPInput({ length = 6, value = '', onChange, error }: OTPInputProps) {
  const [otp, setOtp] = useState(value.split(''));
  const inputRefs = useRef<Input[]>([]);

  useEffect(() => {
    // Initialize refs array
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const focusInput = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.focus();
    }
  };

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    const otpString = newOtp.join('');
    onChange?.(otpString);

    if (text && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const _handleKeyDown =
    (index: number) => (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      console.log('handleKeyDown', e.nativeEvent.key);
      if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
        focusInput(index - 1);
      }
    };

  return (
    <View>
      <XStack gap="$2">
        {Array(length)
          .fill(0)
          .map((_, index) => (
            <Input
              key={index}
              ref={el => {
                if (el) {
                  inputRefs.current[index] = el;
                }
              }}
              maxLength={1}
              value={otp[index] || ''}
              onChangeText={text => handleChange(text, index)}
              onKeyPress={_handleKeyDown(index)}
              text="center"
              width={50}
              height={50}
              fontSize="$6"
            />
          ))}
      </XStack>
      {error && (
        <Text mt="$2" color="$red10">
          {error}
        </Text>
      )}
    </View>
  );
}
