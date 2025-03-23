import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui } from "tamagui";

import { shorthands } from './theme/shorthands'
import { themes } from "./theme";

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  themes,
  shorthands,
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
