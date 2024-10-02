import {
  AddCircleOutlineOutlined,
  CalendarMonthOutlined,
  Settings,
} from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";

interface BottomNavigationProps {
  pageID: number;
  handleSetPageID: (pageID: number) => void;
}

export const BottomNavbar = (props: BottomNavigationProps) => {
  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1 }}
      square
    >
      <BottomNavigation
        showLabels
        value={props.pageID}
        onChange={(event, newPageID) => {
          props.handleSetPageID(newPageID);
        }}
      >
        <BottomNavigationAction
          label="Hinzufügen"
          icon={<AddCircleOutlineOutlined />}
        />
        <BottomNavigationAction
          label="Kalender"
          icon={<CalendarMonthOutlined />}
        />
        <BottomNavigationAction label="Einstellungen" icon={<Settings />} />
      </BottomNavigation>
    </Paper>
  );
};
