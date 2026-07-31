import { useParams } from "react-router";

export default function NewSessionPage() {
  const { sessionId, aUserToken, bUserToken } = useParams();

  return (
    <section id="center">
      <h1>NewSession</h1>
      <p>ID: {sessionId}</p>
      <p>Token of user A: {aUserToken}</p>
      <p>Token of user B: {bUserToken}</p>
    </section>
  );
}
