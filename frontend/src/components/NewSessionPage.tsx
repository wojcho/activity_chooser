import { Link, useParams } from "react-router";

export default function NewSessionPage() {
  const { sessionId, aUserToken, bUserToken } = useParams();

  const aLink = `/session/${sessionId}/${aUserToken}`;
  const bLink = `/session/${sessionId}/${bUserToken}`;

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(
      `${window.location.origin}${text}`
    );
  };

  return (
    <section id="center">
      <h1>New Session</h1>

      <h2>Link for User A</h2>
      <p>
        <Link to={aLink}>{aLink}</Link>{" "}
        <button onClick={() => void copy(aLink)}>Copy</button>
      </p>

      <h2>Link for User B</h2>
      <p>
        <Link to={bLink}>{bLink}</Link>{" "}
        <button onClick={() => void copy(bLink)}>Copy</button>
      </p>
    </section>
  );
}
