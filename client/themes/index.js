import {
    extendTheme,
    withDefaultColorScheme,
    theme as baseTheme,
  } from "@chakra-ui/react";
  import { Input } from "./components/input.theme";
  import { mode } from "@chakra-ui/theme-tools";
  import { Button } from "./components/button.theme";
  import { Container } from "./components/container.theme";
  import { Select } from "./components/select.theme";
  export const customTheme = extendTheme(
    {
      colors: {
        dark: {
          100: "#2E3440",
          200: "#292E39",
        },
        light: {
          100: "#FFFFFF",
          200: "#F8F9FB",
        },
        primaries: {
          100: '#e0e0e6', // Swatch 7
          200: '#999cac', // Swatch 2
          300: '#73859d', // Swatch 5
          400: '#5a7291', // Swatch 6
          500: '#46526d', // Swatch 3
          600: '#1b3357', // Swatch 4
          700: '#01030c', // Swatch 1
          800: '#0E0B16'
        },
        secondaries: {
          900: "#222",
          800: "#191919"
        }
      },
      styles: {
        global: (props) => ({
          body: {
            bg: mode("#FFFFFF", "#FFFFFF")(props),
          },
          "*::placeholder": {
            color: mode("#FFFFFF", "#FFFFFF")(props),
          },
        }),
      },
      components: {
        Input,
        Button,
        Container,
        Select,
      },
    },
    withDefaultColorScheme({ colorScheme: "green" })
  );
  