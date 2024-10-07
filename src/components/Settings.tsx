import {
  Add,
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
import { useState } from "react";
import { useCalendarStore } from "../stores/calendarStore";
import { auth, provider } from "../Firebase/config";
import { signInWithPopup, signOut } from "firebase/auth";
// import { saveData, loadData } from "../Firebase/sync";
import { useFirebase, SyncData } from "../hooks/useFirebase";

interface SettingsProps {
  mode: string;
  handleMode: (value: string) => void;
}

export const Settings = (props: SettingsProps) => {
  const { saveData, loadData } = useFirebase();

  const {
    reset: resetSettings,
    addMedication,
    removeMedication,
    getUser,
    setUser,
    medications,
  } = useSettingsStore();
  const { reset: resetCalendar } = useCalendarStore();
  const [medicationName, setMedicationName] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

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

  const handleSignIn = async () => {
    try {
      const data = await signInWithPopup(auth, provider);
      setUser(data.user.uid);
    } catch {}
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      // auth.signOut();
      setUser(null);
    } catch {}
  };

  const handleSaveDate = async () => {
    const result = await saveData();
    if (result) {
      setSnackMessage("Daten erfolgreich gespeichert.");
      setSnackOpen(true);
    } else {
      setSnackMessage("Fehler beim Speichern der Daten.");
      setSnackOpen(true);
    }
  };

  const handleLoadDate = async () => {
    const result: SyncData | null = await loadData();
    if (result !== null) {
      props.handleMode(result.settings.mode);
    }

    if (result !== null) {
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
            title="Daten syncronisieren"
            subheader="Einstellungen und Kalendereinträge mit Google Firebase synchronisieren."
          />
          <CardContent>
            {getUser() === "" ? (
              <ListItem>
                <Button
                  onClick={handleSignIn}
                  variant="contained"
                  startIcon={<Google />}
                >
                  Login
                </Button>
              </ListItem>
            ) : (
              <>
                <ListItem>
                  <Typography>{auth.currentUser?.email}</Typography>
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
                    onClick={handleSignOut}
                  >
                    Logout
                  </Button>
                </ListItem>
              </>
            )}
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ margin: 2 }}>
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
    </>
  );
};
