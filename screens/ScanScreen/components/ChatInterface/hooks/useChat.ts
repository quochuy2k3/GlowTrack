import { useState, useCallback, useEffect } from 'react';
import { useServices } from '@/services';
import { Message } from '../types';
import { generateSessionId, generateMessageId, extractBotTextFromResponse } from '../utils';
import { useHaptics } from './useHaptics';

export const useChat = () => {
  const { ChatService } = useServices();
  const { lightHaptic, successHaptic, errorHaptic } = useHaptics();

  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [shouldScrollToEnd, setShouldScrollToEnd] = useState(false);
  const [messageQueue, setMessageQueue] = useState<Message[]>([]);
  const [showQuickResponses, setShowQuickResponses] = useState(true);
  const [isFirstConversation, setIsFirstConversation] = useState(true);

  // Initialize chat session
  useEffect(() => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);

    const welcomeMessage: Message = {
      id: '1',
      text: 'Xin chào! Tôi là trợ lý AI của GlowTrack 🌟\n\nTôi có thể giúp bạn:\n• Phân tích tình trạng da\n• Đưa ra lời khuyên chăm sóc da\n• Giải đáp thắc mắc về sản phẩm\n\nHãy bắt đầu trò chuyện nhé!',
      sender: 'bot',
      timestamp: new Date(),
    };

    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = useCallback(async () => {
    if (inputText.trim() === '' || isSending || !sessionId) return;

    lightHaptic(); // Haptic feedback on send

    const userMessage: Message = {
      id: generateMessageId(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    const messageText = inputText.trim();
    setInputText('');
    setIsTyping(true);
    setIsSending(true);

    try {
      const response = await ChatService.sendMessage({
        chatInput: messageText,
        sessionId: sessionId,
      });

      const botText =
        extractBotTextFromResponse(response) ||
        'Xin lỗi, tôi không thể phản hồi lúc này. Vui lòng thử lại sau.';

      const botMessage: Message = {
        id: generateMessageId(),
        text: botText,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
      setShouldScrollToEnd(true); // Trigger scroll when bot responds
      successHaptic(); // Success haptic feedback

      // Hide quick responses after first interaction if it's the first conversation
      if (isFirstConversation) {
        setIsFirstConversation(false);
      }
    } catch (error) {
      console.error('Chat error:', error);
      errorHaptic(); // Error haptic feedback

      const errorMessage: Message = {
        id: generateMessageId(),
        text: 'Đã có lỗi xảy ra. Vui lòng kiểm tra kết nối và thử lại. 🔄',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prevMessages => [...prevMessages, errorMessage]);
      setShouldScrollToEnd(true); // Trigger scroll for error message too
    } finally {
      setIsTyping(false);
      setIsSending(false);
    }
  }, [inputText, isSending, sessionId, ChatService, lightHaptic, successHaptic, errorHaptic]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setInputText('');
    setIsTyping(false);
    setIsSending(false);
    setShowQuickResponses(true);
    setIsFirstConversation(true);
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);

    // Add welcome message after reset
    setTimeout(() => {
      const welcomeMessage: Message = {
        id: '1',
        text: 'Xin chào! Tôi là trợ lý AI của GlowTrack 🌟\n\nTôi có thể giúp bạn:\n• Phân tích tình trạng da\n• Đưa ra lời khuyên chăm sóc da\n• Giải đáp thắc mắc về sản phẩm\n\nHãy bắt đầu trò chuyện nhé!',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }, 100);
  }, []);

  // Simulate realistic typing delay
  const simulateTyping = useCallback(async (duration: number = 1500) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, duration));
    setIsTyping(false);
  }, []);

  // Add quick responses
  const quickResponses = [
    'Chăm sóc da dầu',
    'Có bao nhiêu chương',
    'Cách chăm sóc da hiệu quả?',
    'Bài hát tên gì?',
  ];

  const hideQuickResponses = useCallback(() => {
    setShowQuickResponses(false);
  }, []);

  return {
    messages,
    inputText,
    setInputText,
    isTyping,
    isSending,
    sessionId,
    sendMessage,
    resetChat,
    shouldScrollToEnd,
    setShouldScrollToEnd,
    simulateTyping,
    quickResponses,
    messageQueue,
    showQuickResponses,
    hideQuickResponses,
    isFirstConversation,
  };
};
