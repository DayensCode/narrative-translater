import styles from "./styles.module.css";

type LoaderProps = {
  label: string;
};

export function Loader({ label }: LoaderProps) {
  return (
    <main className={styles.loaderShell}>
      <div className={styles.loaderCard} role="status" aria-live="polite">
        <span className={styles.loaderSpinner} aria-hidden="true" />
        <p className={styles.loaderLabel}>{label}</p>
      </div>
    </main>
  );
}
