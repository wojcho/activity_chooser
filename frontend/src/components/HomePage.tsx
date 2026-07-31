import { useNavigate } from "react-router";
import { useBackend } from "../client/BackendContext";

export default function HomePage() {
  const backend = useBackend();
  const navigate = useNavigate();

  const handleCreateSession = async () => {
    const { sessionId, aToken, bToken } = await backend.sessions.createSession();

    navigate(`/new-session/${sessionId}/${aToken}/${bToken}`);
  };

  return (
    <section id="center">
      <h1>Main page</h1>
      <p>Welcome!</p>

      <button onClick={handleCreateSession}>
        Create New Session
      </button>
    </section>
  );
}
