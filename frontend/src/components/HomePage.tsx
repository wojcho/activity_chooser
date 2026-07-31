import { useBackend } from "../client/BackendContext";

export default function HomePage() {
  const backend = useBackend();

  // TODO create a button which runs that
  // await backend.sessions.createSession();
  // then gets output which matches interface CreateSessionResponse
  // export interface CreateSessionResponse {
  //   sessionId: string;
  //   aToken: string;
  //   bToken: string;
  // }
  // then redirect using React Router to
  // /new-session/:sessionId/:aUserToken/:bUserToken

  return (
    <section id="center">
      <h1>Main page</h1>
      <p>Welcome!</p>
    </section>
  );
}
