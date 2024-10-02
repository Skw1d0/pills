import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Calendar } from "./components/Calendar";
import { useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { CalendarNavigation } from "./components/CalendarNavigation";
import { BottomNavbar } from "./components/BottomNavbar";
import { Settings } from "./components/Settings";
import { useSettingsStore } from "./stores/settingsStore";
import { StandardNavigation } from "./components/StandardNavigation";
import { Add } from "./components/Add";
import { lightTheme } from "./themes/lightTheme";
import { darkTheme } from "./themes/darkTheme";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const { getMode: getSettingsMode, setMode: setSettingsMode } =
    useSettingsStore();

  const today = new Date();
  const firstDayOfMonth = new Date(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    1
  ).getTime();

  const [mode, setMode] = useState(getSettingsMode() || "auto");
  const [isDarkMode, setIsDarkMode] = useState(
    mode === "auto" ? prefersDarkMode : mode === "dark" ? true : false
  );
  const [selectedTime, setSelectedTime] = useState(firstDayOfMonth);
  const [pageID, setPageID] = useState(0);

  const toggleMode = (mode: string) => {
    setMode(mode);
    setSettingsMode(mode);
    if (mode === "auto") {
      setIsDarkMode(prefersDarkMode);
    } else if (mode === "light") {
      setIsDarkMode(false);
    } else if (mode === "dark") {
      setIsDarkMode(true);
    }
  };

  return (
    <>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />

        {/* ADD */}
        {pageID === 0 && (
          <>
            <StandardNavigation title={"Hinzufügen"} />
            <Add />
          </>
        )}
        {/* CALENDAR */}
        {pageID === 1 && (
          <>
            <CalendarNavigation
              selectedTime={selectedTime}
              isDarkMode={isDarkMode}
              handleNavigateNext={() =>
                setSelectedTime(
                  new Date(
                    new Date(selectedTime).getFullYear(),
                    new Date(selectedTime).getMonth() + 1,
                    1
                  ).getTime()
                )
              }
              handleNavigateBefore={() => {
                setSelectedTime(
                  new Date(
                    new Date(selectedTime).getFullYear(),
                    new Date(selectedTime).getMonth() - 1,
                    1
                  ).getTime()
                );
              }}
              handleNavigateToday={() => {
                setSelectedTime(firstDayOfMonth);
              }}
            />
            <Box sx={{ marginTop: 6 }}>
              <Calendar isDarkMode={isDarkMode} startTime={selectedTime} />
            </Box>
          </>
        )}

        {/* SETTINGS */}
        {pageID === 2 && (
          <>
            <StandardNavigation title={"Einstellungen"} />
            <Settings mode={mode} handleMode={toggleMode} />)
          </>
        )}
        <BottomNavbar handleSetPageID={setPageID} pageID={pageID} />
      </ThemeProvider>
    </>
  );
}

export default App;
