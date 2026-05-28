// Anti-flash: applies the saved/system theme before React mounts.
// Kept as a separate file (served with the same origin) so the strict CSP
// in index.html does not need 'unsafe-inline' for <script>.
(function () {
  try {
    var saved = localStorage.getItem("narrative-theme");
    var system = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    var resolved = saved === "dark" || saved === "light" ? saved : system;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  } catch (e) {
    // Private mode / disabled storage — fall back to CSS default.
  }
})();
