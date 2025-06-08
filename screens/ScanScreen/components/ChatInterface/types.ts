export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatResponse {
  output?: string;
  data?: string | { output?: string };
  message?: string;
}

export interface ChatRequest {
  chatInput: string;
  sessionId: string;
}

export interface ChatInterfaceProps {
  onClose?: () => void;
}

export interface MessageBubbleProps {
  message: Message;
  isBot: boolean;
  onCopy?: (text: string) => void;
  onSelect?: (messageId: string) => void;
  isSelected?: boolean;
}

export interface ChatHeaderProps {
  onClose?: () => void;
}

export interface MarkdownTextProps {
  text: string;
  style: any;
}
