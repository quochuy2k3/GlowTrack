import { styled } from '@tamagui/core';

import { Card } from 'tamagui';

export const StyledCard = styled(Card, {
  bg: '$color1',
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
