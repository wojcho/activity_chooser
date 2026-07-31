import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import BackendClient from "./client/backend-client.ts";
import { BackendProvider } from "./client/BackendContext.tsx";

import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";

const theme = createTheme({
  primaryColor: "cyan",
});

const backend = new BackendClient("http://localhost:3000");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Notifications />
      <BackendProvider client={backend}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </BackendProvider>
    </MantineProvider>
  </StrictMode>,
);
