import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useBackend } from "../client/BackendContext";
import type { ApplicationData, RawActivity } from "../model/application-data";

export default function SessionPage() {
  const { sessionId, userToken } = useParams();
  const backend = useBackend();

  const [applicationData, setApplicationData] = useState<ApplicationData>();
  const [acceptedTokens, setAcceptedTokens] = useState<string[]>();
  const [filteredActivities, setFilteredActivities] = useState<RawActivity[] | null>();
  const [chosenActivity, setChosenActivity] = useState<RawActivity | null>();

  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    async function load() {
      try {
        const [applicationData, session] = await Promise.all([
          backend.raw.getRawData(),
          backend.sessions.getSession(sessionId),
        ]);

        setApplicationData(applicationData);
        setAcceptedTokens(session.acceptedTokens);
        setFilteredActivities(session.filteredActivities);
        setChosenActivity(session.chosenActivity);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, [backend, sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    return backend.sessions.subscribe(
      sessionId,
      event => {
        setAcceptedTokens(event.acceptedTokens);
      },
    );
  }, [backend, sessionId]);

  // When acceptedTokens changes to have 2 tokens, then fetch filteredActivities, chosenActivity
  useEffect(() => {
    if (!sessionId) return;
    if (acceptedTokens?.length !== 2) return;

    async function loadResults() {
      try {
        const session = await backend.sessions.getSession(sessionId);

        setFilteredActivities(session.filteredActivities);
        setChosenActivity(session.chosenActivity);
      } catch (err) {
        console.error(err);
      }
    }

    loadResults();
  }, [backend, sessionId, acceptedTokens]);

  async function accept() {
    if (!sessionId || !userToken) return;

    try {
      setIsSubmitting(true);

      const response = await backend.sessions.accept(
        sessionId,
        userToken,
        [...selectedTags],
      );

      setAcceptedTokens(response.acceptedTokens);

      const session = await backend.sessions.getSession(sessionId);

      setFilteredActivities(session.filteredActivities);
      setChosenActivity(session.chosenActivity);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  function toggleTag(tagId: string) {
    setSelectedTags(previous => {
      const next = new Set(previous);

      if (next.has(tagId)) {
        next.delete(tagId);
      } else {
        next.add(tagId);
      }

      return next;
    });
  }

  const categories =
    applicationData
      ? [...applicationData.tagCategories]
      : [];

  const tags =
    applicationData
      ? [...applicationData.tags]
      : [];

  const hasUserAccepted =
    !!userToken &&
    acceptedTokens?.includes(userToken);
  
  const hasEveryoneAccepted =
    acceptedTokens?.length === 2;

  if (!hasUserAccepted) {
    // User has not yet accepted, UI should be shown to select allowed tags
    if (!applicationData) {
      return <section id="center">Loading...</section>;
    }

    return (
      <section id="center">
        <h1>Select allowed tags</h1>

        {categories.map(category => (
          <div key={category.id}>
            <h2>{category.description}</h2>

            {tags
              .filter(tag => tag.category.id === category.id)
              .map(tag => (
                <label
                  key={tag.id}
                  style={{
                    display: "block",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.has(tag.id)}
                    onChange={() => toggleTag(tag.id)}
                  />

                  {tag.description}
                </label>
              ))}
          </div>
        ))}

        <button
          onClick={accept}
          disabled={isSubmitting}
        >
          Accept
        </button>
      </section>
    );
  } else {
    // User has accpeted
    // if both users have accepted, UI should show filteredActivities, chosenActivity
    // if only curren user has accepted, UI should be shown of waiting for another user accepting
    if (!hasEveryoneAccepted) {
      return (
        <section id="center">
          <h1>Waiting...</h1>

          <p>
            Waiting for the other participant to accept.
          </p>

          <p>
            Accepted: {acceptedTokens?.length ?? 0} / 2
          </p>
        </section>
      );
    } else {
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
  }
}
