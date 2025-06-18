import React, { memo, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send } from '@tamagui/lucide-icons';
import { LucideBot, LucideUser } from 'lucide-react-native';

// Local imports
import { colors } from './constants';
import { ChatInterfaceProps, Message } from './types';
import { shouldShowTimestamp, formatTime } from './utils';
import { useChat } from './hooks/useChat';
import { useInteractions } from './hooks/useInteractions';
import { chatStyles } from './styles';

// Components
import ChatHeader from './components/ChatHeader';
import MessageBubble from './components/MessageBubble';
import TypingIndicator from './components/TypingIndicator';
import QuickResponseBar from './components/QuickResponseBar';
import FloatingActionButton from './components/FloatingActionButton';

const ChatInterface = memo<ChatInterfaceProps>(({ onClose }) => {
  const {
    messages,
    inputText,
    setInputText,
    isTyping,
    isSending,
    sessionId,
    sendMessage,
    shouldScrollToEnd,
    setShouldScrollToEnd,
    quickResponses,
    resetChat,
    showQuickResponses,
    hideQuickResponses,
    isFirstConversation,
  } = useChat();

  const { copyMessage, toggleMessageSelection, isMessageSelected, handleRefresh, clearSelection } =
    useInteractions({
      onRefresh: resetChat,
    });

  // Refs
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const containerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(containerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [containerAnim]);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 150);
      });
    }
  }, [messages]);

  useEffect(() => {
    if (flatListRef.current && isTyping) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      });
    }
  }, [isTyping]);

  useEffect(() => {
    if (shouldScrollToEnd && flatListRef.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
            setShouldScrollToEnd(false);
          }, 200);
        });
      });
    }
  }, [shouldScrollToEnd, setShouldScrollToEnd]);

  // Memoized render functions
  const renderMessage = useCallback(
    ({ item, index }: { item: Message; index: number }) => {
      const isBot = item.sender === 'bot';
      const showTimestamp = shouldShowTimestamp(item, messages[index - 1], index);

      return (
        <View style={chatStyles.messageContainer}>
          {showTimestamp && (
            <View style={chatStyles.timestampContainer}>
              <Text style={chatStyles.timestamp}>{formatTime(item.timestamp)}</Text>
            </View>
          )}
          <View
            style={[
              chatStyles.messageRow,
              isBot ? chatStyles.botMessageRow : chatStyles.userMessageRow,
            ]}
          >
            {isBot && (
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={chatStyles.avatarContainer}
              >
                <LucideBot size={16} color={colors.text.inverse} />
              </LinearGradient>
            )}
            <MessageBubble
              message={item}
              isBot={isBot}
              onCopy={copyMessage}
              onSelect={toggleMessageSelection}
              isSelected={isMessageSelected(item.id)}
            />
            {!isBot && (
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={chatStyles.avatarContainer}
              >
                <LucideUser size={16} color={colors.text.inverse} />
              </LinearGradient>
            )}
          </View>
        </View>
      );
    },
    [messages]
  );

  const renderTypingIndicator = useCallback(() => {
    if (!isTyping) return null;

    return (
      <Animated.View style={chatStyles.typingIndicator}>
        <View style={chatStyles.typingRow}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={chatStyles.avatarContainer}
          >
            <LucideBot size={16} color={colors.text.inverse} />
          </LinearGradient>
          <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={chatStyles.typingBubble}>
            <TypingIndicator />
          </LinearGradient>
        </View>
      </Animated.View>
    );
  }, [isTyping]);

  // Memoized values
  const canSend = useMemo(
    () => inputText.trim() !== '' && !isSending && sessionId !== '',
    [inputText, isSending, sessionId]
  );

  const sendButtonGradient = useMemo(
    () =>
      canSend ? ([colors.primary, colors.primaryDark] as const) : (['#E2E8F0', '#CBD5E0'] as const),
    [canSend]
  );

  const sendIconColor = useMemo(() => (canSend ? '#FFFFFF' : '#A0AEC0'), [canSend]);

  const containerStyle = useMemo(
    () => [
      chatStyles.container,
      {
        opacity: containerAnim,
        transform: [
          {
            translateY: containerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          },
        ],
      },
    ],
    [containerAnim]
  );

  return (
    <Animated.View style={containerStyle}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ChatHeader onClose={onClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={chatStyles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
      >
        <LinearGradient
          colors={[colors.background, '#FFFFFF']}
          style={chatStyles.messagesContainer}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={chatStyles.messageList}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={Platform.OS === 'android'}
            maxToRenderPerBatch={10}
            windowSize={10}
            onRefresh={handleRefresh}
            refreshing={false}
            onContentSizeChange={() => {
              if (flatListRef.current) {
                flatListRef.current.scrollToEnd({ animated: true });
              }
            }}
          />

          {renderTypingIndicator()}
        </LinearGradient>

        <QuickResponseBar
          responses={quickResponses}
          onResponseSelect={response => {
            setInputText(response);
            // Auto focus input after selecting quick response
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
          onClose={hideQuickResponses}
          isVisible={
            showQuickResponses &&
            isFirstConversation &&
            messages.length > 0 &&
            !isTyping &&
            !isSending
          }
        />

        <LinearGradient
          colors={['rgba(255,255,255,0.95)', colors.surface]}
          style={chatStyles.inputContainer}
        >
          <View style={chatStyles.inputWrapper}>
            <TextInput
              ref={inputRef}
              style={chatStyles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Hỏi AI về kết quả phân tích..."
              placeholderTextColor={colors.text.light}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
              keyboardAppearance="light"
            />
          </View>

          <TouchableOpacity
            style={[chatStyles.sendButton, !canSend && chatStyles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!canSend}
            activeOpacity={0.8}
          >
            <LinearGradient colors={sendButtonGradient} style={chatStyles.sendButtonGradient}>
              <Send size={18} color={sendIconColor} />
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        <FloatingActionButton
          onRefresh={() => {
            clearSelection();
            resetChat();
          }}
          isVisible={messages.length > 0 && (!showQuickResponses || !isFirstConversation)}
        />
      </KeyboardAvoidingView>
    </Animated.View>
  );
});

ChatInterface.displayName = 'ChatInterface';

export default ChatInterface;
