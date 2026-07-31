import { useParams } from "react-router";
import { useBackend } from "../client/BackendContext";

export default function SessionPage() {
  const { sessionId, userToken } = useParams();
  const backend = useBackend();

  return (
    <section id="center">
      <h1>Session</h1>
      <p>ID: {sessionId}</p>
      <p>Token: {userToken}</p>
    </section>
  );
}
