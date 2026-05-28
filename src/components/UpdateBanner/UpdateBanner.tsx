import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { registerSW } from "virtual:pwa-register";
import styles from "./styles.module.css";

/**
 * Explicit SW update prompt. We deliberately do not auto-apply updates
 * (see vite.config.ts: registerType: "prompt") so a compromised build can
 * not silently replace the SW on every installed client — the user has to
 * consent.
 */
export function UpdateBanner() {
  const { t } = useTranslation();
  const [updateReady, setUpdateReady] = useState(false);
  const applyUpdateRef = useRef<((reload?: boolean) => Promise<void>) | null>(
    null,
  );

  useEffect(() => {
    let disposed = false;
    try {
      const update = registerSW({
        onNeedRefresh() {
          if (disposed) return;
          setUpdateReady(true);
        },
      });
      applyUpdateRef.current = update;
    } catch (err) {
      console.warn("Service worker registration failed:", err);
    }
    return () => {
      disposed = true;
    };
  }, []);

  if (!updateReady) return null;

  return (
    <div className={styles.banner} role="status" aria-live="polite">
      <span className={styles.bannerLabel}>
        {t("updateAvailableTitle", {
          defaultValue: "A new version is available",
        })}
      </span>
      <div className={styles.bannerActions}>
        <button
          type="button"
          className={styles.bannerGhost}
          onClick={() => setUpdateReady(false)}
        >
          {t("updateAvailableLater", { defaultValue: "Later" })}
        </button>
        <button
          type="button"
          className={styles.bannerPrimary}
          onClick={() => {
            const apply = applyUpdateRef.current;
            if (apply) void apply(true);
          }}
        >
          {t("updateAvailableAction", { defaultValue: "Reload" })}
        </button>
      </div>
    </div>
  );
}
