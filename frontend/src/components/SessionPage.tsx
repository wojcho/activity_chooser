import { useParams } from "react-router";

export default function SessionPage() {
  const { sessionId, userToken } = useParams();

  return (
    <section id="center">
      <h1>Session</h1>
      <p>ID: {sessionId}</p>
      <p>Token: {userToken}</p>
    </section>
  );
}
