import React, { memo } from 'react';
import { Text } from 'react-native';
import { colors } from '../constants';
import { MarkdownTextProps } from '../types';

const MarkdownText = memo<MarkdownTextProps>(({ text, style }) => {
  const renderText = () => {
    const parts: React.ReactElement[] = [];
    let key = 0;

    // Split text by lines to handle each line separately
    const lines = text.split('\n');

    lines.forEach((line, lineIndex) => {
      if (lineIndex > 0) {
        parts.push(
          <Text key={key++} style={style}>
            {'\n'}
          </Text>
        );
      }

      // Handle numbered lists (1. 2. etc.)
      if (/^\d+\.\s/.test(line)) {
        const segments = line.split(/(\*\*.*?\*\*)/g);
        segments.forEach(segment => {
          if (segment.startsWith('**') && segment.endsWith('**')) {
            const boldText = segment.slice(2, -2);
            parts.push(
              <Text key={key++} style={[style, { fontWeight: '700', color: colors.text.primary }]}>
                {boldText}
              </Text>
            );
          } else if (segment.trim() !== '') {
            parts.push(
              <Text key={key++} style={style}>
                {segment}
              </Text>
            );
          }
        });
      }
      // Handle links [text](url)
      else if (line.includes('[') && line.includes('](')) {
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let lastIndex = 0;
        let match;

        while ((match = linkRegex.exec(line)) !== null) {
          // Add text before link
          if (match.index > lastIndex) {
            const beforeText = line.substring(lastIndex, match.index);
            const beforeSegments = beforeText.split(/(\*\*.*?\*\*)/g);
            beforeSegments.forEach(segment => {
              if (segment.startsWith('**') && segment.endsWith('**')) {
                const boldText = segment.slice(2, -2);
                parts.push(
                  <Text
                    key={key++}
                    style={[style, { fontWeight: '700', color: colors.text.primary }]}
                  >
                    {boldText}
                  </Text>
                );
              } else if (segment.trim() !== '') {
                parts.push(
                  <Text key={key++} style={style}>
                    {segment}
                  </Text>
                );
              }
            });
          }

          // Add link text with link styling
          parts.push(
            <Text
              key={key++}
              style={[style, { color: colors.primary, textDecorationLine: 'underline' }]}
            >
              {match[1]}
            </Text>
          );

          lastIndex = match.index + match[0].length;
        }

        // Add remaining text
        if (lastIndex < line.length) {
          const remainingText = line.substring(lastIndex);
          const remainingSegments = remainingText.split(/(\*\*.*?\*\*)/g);
          remainingSegments.forEach(segment => {
            if (segment.startsWith('**') && segment.endsWith('**')) {
              const boldText = segment.slice(2, -2);
              parts.push(
                <Text
                  key={key++}
                  style={[style, { fontWeight: '700', color: colors.text.primary }]}
                >
                  {boldText}
                </Text>
              );
            } else if (segment.trim() !== '') {
              parts.push(
                <Text key={key++} style={style}>
                  {segment}
                </Text>
              );
            }
          });
        }
      }
      // Regular line with potential bold text
      else {
        const segments = line.split(/(\*\*.*?\*\*)/g);
        segments.forEach((segment, segIndex) => {
          if (segment.startsWith('**') && segment.endsWith('**')) {
            const boldText = segment.slice(2, -2);
            parts.push(
              <Text key={key++} style={[style, { fontWeight: '700', color: colors.text.primary }]}>
                {boldText}
              </Text>
            );
          } else if (segment.trim() !== '' || segIndex === 0) {
            parts.push(
              <Text key={key++} style={style}>
                {segment}
              </Text>
            );
          }
        });
      }
    });

    return parts.length > 0
      ? parts
      : [
          <Text key={0} style={style}>
            {text}
          </Text>,
        ];
  };

  return <Text style={style}>{renderText()}</Text>;
});

MarkdownText.displayName = 'MarkdownText';

export default MarkdownText;
