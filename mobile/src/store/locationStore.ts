import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Location } from '../types';

type LocationStoreState = {
  location: Location | null;
  setLocation: (location: Location) => void;
};

export const useLocationStore = create<LocationStoreState>()(
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
