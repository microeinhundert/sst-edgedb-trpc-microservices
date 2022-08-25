import "./assets/app.css";
import "@aws-amplify/ui-react/styles.css";

import { Auth } from "@aws-amplify/auth";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { awsConfig } from "./utils/aws";

Auth.configure(awsConfig);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
