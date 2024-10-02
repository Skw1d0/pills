import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light", // Aktiviert den Dark Mode
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#cccccc", // Setze hier die gewünschte Hintergrundfarbe
        },
      },
    },
  },
});
