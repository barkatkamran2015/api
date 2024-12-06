import { createTheme } from "@mui/material";

  export const Theme = createTheme({
    palette: {
      primary: {
        main: '#287094',
        light: '#4DA1C8',
        dark: '#1C4D63',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#D4D4CE',
        light: '#E6E6E3',
        dark: '#A6A69C',
        contrastText: '#000000',
      },
      background: {
        default: '#F6F6F6',
        paper: '#ffffff',
      },
      text: {
        primary: '#000000',
        secondary: '#757575',
        disabled: '#BDBDBD',
        contrast: '#ffffff'
      },
      accent: {
        main: '#023246',
      },
    },
  });