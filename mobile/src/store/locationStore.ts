import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { LocationStoreState } from '../types';

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
