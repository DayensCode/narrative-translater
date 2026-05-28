/**
 * Removes every piece of state the app stores on-device:
 *  - localStorage / sessionStorage
 *  - Cache Storage (app shell + HF model cache)
 *  - IndexedDB databases (transformers.js stores weights here on some
 *    browsers; be defensive)
 *  - Service worker registrations
 *
 * Best-effort: individual steps swallow errors so a single failing API
 * does not abort the whole wipe. The caller is expected to reload the
 * page once this resolves.
 */
export async function wipeLocalData(): Promise<void> {
  try {
    window.localStorage.clear();
  } catch {
    // ignore
  }
  try {
    window.sessionStorage.clear();
  } catch {
    // ignore
  }

  if (typeof caches !== "undefined") {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch {
      // ignore
    }
  }

  const idb = (indexedDB as unknown as {
    databases?: () => Promise<Array<{ name?: string }>>;
  }).databases;
  if (typeof idb === "function") {
    try {
      const dbs = await idb.call(indexedDB);
      await Promise.all(
        dbs
          .map((d) => d.name)
          .filter((name): name is string => Boolean(name))
          .map(
            (name) =>
              new Promise<void>((resolve) => {
                const req = indexedDB.deleteDatabase(name);
                req.onsuccess = () => resolve();
                req.onerror = () => resolve();
                req.onblocked = () => resolve();
              }),
          ),
      );
    } catch {
      // ignore — older browsers without indexedDB.databases()
    }
  }

  if (navigator.serviceWorker?.getRegistrations) {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    } catch {
      // ignore
    }
  }
}
