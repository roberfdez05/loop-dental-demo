import { useEffect } from "react";

/** Ejecuta `onExpire` una vez, `ms` después de que `active` se vuelva true. */
export function useClearFlagAfter(active: boolean, ms: number, onExpire: () => void) {
  useEffect(() => {
    if (!active) return;
    const timeout = setTimeout(onExpire, ms);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, ms]);
}
