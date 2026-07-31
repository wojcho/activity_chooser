type Props = {
  acceptedCount: number;
};

export default function WaitingForParticipant({
  acceptedCount,
}: Props) {
  return (
    <section id="center">
      <h1>Waiting...</h1>

      <p>
        Waiting for the other participant to accept.
      </p>

      <p>
        Accepted: {acceptedCount} / 2
      </p>
    </section>
  );
}
