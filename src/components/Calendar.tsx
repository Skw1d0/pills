import {
  Box,
  Card,
  Chip,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { CalendarItem, useCalendarStore } from "../stores/calendarStore";

interface CalendarProps {
  isDarkMode: boolean;
  startTime: number;
}

export const Calendar = (props: CalendarProps) => {
  const { items, removeItem } = useCalendarStore();

  const lastDayOfMonth = new Date(
    new Date(props.startTime).getFullYear(),
    new Date(props.startTime).getMonth() + 1,
    0
  ).getTime();

  const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  const getBackgroundCalendarItemColor = (
    index: number,
    isDarkMode: boolean
  ) => {
    const day = new Date(
      new Date(props.startTime).getFullYear(),
      new Date(props.startTime).getMonth(),
      index + 1
    ).getDay();
    if (day === 0 || day === 6) {
      if (!isDarkMode) {
        return {
          backgroundColor: "primary.light",
          color: "white",
          minHeight: 80,
        };
      } else {
        return {
          backgroundColor: "#3d3d3d",
          color: "white",
          minHeight: 80,
        };
      }
    } else {
      return { minHeight: 80 };
    }
  };

  const getItemsByDate = (date: number): CalendarItem[] => {
    const getItems = items.filter(
      (i) => new Date(i.date).toDateString() === new Date(date).toDateString()
    );
    return getItems;
  };

  return (
    <Box sx={{ margin: 2, marginTop: { xs: 9, sm: 10 }, marginBottom: 10 }}>
      <Card sx={{ width: { xs: "100%", md: 600 }, padding: 1 }}>
        <List>
          {[...Array(new Date(lastDayOfMonth).getDate())].map((day, index) => (
            <ListItem
              key={index}
              divider
              sx={getBackgroundCalendarItemColor(index, props.isDarkMode)}
            >
              <Stack direction={"row"} spacing={1}>
                <Typography sx={{ width: 30 }}>
                  {
                    dayNames[
                      new Date(
                        new Date(props.startTime).getFullYear(),
                        new Date(props.startTime).getMonth(),
                        index + 1
                      ).getDay()
                    ]
                  }
                </Typography>
                <Typography sx={{ width: 20, marginRight: 1 }}>
                  {index + 1}
                </Typography>
                <Box gap={1} sx={{ display: "flex", flexWrap: "wrap" }}>
                  {getItemsByDate(
                    new Date(
                      new Date(props.startTime).getFullYear(),
                      new Date(props.startTime).getMonth(),
                      index + 1
                    ).getTime()
                  ).map((item) => (
                    <Chip
                      key={item.id}
                      label={
                        item.medication +
                        " | " +
                        new Date(item.date).toTimeString().slice(0, 5)
                      }
                      onDelete={() => removeItem(item.id)}
                    />
                  ))}
                </Box>
              </Stack>
            </ListItem>
          ))}
        </List>
      </Card>
    </Box>
  );
};
