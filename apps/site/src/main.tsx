import "./assets/app.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DataBrowserRouter, Route } from "react-router-dom";

import App from "./App";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <DataBrowserRouter>
      <Route path="/" element={<App />} />
    </DataBrowserRouter>
  </StrictMode>
);
