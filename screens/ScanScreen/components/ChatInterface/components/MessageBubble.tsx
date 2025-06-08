import React, { memo, useEffect, useRef, useState } from 'react';
import { Animated, Text, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, animations } from '../constants';
import { MessageBubbleProps } from '../types';
import MarkdownText from './MarkdownText';
import MessageActions from './MessageActions';

const MessageBubble = memo<MessageBubbleProps>(
  ({ message, isBot, onCopy, onSelect, isSelected = false }) => {
    const slideAnim = useRef(new Animated.Value(30)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const actionsAnim = useRef(new Animated.Value(0)).current;
    const [showActions, setShowActions] = useState(false);

    useEffect(() => {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: animations.timing.normal,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: animations.timing.normal,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: animations.spring.tension,
          friction: animations.spring.friction,
          useNativeDriver: true,
        }),
      ]).start();
    }, [opacityAnim, slideAnim, scaleAnim]);

    const animatedStyle = {
      opacity: opacityAnim,
      transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
    };

    const bubbleGradient = isBot
      ? (['#FFFFFF', '#F8FAFC'] as const)
      : ([colors.primary, colors.primaryDark] as const);

    const textStyle = isBot
      ? [styles.messageText, styles.botText]
      : [styles.messageText, styles.userText];

    const bubbleStyle = isBot
      ? [styles.messageBubble, styles.botBubble, isSelected && styles.selectedBubble]
      : [styles.messageBubble, styles.userBubble, isSelected && styles.selectedBubble];

    const handleLongPress = () => {
      if (!onCopy && !onSelect) return;

      setShowActions(!showActions);
      Animated.spring(actionsAnim, {
        toValue: showActions ? 0 : 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    };

    const handleCopy = () => {
      if (onCopy) {
        onCopy(message.text);
        setShowActions(false);
        Animated.spring(actionsAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    };

    const handleSelect = () => {
      if (onSelect) {
        onSelect(message.id);
      }
    };

    return (
      <Animated.View style={[animatedStyle, !isBot && { alignItems: 'flex-end', marginRight: 10 }]}>
        <TouchableWithoutFeedback onLongPress={handleLongPress}>
          <View>
            <LinearGradient
              colors={bubbleGradient}
              start={!isBot ? { x: 0, y: 0 } : undefined}
              end={!isBot ? { x: 1, y: 1 } : undefined}
              style={bubbleStyle}
            >
              {isBot ? (
                <MarkdownText text={message.text} style={textStyle} />
              ) : (
                <Text style={textStyle}>{message.text}</Text>
              )}
            </LinearGradient>

            {showActions && (onCopy || onSelect) && (
              <MessageActions
                messageId={message.id}
                isSelected={isSelected}
                onCopy={handleCopy}
                onSelect={handleSelect}
                animatedValue={actionsAnim}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
);

const styles = {
  messageBubble: {
    maxWidth: '85%' as const,
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  botBubble: {
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userBubble: {
    borderBottomRightRadius: 6,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  botText: {
    color: colors.text.primary,
  },
  userText: {
    color: colors.text.inverse,
    fontWeight: '500' as const,
  },
  selectedBubble: {
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    elevation: 6,
  },
};

MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;
