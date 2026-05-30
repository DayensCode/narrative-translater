import { useTranslation } from "react-i18next";
import styles from "./MobileBlock.module.css";

export function MobileBlock() {
  const { t } = useTranslation();
  return (
    <div className={styles.overlay} role="alert" aria-live="assertive">
      <div className={styles.card}>
        <span className={styles.icon} aria-hidden="true">🖥️</span>
        <h1 className={styles.title}>{t("mobileBlockTitle")}</h1>
        <p className={styles.body}>{t("mobileBlockBody")}</p>
      </div>
    </div>
  );
}
