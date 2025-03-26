import { Card } from 'tamagui';
import { styled } from '@tamagui/core';

export const StyledCard = styled(Card, {
  width: '100%',
  bg: '$color1',
  gap: '$2',
  pressStyle: {
    scale: 0.98,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    elevation: 0,
  },
  rounded: '$5',
  animation: 'quick',
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.5,
  elevation: 5,
  p: '$3',
});
