import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useSettingsStore, Medication } from "../stores/settingsStore";
import { useCalendarStore, CalendarItem } from "../stores/calendarStore";

export interface SettingsData {
  mode: string;
  medications: Medication[];
}

export interface SyncData {
  syncTime: number | undefined;
  settings: SettingsData;
  calendar: CalendarItem[];
}

export const useFirestore = () => {
  const { items, setItems } = useCalendarStore();
  const { medications, mode, setMedications, setMode } = useSettingsStore();

  const saveStoresToFirestore = async (): Promise<boolean> => {
    const newData: SyncData = {
      syncTime: Date.now(),
      settings: { medications: medications, mode: mode },
      calendar: items,
    };

    if (auth.currentUser?.uid === undefined) return false;

    try {
      const userDocRef = doc(db, "users", auth.currentUser?.uid);
      await setDoc(userDocRef, newData);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const loadDataFromFirestore = async (): Promise<SyncData | null> => {
    if (auth.currentUser?.uid === undefined) return null;

    try {
      const userDocRef = doc(db, "users", auth.currentUser?.uid);
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        const firestoreState = docSnapshot.data();
        return {
          syncTime: firestoreState.syncTime,
          settings: firestoreState.settings,
          calendar: firestoreState.calendar,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return {
    saveStoresToFirestore,
    loadDataFromFirestore,
  };
};
