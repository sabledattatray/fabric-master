import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

// React owns metadata after mounting; retain prerendered metadata when JS is disabled.
document
  .querySelectorAll("[data-app-seo]")
  .forEach((element) => element.remove());
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
