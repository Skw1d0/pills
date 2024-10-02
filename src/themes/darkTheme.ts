import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark", // Aktiviert den Dark Mode
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#333333", // Setze hier die gewünschte Hintergrundfarbe
        },
      },
    },
  },
});
