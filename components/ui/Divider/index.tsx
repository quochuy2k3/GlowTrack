import { styled, View } from '@tamagui/core';

const Divider = styled(View, {
  variants: {
    orientation: {
      horizontal: {
        height: 1,
        width: '100%',
      },
      vertical: {
        width: 1,
        height: '100%',
      },
    },
  } as const,
});

export default Divider;
