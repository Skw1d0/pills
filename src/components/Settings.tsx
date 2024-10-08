import {
  Add,
  CloudDownload,
  CloudUpload,
  Contrast,
  DarkMode,
  Delete,
  Google,
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
  Snackbar,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useSettingsStore } from "../stores/settingsStore";
import { useEffect, useState } from "react";
import { useCalendarStore } from "../stores/calendarStore";
import { useFirestore, SyncData } from "../hooks/useFirestore";
import { useAuth } from "../context/AuthContext";

interface SettingsProps {
  mode: string;
  handleMode: (value: string) => void;
}

export const Settings = (props: SettingsProps) => {
  const { saveStoresToFirestore, loadDataFromFirestore } = useFirestore();
  const { user, googleSignIn, googleSignOut } = useAuth();
  const {
    reset: resetSettings,
    addMedication,
    setMedications,
    removeMedication,
    setMode,
    medications,
  } = useSettingsStore();
  const { reset: resetCalendar, setItems } = useCalendarStore();
  const [medicationName, setMedicationName] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [syncTime, setSyncTime] = useState<number | undefined>(undefined);

  const days = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  useEffect(() => {
    const getData = async () => {
      const data = await loadDataFromFirestore();
      setSyncTime(data?.syncTime);
    };

    getData();
  }, []);

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

  const handleCloseSnackBar = () => {
    setSnackOpen(false);
  };

  const handleSaveDate = async () => {
    const result = await saveStoresToFirestore();
    if (result) {
      setSnackMessage("Daten erfolgreich gespeichert.");
      setSnackOpen(true);
      setSyncTime(Date.now());
    } else {
      setSnackMessage("Fehler beim Speichern der Daten.");
      setSnackOpen(true);
    }
  };

  const handleLoadDate = async () => {
    const result: SyncData | null = await loadDataFromFirestore();
    if (result !== null) {
      props.handleMode(result.settings.mode);

      setMode(result.settings.mode);
      setMedications(result.settings.medications);
      setItems(result.calendar);

      setSnackMessage("Daten erfolgreich geladen.");
      setSnackOpen(true);
    } else {
      setSnackMessage("Fehler beim Laden der Daten.");
      setSnackOpen(true);
    }
  };

  return (
    <>
      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackBar}
        message={snackMessage}
      />
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
                  disabled={medicationName === "" ? true : false}
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

      <Box sx={{ margin: 2 }}>
        <Card sx={{ width: { xs: "100%", md: 600 }, padding: 1 }}>
          <CardHeader
            sx={{ color: "primary.main" }}
            title="Daten syncronisieren"
            subheader="Einstellungen und Kalendereinträge mit Google Firebase synchronisieren."
          />
          <CardContent>
            {user?.uid === undefined ? (
              <ListItem>
                <Button
                  onClick={googleSignIn}
                  variant="contained"
                  startIcon={<Google />}
                >
                  Anmelden mit Google
                </Button>
              </ListItem>
            ) : (
              <>
                <ListItem>
                  <ListItemText>{user?.email}</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    Letzter Speicherstand: <br />
                    {syncTime !== undefined
                      ? days[new Date(syncTime).getDay()] +
                        ", " +
                        new Date(syncTime).toLocaleString() +
                        " Uhr"
                      : ""}
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginRight: 1 }}
                    onClick={handleSaveDate}
                  >
                    Speichern
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginRight: 1 }}
                    onClick={handleLoadDate}
                  >
                    Laden
                  </Button>
                  <Typography sx={{ flexGrow: 1 }}></Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Google />}
                    onClick={googleSignOut}
                  >
                    Abmelden
                  </Button>
                </ListItem>
              </>
            )}
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ margin: 2, marginBottom: 10 }}>
        <Card sx={{ width: { xs: "100%", md: 600 }, padding: 1 }}>
          <CardHeader
            sx={{ color: "primary.main" }}
            title="Lokale Daten löschen"
            subheader="Alle lokalen Daten unwiederbringlich löschen."
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
    </>
  );
};
