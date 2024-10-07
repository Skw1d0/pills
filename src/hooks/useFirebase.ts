import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../Firebase/config";
import { useSettingsStore } from "../stores/settingsStore";
import { useCalendarStore } from "../stores/calendarStore";

export interface SettingsDate {
  medications: Object;
  mode: string;
}

export interface SyncData {
  settings: SettingsDate;
  calendar: Object[];
}

export const useFirebase = () => {
  const { items, setItems } = useCalendarStore();
  const { medications, mode, setMedications, setMode } = useSettingsStore();

  const saveData = async (): Promise<boolean> => {
    const newData: SyncData = {
      settings: { medications: medications, mode: mode },
      calendar: items,
    };

    if (auth.currentUser?.uid === undefined) return false;

    try {
      const userDocRef = doc(db, "users", auth.currentUser?.uid);
      await setDoc(userDocRef, newData);
      // console.log("Document written with ID: ", userDocRef.id);
      return true;
    } catch (e) {
      // console.error("Error adding document: ", e);
      return false;
    }
  };

  const loadData = async (): Promise<SyncData | null> => {
    if (auth.currentUser?.uid === undefined) return null;

    try {
      const userDocRef = doc(db, "users", auth.currentUser?.uid);
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        const firestoreState = docSnapshot.data();
        // console.log("Lade Zustand: ", firestoreState);
        setMedications(firestoreState.settings.medications);
        setMode(firestoreState.settings.mode);
        setItems(firestoreState.calendar);
        return {
          calendar: firestoreState.calendar,
          settings: firestoreState.settings,
        };
      } else {
        // console.log("Keine Daten vorhanden.");
        return null;
      }
    } catch (e) {
      // console.error("Error adding document: ", e);
      return null;
    }
  };

  return { saveData, loadData };
};
