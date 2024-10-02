import {
  CalendarToday,
  NavigateBefore,
  NavigateNext,
} from "@mui/icons-material";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";

interface CalendarNavigationProps {
  selectedTime: number;
  isDarkMode: boolean;
  handleNavigateBefore: () => void;
  handleNavigateNext: () => void;
  handleNavigateToday: () => void;
}

const monthNames = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

export const CalendarNavigation = (props: CalendarNavigationProps) => {
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }}>
            {monthNames[new Date(props.selectedTime).getMonth()]}{" "}
            {new Date(props.selectedTime).getFullYear()}
          </Typography>
          <IconButton
            onClick={props.handleNavigateBefore}
            sx={{ color: "#ffffff", marginRight: 2 }}
          >
            <NavigateBefore />
          </IconButton>
          <IconButton
            onClick={props.handleNavigateNext}
            sx={{ color: "#ffffff", marginRight: 2 }}
          >
            <NavigateNext />
          </IconButton>
          <IconButton
            onClick={props.handleNavigateToday}
            sx={{ color: "#ffffff" }}
          >
            <CalendarToday />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
};
