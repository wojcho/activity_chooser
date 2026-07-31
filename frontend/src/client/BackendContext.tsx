import {
  createContext,
  useContext,
} from "react";
import type BackendClient from "./backend-client";

const BackendContext = createContext<BackendClient | null>(null);

export function BackendProvider({
  client,
  children,
}: {
  client: BackendClient;
  children: React.ReactNode;
}) {
  return (
    <BackendContext.Provider value={client}>
      {children}
    </BackendContext.Provider>
  );
}

export function useBackend() {
  const client = useContext(BackendContext);

  if (!client) {
    throw new Error(
      "useBackend must be used inside BackendProvider",
    );
  }

  return client;
}
