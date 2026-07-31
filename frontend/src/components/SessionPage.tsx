import { useParams } from "react-router";
import { useBackend } from "../client/BackendContext";
import { useState } from "react";
import type { ApplicationData } from "../model/application-data";

export default function SessionPage() {
  const { sessionId, userToken } = useParams();
  const backend = useBackend();

  const [applicationData, setApplicationData] = useState<ApplicationData>();
  const [sessionState, setSessionState] = useState<SessionState>();
  const [filteredActivities, setFilteredActivities] = useState<RawActivity[] | null>();
  const [chosenActivity, setChosenActivity] = useState<RawActivity | null>();

  return (
    <section id="center">
      <h1>Session</h1>
      <p>ID: {sessionId}</p>
      <p>Token: {userToken}</p>
    </section>
  );
}
