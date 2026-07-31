import type { RawActivity } from "../model/application-data";

type Props = {
  filteredActivities: RawActivity[] | null | undefined;
  chosenActivity: RawActivity | null | undefined;
};

export default function SessionResults({
  filteredActivities,
  chosenActivity,
}: Props) {
  return (
    <section id="center">
      <h1>Available activities</h1>

      <ul>
        {filteredActivities?.map(activity => (
          <li key={activity.id}>
            {activity.description}
          </li>
        ))}
      </ul>

      {chosenActivity && (
        <>
          <h2>Chosen activity</h2>

          <p>{chosenActivity.description}</p>
        </>
      )}
    </section>
  );
}
