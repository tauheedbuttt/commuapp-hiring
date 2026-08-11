import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type SavedLocation = {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
};

type LocationStore = {
  location: SavedLocation | null;
  setLocation: (location: SavedLocation) => void;
};

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      location: null,
      setLocation: (location) => set({ location }),
    }),
    {
      name: 'commu-location',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
