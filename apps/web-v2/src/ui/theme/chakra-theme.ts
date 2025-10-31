import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
  mergeConfigs,
} from '@chakra-ui/react';
import { tokens } from './foundations/tokens';

export const buttonRecipe = defineRecipe({
  base: {
    display: 'flex',
  },
  variants: {
    variant: {
      solid: { bg: 'brand.500', color: 'white' },
      outline: { borderWidth: '1px', borderColor: 'brand.500' },
    },
    size: {
      sm: { padding: '4', fontSize: '12px' },
      lg: { padding: '8', fontSize: '24px' },
    },
  },
});
// ConfigRecipeSlots
const theme = defineConfig({
  cssVarsRoot: ':where(html)',
  theme: {
    tokens,
    recipes: {
      button: buttonRecipe,
    },
    keyframes: {
      marquee: {
        '0%': { transform: 'transform: translateX(0)' },
        '100%': { transform: 'translateX(-50%)' },
      },
    },
  },
});

const config = mergeConfigs(defaultConfig, theme);
const system = createSystem(config);

export default system;
