import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { useBackend } from "../client/BackendContext";
import type { ApplicationData, RawActivity } from "../model/application-data";
import TagSelection from "./TagSelection";
import WaitingForParticipant from "./WaitingForParticipant";
import SessionResults from "./SessionResults";

import { Center, Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";

export default function SessionPage() {
  const { sessionId, userToken } = useParams();
  const backend = useBackend();

  const [applicationData, setApplicationData] = useState<ApplicationData>();
  const [acceptedTokens, setAcceptedTokens] = useState<string[]>();
  const [filteredActivities, setFilteredActivities] = useState<RawActivity[] | null>();
  const [chosenActivity, setChosenActivity] = useState<RawActivity | null>();

  const [selectedTags, setSelectedTags] = useState(new Set<string>());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wasNotifiedForAcceptance = useRef(false);

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

    return backend.sessions.subscribe(sessionId, event => {
      setAcceptedTokens(previous => {
        const previousCount = previous?.length ?? 0;
        const newCount = event.acceptedTokens.length;

        // Another participant accepted while this user is still choosing tags
        if (
          previousCount < newCount &&
          userToken &&
          !event.acceptedTokens.includes(userToken) &&
          !wasNotifiedForAcceptance.current
        ) {
          wasNotifiedForAcceptance.current = true;

          notifications.show({
            title: "Participant joined",
            message: "The other participant has accepted their tags.",
            color: "blue",
          });
        }

        return event.acceptedTokens;
      });
    });
  }, [backend, sessionId, userToken]);

  useEffect(() => {
    wasNotifiedForAcceptance.current = false;
  }, [sessionId]);

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

  const hasUserAccepted =
    !!userToken &&
    acceptedTokens?.includes(userToken);

  const hasEveryoneAccepted =
    acceptedTokens?.length === 2;

  if (!hasUserAccepted) {
    if (!applicationData) {
      return (
        <Center h="100vh">
          <Loader size="lg" />
        </Center>
      );
    }

    return (
      <TagSelection
        applicationData={applicationData}
        selectedTags={selectedTags}
        onToggleTag={toggleTag}
        onAccept={accept}
        isSubmitting={isSubmitting}
      />
    );
  }

  if (!hasEveryoneAccepted) {
    return (
      <WaitingForParticipant
        acceptedCount={acceptedTokens?.length ?? 0}
      />
    );
  }

  return (
    <SessionResults
      filteredActivities={filteredActivities}
      chosenActivity={chosenActivity}
    />
  );
}
