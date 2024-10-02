import {
  Add,
  Contrast,
  DarkMode,
  Delete,
  LightMode,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useSettingsStore } from "../stores/settingsStore";
import { useState } from "react";
import { useCalendarStore } from "../stores/calendarStore";

interface SettingsProps {
  mode: string;
  handleMode: (value: string) => void;
}

export const Settings = (props: SettingsProps) => {
  const {
    reset: resetSettings,
    addMedication,
    removeMedication,
    medications,
  } = useSettingsStore();
  const { reset: resetCalendar } = useCalendarStore();
  const [medicationName, setMedicationName] = useState("");

  const handleChangeMedicationName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMedicationName(event.target.value);
  };

  const handleChangeMode = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    if (newAlignment !== null) {
      props.handleMode(newAlignment);
    }
  };

  return (
    <>
      <Box sx={{ margin: 2, marginTop: { xs: 9, sm: 10 } }}>
        <Card sx={{ width: { xs: "100%", md: 600 }, padding: 1 }}>
          <CardHeader
            sx={{ color: "primary.main" }}
            title="Mode"
            subheader="Displaymodus ändern"
          />
          <CardContent>
            <List>
              <ListItem>
                <ToggleButtonGroup
                  color="primary"
                  value={props.mode}
                  exclusive
                  onChange={handleChangeMode}
                  aria-label="Display Modus"
                >
                  <ToggleButton value="auto">
                    <Contrast sx={{ marginRight: 1 }} />
                    Auto
                  </ToggleButton>
                  <ToggleButton value="light">
                    <LightMode sx={{ marginRight: 1 }} /> Light
                  </ToggleButton>
                  <ToggleButton value="dark">
                    <DarkMode sx={{ marginRight: 1 }} /> Dark
                  </ToggleButton>
                </ToggleButtonGroup>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ margin: 2 }}>
        <Card sx={{ width: { xs: "100%", md: 600 }, padding: 1 }}>
          <CardHeader
            sx={{ color: "primary.main" }}
            title="Daten löschen"
            subheader="Alle Daten unwiederbringlich löschen."
          />
          <CardContent>
            <List>
              <ListItem>
                <ListItemText primary="Einstellungen" />
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => resetSettings()}
                >
                  Löschen
                </Button>
              </ListItem>
              <ListItem>
                <ListItemText primary="Kalender" />
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => resetCalendar()}
                >
                  Löschen
                </Button>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ margin: 2, marginBottom: 10 }}>
        <Card sx={{ width: { xs: "100%", md: 600 }, padding: 1 }}>
          <CardHeader
            sx={{ color: "primary.main" }}
            title="Medikamente"
            subheader="Welche Medikamente nimmst du ein?"
          />
          <CardContent>
            <List>
              <ListItem>
                <TextField
                  id="outlined-basic"
                  label="Medikament"
                  variant="outlined"
                  sx={{ flexGrow: 1, marginRight: 2 }}
                  value={medicationName}
                  onChange={handleChangeMedicationName}
                />
                <Button
                  onClick={() => {
                    addMedication(medicationName);
                    setMedicationName("");
                  }}
                  startIcon={<Add />}
                >
                  Hinzufügen
                </Button>
              </ListItem>
            </List>

            <Box sx={{ height: "20vh", overflow: "auto" }}>
              <List>
                {medications.map((medication) => (
                  <ListItem key={medication.id} divider>
                    <ListItemText
                      sx={{ flexGrow: 1 }}
                      primary={medication.name}
                    />
                    <Button
                      onClick={() => removeMedication(medication.id)}
                      startIcon={<Delete />}
                    >
                      Entfernen
                    </Button>
                    {/* <Divider variant="middle" /> */}
                  </ListItem>
                ))}
              </List>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};
