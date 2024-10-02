import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useSettingsStore } from "../stores/settingsStore";
import { useCalendarStore, CalendarItem } from "../stores/calendarStore";
import { useState } from "react";
import { v4 } from "uuid";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import "dayjs/locale/de";
import dayjs, { Dayjs } from "dayjs";

export const Add = () => {
  const [value, setValue] = useState<Dayjs | null>(
    dayjs(new Date(Date.now()).toUTCString())
  );

  const { medications } = useSettingsStore();
  const { addItems } = useCalendarStore();

  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const toggleSelectedMedications = (id: string) => {
    const findID = selectedMedications.filter((e) => e === id);
    if (findID.length === 0) {
      const newSelectedMedications = [...selectedMedications, id];
      setSelectedMedications(newSelectedMedications);
    } else {
      const newSelectedMedications = selectedMedications.filter(
        (e) => e !== id
      );
      setSelectedMedications(newSelectedMedications);
    }
  };

  const saveMedications = () => {
    const time =
      value === null ? Date.now() : new Date(value.toISOString()).getTime();

    const medicationsToSave = selectedMedications.map(
      (medication): CalendarItem => {
        return {
          id: v4(),
          date: time,
          medication: medication,
        };
      }
    );
    addItems(medicationsToSave);
    setSelectedMedications([]);
    setValue(dayjs(new Date(Date.now()).toUTCString()));
  };

  return (
    <Box sx={{ margin: 2, marginTop: { xs: 9, sm: 10 }, marginBottom: 15 }}>
      <Card sx={{ marginBottom: 2, width: { xs: "100%", md: 600 } }}>
        <CardHeader
          title="Medikamente"
          subheader="Eingenommene Medikamente auswählen"
          sx={{ color: "primary.main" }}
        />
        <CardContent>
          <List sx={{ height: "20vh" }}>
            {medications.map((medication) => (
              <ListItemButton
                key={medication.id}
                onClick={() => toggleSelectedMedications(medication.name)}
                divider
                selected={
                  selectedMedications.filter((e) => e === medication.name)
                    .length === 1
                }
              >
                <ListItemText primary={medication.name} />
              </ListItemButton>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card sx={{ marginBottom: 2, width: { xs: "100%", md: 600 } }}>
        <CardHeader
          title="Zeit"
          subheader="Wann hast du deine Medikamente eingenommen?"
          sx={{ color: "primary.main" }}
        />
        <CardContent>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
            <DemoContainer components={["DateTimePicker"]}>
              <DateTimePicker
                defaultValue={dayjs(new Date(Date.now()).toUTCString())}
                value={value}
                onChange={(newValue) => setValue(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
        </CardContent>
      </Card>
      <Button
        color="primary"
        variant="contained"
        disabled={
          selectedMedications.length === 0 || value === null ? true : false
        }
        onClick={() => saveMedications()}
      >
        Speichern
      </Button>
    </Box>
  );
};
