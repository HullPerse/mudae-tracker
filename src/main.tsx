import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { MudaeProvider } from "@/components/providers/userProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MudaeProvider>
      <App />
    </MudaeProvider>
  </React.StrictMode>
);
