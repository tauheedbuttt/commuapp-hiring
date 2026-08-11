import { useLocationStore } from '../../store/locationStore';
import { HomeUI } from './HomeUI';

export function HomeScreen() {
  const location = useLocationStore((state) => state.location);

  return <HomeUI location={location} />;
}
