import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import { html } from "./lib/html.js";

createRoot(document.getElementById("root")).render(html`<${StrictMode}><${App} /><//>`);
