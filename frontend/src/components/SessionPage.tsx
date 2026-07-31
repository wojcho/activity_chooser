import { useParams } from "react-router";
import { useBackend } from "../client/BackendContext";
import { useState } from "react";
import type { ApplicationData, RawActivity } from "../model/application-data";

export default function SessionPage() {
  const { sessionId, userToken } = useParams();
  const backend = useBackend();

  const [applicationData, setApplicationData] = useState<ApplicationData>();
  const [acceptedTokens, setAcceptedTokens] = useState<string[]>();
  const [filteredActivities, setFilteredActivities] = useState<RawActivity[] | null>();
  const [chosenActivity, setChosenActivity] = useState<RawActivity | null>();

  // TODO
  // At the beginning when component loads:
  // fetch applicationData by using await backend.raw.getRawData()
  // and
  // fetch session state by using await backend.sessions.getSession(sessionId)
  // export interface SessionResponse {
  //   acceptedTokens: string[];
  //   filteredActivities: RawActivity[] | null;
  //   chosenActivity: RawActivity | null;
  // }

  return (
    <section id="center">
      <h1>Session</h1>
      <p>ID: {sessionId}</p>
      <p>Token: {userToken}</p>
    </section>
  );
}
