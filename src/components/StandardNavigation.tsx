import { AppBar, Toolbar, Typography } from "@mui/material";

interface StandardNavigationProps {
  title: string;
}

export const StandardNavigation = (props: StandardNavigationProps) => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography>{props.title}</Typography>
      </Toolbar>
    </AppBar>
  );
};
