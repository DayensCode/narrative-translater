import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { i18nReady } from "./i18n";
import "./index.css";
import App from "./App.tsx";

// Service worker registration is owned by <UpdateBanner>, which uses
// `registerType: "prompt"` so users explicitly consent to replacing the
// installed SW (protects installed clients from a compromised build).

// Ask for persistent storage so the browser keeps our ~1.5 GB of model
// weights across eviction cycles. Fire-and-forget — users can decline.
if (navigator.storage?.persist) {
  void navigator.storage.persist().catch(() => {});
}

const rootElement = document.getElementById("root")!;

function mount() {
  createRoot(rootElement).render(
    <StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </StrictMode>,
  );
}

// If locale loading hangs (rare, but possible on restricted storage), we
// still want React to mount so the user sees the UI instead of a blank page.
const bootstrapRace = Promise.race([
  i18nReady,
  new Promise<void>((resolve) => window.setTimeout(resolve, 3_000)),
]);
void bootstrapRace.catch(() => {}).then(mount);
