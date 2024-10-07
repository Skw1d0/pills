import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CalendarItem {
  id: string;
  date: number;
  medication: string;
}

export interface CalendarState {
  items: CalendarItem[];
}

export interface CalendarActions {
  setItems: (values: CalendarItem[]) => void;
  addItems: (values: CalendarItem[]) => void;
  removeItem: (id: string) => void;
  reset: () => void;
}

// define the initial state
const initialState: CalendarState = {
  items: [],
};

export const useCalendarStore = create<CalendarState & CalendarActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setItems: (values: CalendarItem[]) => {
        set({ items: values });
      },

      addItems: (values: CalendarItem[]) => {
        const { items } = get();
        // const newItems = [
        //   ...items,
        //   { id: v4(), date: date, medication: medication },
        // ];
        const newItems = items.concat(values);

        set({ items: newItems });
      },

      removeItem: (id: string) => {
        const { items } = get();
        const newItems = items.filter((item) => item.id !== id);
        set({ items: newItems });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "takepills-calendar-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
