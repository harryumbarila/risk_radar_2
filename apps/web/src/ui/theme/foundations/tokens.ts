import { defineTokens } from "@chakra-ui/react";

export const tokens = defineTokens({
  colors: {
    brand: {
      50: { value: "#f0f1f7" },
      100: { value: "#d9dbe9" },
      200: { value: "#c2c5db" },
      300: { value: "#abafcd" },
      400: { value: "#9499bf" },
      500: { value: "#3a3d69" },
      600: { value: "#34375e" },
      700: { value: "#2e3153" },
      800: { value: "#282b48" },
      900: { value: "#22253d" },
    },
    blue: {
      50: { value: "#f0f5ff" },
      100: { value: "#d6e4ff" },
      200: { value: "#adc8ff" },
      300: { value: "#85a8ff" },
      400: { value: "#6690ff" },
      500: { value: "#3a5de6" },
      600: { value: "#3452cc" },
      700: { value: "#2e47b3" },
      800: { value: "#283d99" },
      900: { value: "#223380" },
    },
  },
  fonts: {
    heading: {
      value: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    },
    body: {
      value: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    },
  },
});
