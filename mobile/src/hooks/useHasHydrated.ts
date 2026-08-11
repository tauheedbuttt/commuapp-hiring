import { useEffect, useState } from 'react';

type PersistCapableStore = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (listener: () => void) => () => void;
  };
};

/** True once `store`'s persisted state has been read back from AsyncStorage. */
export function useHasHydrated(store: PersistCapableStore) {
  const [hasHydrated, setHasHydrated] = useState(store.persist.hasHydrated());

  useEffect(() => store.persist.onFinishHydration(() => setHasHydrated(true)), [store]);

  return hasHydrated;
}
