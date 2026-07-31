import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import BackendClient from "./client/backend-client.ts";
import { BackendProvider } from "./client/BackendContext.tsx";

const backend = new BackendClient("http://localhost:3000");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BackendProvider client={backend}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BackendProvider>
  </StrictMode>,
);
