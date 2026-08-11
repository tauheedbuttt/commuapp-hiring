import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const DEFAULT_DISTANCE_METERS = 15000;

type DistanceStoreState = {
  distanceMeters: number;
  setDistanceMeters: (distanceMeters: number) => void;
};

export const useDistanceStore = create<DistanceStoreState>()(
  persist(
    (set) => ({
      distanceMeters: DEFAULT_DISTANCE_METERS,
      setDistanceMeters: (distanceMeters) => set({ distanceMeters }),
    }),
    {
      name: 'commu-distance',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
