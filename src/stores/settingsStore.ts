import { v4 } from "uuid";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Medication {
  id: string;
  name: string;
}

export interface SettingsState {
  user: string;
  mode: string;
  medications: Medication[];
}

export interface SettingsActions {
  setMedications: (value: Medication[]) => void;
  addMedication: (name: string) => void;
  removeMedication: (id: string) => void;
  setUser: (value: string | null) => void;
  getUser: () => string;
  setMode: (value: string) => void;
  getMode: () => string;
  reset: () => void;
}

// define the initial state
const initialState: SettingsState = {
  user: "",
  mode: "auto",
  medications: [],
};

// create store
export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setMedications: (value: Medication[]) => {
        set({ medications: value });
      },

      addMedication: (name: string) => {
        const { medications } = get();
        const newMedications = [...medications, { id: v4(), name: name }];
        set({ medications: newMedications });
      },

      removeMedication: (id: string) => {
        const { medications } = get();
        const newMedications = medications.filter(
          (medication) => medication.id !== id
        );
        set({ medications: newMedications });
      },

      setUser: (value: string | null) => {
        var newUser = "";
        if (value !== null) {
          newUser = value;
        }
        set({ user: newUser });
      },

      getUser: () => {
        const { user } = get();
        return user;
      },

      setMode: (value: string) => {
        set({ mode: value });
      },

      getMode: () => {
        const { mode } = get();
        return mode;
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "takepills-settings-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
