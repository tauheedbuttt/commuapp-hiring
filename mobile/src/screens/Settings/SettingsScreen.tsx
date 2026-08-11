import { useSettingsStore } from '../../store/settingsStore';
import { SettingsUI } from './SettingsUI';

export function SettingsScreen() {
  const distance = useSettingsStore((state) => state.distance);
  const setDistance = useSettingsStore((state) => state.setDistance);

  function handleDistanceKmChange(km: number) {
    setDistance(Math.round(km * 1000));
  }

  return <SettingsUI distanceKm={distance / 1000} onDistanceKmChange={handleDistanceKmChange} />;
}
