import { useDistanceStore } from '../../store/distanceStore';
import { SettingsUI } from './SettingsUI';

export function SettingsScreen() {
  const distanceMeters = useDistanceStore((state) => state.distanceMeters);
  const setDistanceMeters = useDistanceStore((state) => state.setDistanceMeters);

  function handleDistanceKmChange(km: number) {
    setDistanceMeters(Math.round(km * 1000));
  }

  return <SettingsUI distanceKm={distanceMeters / 1000} onDistanceKmChange={handleDistanceKmChange} />;
}
