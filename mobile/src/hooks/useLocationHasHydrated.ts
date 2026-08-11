import { useEffect, useState } from 'react';
import { useLocationStore } from '../store/locationStore';

/** True once the persisted location has been read back from AsyncStorage. */
export function useLocationHasHydrated() {
  const [hasHydrated, setHasHydrated] = useState(useLocationStore.persist.hasHydrated());

  useEffect(() => useLocationStore.persist.onFinishHydration(() => setHasHydrated(true)), []);

  return hasHydrated;
}
