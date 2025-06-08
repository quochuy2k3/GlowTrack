import React from 'react';
import { useRouter } from 'expo-router';
import { ChatInterface } from '@/screens/ScanScreen/components';

export default function ChatModal() {
  const router = useRouter();

  const handleClose = () => {
    router.dismiss();
  };

  return <ChatInterface onClose={handleClose} />;
}
