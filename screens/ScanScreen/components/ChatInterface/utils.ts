import { ChatResponse } from './types';

export const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const generateMessageId = (): string => {
  return Date.now().toString();
};

export const extractBotTextFromResponse = (response: ChatResponse): string => {
  console.log('Raw response:', response);
  console.log('Response structure:', Object.keys(response || {}));

  let botText: string = '';

  // Try different response formats
  if (response?.output) {
    botText = response.output;
  } else if (response?.data && typeof response.data === 'object' && response.data.output) {
    botText = response.data.output;
  } else if (response?.data && typeof response.data === 'string') {
    botText = response.data;
  } else if (response?.message) {
    botText = response.message;
  } else if (typeof response === 'string') {
    botText = response;
  } else {
    // Try to get the first string value from response
    const responseStr = JSON.stringify(response);
    console.log('Response as string:', responseStr);

    // If response looks like it contains the actual content, extract it
    if (responseStr.includes('**Available documents:**') || responseStr.includes('**')) {
      // Try to extract the content from the stringified response
      const match = responseStr.match(/"([^"]*\*\*[^"]*)/);
      if (match) {
        botText = match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
      }
    }
  }

  console.log('Extracted bot text:', botText);
  return botText;
};

export const shouldShowTimestamp = (
  currentMessage: { timestamp: Date },
  previousMessage: { timestamp: Date } | undefined,
  index: number
): boolean => {
  return (
    index === 0 ||
    !previousMessage ||
    new Date(currentMessage.timestamp).getTime() - new Date(previousMessage.timestamp).getTime() >
      300000 // 5 minutes
  );
};

export const formatTime = (timestamp: Date): string => {
  return new Date(timestamp).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
