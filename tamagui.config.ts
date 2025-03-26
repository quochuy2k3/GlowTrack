import { defaultConfig } from '@tamagui/config/v4';
import { createTamagui } from 'tamagui';

import { shorthands } from './theme/shorthands';
import { themes } from './theme';
import { tokens } from './theme/tokens';

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  themes,
  shorthands,
  tokens,
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
