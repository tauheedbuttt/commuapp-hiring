import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const DEFAULT_DISTANCE_METERS = 15000;

type SettingsStoreState = {
  distance: number;
  setDistance: (distance: number) => void;
};

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set) => ({
      distance: DEFAULT_DISTANCE_METERS,
      setDistance: (distance) => set({ distance }),
    }),
    {
      name: 'commu-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
