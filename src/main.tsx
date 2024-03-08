import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MudaeProvider } from "@/hooks/mudaeProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MudaeProvider>
    <App />
  </MudaeProvider>
);
